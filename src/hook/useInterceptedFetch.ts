import { Endpoint } from '../util/endpoint/WebEndpoint.ts';
import useAuth from './useAuth.ts';
import useRefreshToken from './useRefreshToken.ts';


interface useInterceptedFetchProps {
    endpoint: Endpoint,
    reqInit?: RequestInit
}

const MAX_RETRIES = 3;

const useInterceptedFetch = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    let retries = MAX_RETRIES;
    const interceptedFetch = async ({endpoint, reqInit}: useInterceptedFetchProps) => {
        console.log('started intercepted fetch');
        const interceptedFetchHeaders = new Headers(reqInit?.headers);
        if (interceptedFetchHeaders.get('Authorization') == null) {
            interceptedFetchHeaders.set('Authorization', `Bearer ${auth.token}`);
        }
        console.log('before send headers: ', interceptedFetchHeaders.get('Authorization'));

        if ( reqInit !== undefined ) {
            reqInit.headers = interceptedFetchHeaders;
        }

        return fetch(endpoint, reqInit)
            .then(async (res): Promise<Response> => {
                console.log('retry number: ', retries);
                console.log('response', res);
                console.log('auth', auth)

                if (--retries < 0) {
                    console.log('negative retries, reject');
                    return Promise.reject(`Already proccessed number of retries: ${MAX_RETRIES}`);
                }
                const headers = res.headers;

                if (res.status === 403) {
                    console.log('refreshed access token')
                    const newAccessToken = await refresh();

                    const newHeaders = new Headers(headers);
                    newHeaders.set('Content-Type', 'application/json');
                    newHeaders.set('Authorization', `Bearer ${newAccessToken}`);

                    console.log('after send headers: ', newHeaders.get('Authorization'));

                    return await interceptedFetch({endpoint: endpoint, reqInit: { ...reqInit, headers: newHeaders }});
                } else {
                    console.log('Returning result and reset retries, res: ', res)
                    retries = MAX_RETRIES;
                    return res;
                }
            });
    }

    return interceptedFetch;

};
export default useInterceptedFetch;
