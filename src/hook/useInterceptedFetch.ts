import { useLocation, useNavigate } from 'react-router-dom';
import { retrieveExpiredAtDate } from '../util/AccessTokenUtil.ts';
import { Endpoint } from '../util/endpoint/Endpoint.ts';
import WEB_ENDPOINTS from '../util/endpoint/WebEndpoint.ts';
import { loggerPrelogWithFactory } from '../util/logger/Logger.ts';
import useAuth from './useAuth.ts';
import useRefreshToken from './useRefreshToken.ts';

interface useInterceptedFetchProps {
    endpoint: Endpoint;
    reqInit?: RequestInit;
    _retryCount?: number;     // Internal: safely tracks retries per-request
    _tokenOverride?: string;  // Internal: bypasses React's async state delay during refresh
}

const MAX_RETRIES = 3;
const logger = loggerPrelogWithFactory('[useInterceptedFetch]');

const useInterceptedFetch = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const interceptedFetch = async ({ 
        endpoint, 
        reqInit, 
        _retryCount = 0, 
        _tokenOverride 
    }: useInterceptedFetchProps): Promise<Response> => {
        
        logger.log(`invoked - fetching (Retry: ${_retryCount})`, endpoint);

        if (_retryCount >= MAX_RETRIES) {
            logger.log('Max retries reached, aborting...');
            return Promise.reject(`Already processed number of retries: ${MAX_RETRIES}`);
        }

        // 1. Create fresh copies to avoid mutating the original object across retries
        const init = reqInit ? { ...reqInit } : {};
        const headers = new Headers(init.headers);

        // 2. ALWAYS set the Authorization header. 
        // We use _tokenOverride if we just refreshed, otherwise fallback to React state.
        const currentToken = _tokenOverride || auth?.token;
        if (currentToken) {
            headers.set('Authorization', `Bearer ${currentToken}`);
        }

        init.headers = headers;

        try {
            // 3. Execute the fetch
            const res = await fetch(endpoint, init);

            // 4. Spring Boot usually returns 401 for expired tokens (sometimes 403)
            if (res.status === 401 || res.status === 403) {
                logger.log(`Got status ${res.status}, checking if token expired`);

                if (!auth?.token) {
                    return res; // We aren't logged in, just return the 403/401
                }

                const isTokenExpired = retrieveExpiredAtDate(auth?.token) < new Date();

                if (isTokenExpired) {
                    logger.log('Token IS expired! Attempting to refresh...');
                    const newAccessToken = await refresh();

                    if (!newAccessToken) {
                        logger.log('Refresh failed. Session dead. Navigating to login.');
                        navigate(WEB_ENDPOINTS.login, { state: { from: location }, replace: true });
                        return Promise.reject('Refresh token expired or invalid');
                    }

                    logger.log('Refresh successful! Retrying original request with new token.');
                    
                    // 5. Recurse! Pass the new token into _tokenOverride so we don't wait for React to re-render
                    return await interceptedFetch({ 
                        endpoint, 
                        reqInit: init, 
                        _retryCount: _retryCount + 1, 
                        _tokenOverride: newAccessToken 
                    });
                } else {
                    logger.log(`Endpoint returned ${res.status}, but token is valid. Insufficient permissions.`);
                    return res;
                }
            }

            // If it's not a 401/403, just return the successful (or 404/500) response
            logger.log('Successfully fetched resource. Response: ', res.status);
            return res;

        } catch (error) {
            logger.log('Network error encountered', error);
            throw error;
        }
    };

    return interceptedFetch;
};

export default useInterceptedFetch;