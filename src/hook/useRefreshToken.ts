import { Auth } from '../context/AuthProvider.tsx';
import { retrieveMemberId, transferMemberTypeToPrivilege } from '../util/AccessTokenUtil.ts';
import ApiEndpoint from '../util/endpoint/ApiEndpoint.ts';
import HttpMethod from '../util/HttpMethod.ts';
import { loggerPrelogWithFactory } from '../util/logger/Logger.ts';
import useAuth from './useAuth';


interface RefreshResponse {
    refreshToken: string;
    token: string;
}

const logger = loggerPrelogWithFactory('[useRefreshToken]')


const UseRefreshToken = () => {
    const { auth, setAuth } = useAuth();
    const refreshToken = auth.refreshToken ?? localStorage.getItem('passgoRT');

    const refresh = async () => {
        logger.log('invoked');

        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const response = await fetch(ApiEndpoint.refresh,
            {
                method: HttpMethod.POST,
                body: JSON.stringify({ refreshToken: refreshToken }),
                credentials: 'include',
                headers
            }
        )
        .then(async (res) => {
            const text = await res.text();

            if ( res.status === 200 ) {
                logger.log('Backend responded with code 200', 'response', res);
                return JSON.parse(text) as RefreshResponse;
            } else {
                logger.log('Backend responded with code != 200', 'response', res);
                throw 'useRefreshTokenError';
            }
        });

        logger.log('Received response', response);

        setAuth(prev => {
            const token = response.token;
            const privilege = transferMemberTypeToPrivilege(token);
            const memberId = retrieveMemberId(token);

            const newAuth = {
                ...prev,
                privilege,
                memberId,
                token
            } as Auth;

            logger.log('Prev auth - useRefreshToken', prev);
            logger.log('Current auth - useRefreshToken', newAuth);

            return newAuth
        });

        return response.token;
    }

    return refresh;
};

export default UseRefreshToken;
