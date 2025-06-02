import { useLocation, useNavigate } from 'react-router-dom';
import { retrieveExpiredAtDate } from '../util/AccessTokenUtil.ts';
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

const logger = loggerPrelogWithFactory('[useInterceptedFetch]');

const initializeRequestHeaders = (requestInit: RequestInit | undefined, authToken: string): RequestInit => {
    if (requestInit === undefined) {
        requestInit = {} as RequestInit;
    }

    const interceptedFetchHeaders = new Headers(requestInit.headers);
    if (interceptedFetchHeaders.get('Authorization') == null) {
        logger.log('appending missing "Authorization" header');
        interceptedFetchHeaders.set('Authorization', `Bearer ${authToken}`);
    }

    requestInit.headers = interceptedFetchHeaders;
    return requestInit;
}

const useInterceptedFetch = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    let retries = MAX_RETRIES;
    const interceptedFetch = async ({ endpoint, reqInit }: useInterceptedFetchProps) => {
        logger.log('invoked - fetching', endpoint);

        reqInit = initializeRequestHeaders(reqInit, auth.token!);

        return fetch(endpoint, reqInit)
            .then(res => {
                logger.log('Retries remaining: ', retries);
                if (--retries < 0) {
                    logger.log('Negative retries, aborting...');
                    retries = MAX_RETRIES;
                    return Promise.reject(`Already proccessed number of retries: ${MAX_RETRIES}`);
                } else {
                    return res;
                }
            })
            .then(async (res): Promise<Response> => {
                logger.log('Response', res);
                logger.log('AuthObject', auth)

                if (res.status === 403) {
                    logger.log('Got status 403, FORBIDDEN, try to refresh accessToken');

                    let accessToken = auth.token!;
                    const doesTokenExpired = (retrieveExpiredAtDate(auth.token!) < new Date(Date.now()))
                    if (doesTokenExpired) {
                        const newAccessToken = await refresh();

                        if ( newAccessToken === undefined ) {
                            logger.log('Access Token is undefined, probably expired', 'navigating to home page');
                            navigate(WEB_ENDPOINTS.login, {state: {from: location}, replace: true});
                            return Promise.reject('Refresh token expired');
                        } else {
                            accessToken = newAccessToken;
                        }

                        reqInit = initializeRequestHeaders(reqInit, accessToken);
                        return await interceptedFetch({ endpoint, reqInit });
                    } else {
                        logger.log('Endpoint returned 403, while logged in', 'insufficient permissions');
                        return res;
                    }
                } else {
                    logger.log('Successfully fetched resource. Response: ', res)
                    return res;
                }
            })
            .then(res => {
                logger.log(`Restored retries from ${retries} to ${MAX_RETRIES}`);
                retries = MAX_RETRIES;
                return res;
            })
    }

    return interceptedFetch;
};

export default useInterceptedFetch;
