import { Auth } from '../context/AuthProvider.tsx';
import { retrieveMemberId, transferMemberTypeToPrivilege } from '../util/AccessTokenUtil.ts';
import ApiEndpoint from '../util/endpoint/ApiEndpoint.ts';
import HttpMethod from '../util/HttpMethod.ts';
import useAuth from './useAuth';


interface RefreshResponse {
    refreshToken: string;
    token: string;
}

const UseRefreshToken = () => {
    const { auth, setAuth } = useAuth();
    const refreshToken = auth.refreshToken ?? localStorage.getItem('passgoRT');

    const refresh = async () => {
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
                return JSON.parse(text) as RefreshResponse;
            }
            throw 'useRefreshTokenError';
        });

        setAuth(prev => {
            console.log('prev auth - useRefreshToken', JSON.stringify(prev));
            console.log('response auth - useRefreshToken', JSON.stringify(response));

            const token = response.token;
            const privilege = transferMemberTypeToPrivilege(token);
            const memberId = retrieveMemberId(token);

            return {
                ...prev,
                privilege,
                memberId,
                token
            } as Auth;
        });

        return response.token;
    }

    return refresh;
};

export default UseRefreshToken;
