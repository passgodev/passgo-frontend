import { useLocation, useNavigate } from 'react-router-dom';
import { Endpoint } from '../util/endpoint/Endpoint.ts';
import WEB_ENDPOINTS from '../util/endpoint/WebEndpoint.ts';
import { loggerPrelogWithFactory } from '../util/logger/Logger.ts';
import useAuth from './useAuth.ts';
import useRefreshToken from './useRefreshToken.ts';


interface useInterceptedFetchProps {
    endpoint: Endpoint,
    reqInit?: RequestInit
}

const MAX_RETRIES = 3;

const logger = loggerPrelogWithFactory('[useInterceptedFetch]')


const useInterceptedFetch = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    let retries = MAX_RETRIES;
    const interceptedFetch = async ({ endpoint, reqInit }: useInterceptedFetchProps) => {
        logger.log('invoked');

        const interceptedFetchHeaders = new Headers(reqInit?.headers);
        if (interceptedFetchHeaders.get('Authorization') == null) {
            interceptedFetchHeaders.set('Authorization', `Bearer ${auth.token}`);
        }
        logger.log('headers appended: ', interceptedFetchHeaders.get('Authorization'));

        if ( reqInit !== undefined ) {
            reqInit.headers = interceptedFetchHeaders;
        }

        return fetch(endpoint, reqInit)
            .then(async (res): Promise<Response> => {
                logger.log('Retries remaining: ', retries);
                logger.log('Response', res);
                logger.log('AuthObject', auth)

                if (--retries < 0) {
                    logger.log('Negative retries, aborting...');
                    return Promise.reject(`Already proccessed number of retries: ${MAX_RETRIES}`);
                }
                const headers = res.headers;

                if (res.status === 403) {
                    logger.log('Got status 403, FORBIDDEN, try to refresh accessToken');
                    const newAccessToken = await refresh();

                    if ( newAccessToken === undefined ) {
                        logger.log('Access Token is undefined, probably expired', 'navigating to home page');
                        navigate(WEB_ENDPOINTS.login, {state: {from: location}, replace: true});
                    }

                    const newHeaders = new Headers(headers);
                    newHeaders.set('Content-Type', 'application/json');
                    newHeaders.set('Authorization', `Bearer ${newAccessToken}`);

                    logger.log('Headers after token has been refreshed: ', newHeaders.get('Authorization'));

                    return await interceptedFetch({endpoint: endpoint, reqInit: { ...reqInit, headers: newHeaders }});
                } else {
                    logger.log('Successfully fetched resource. Response: ', res)
                    retries = MAX_RETRIES;
                    return res;
                }
            });
    }

    return interceptedFetch;

};
export default useInterceptedFetch;
