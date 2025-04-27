import { Auth } from '../context/AuthProvider.tsx';
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
                body: JSON.stringify({refreshToken: refreshToken }),
                credentials: 'include',
                headers
            }
        )
        .then(async (res) => {
            const text = await res.text();
            return JSON.parse(text) as RefreshResponse;
        });

        setAuth(prev => {
            console.log('prev auth - useRefreshToken', JSON.stringify(prev));
            console.log('response auth - useRefreshToken', JSON.stringify(response));
            return {
                ...prev,
                token: response.token
            } as Auth;
        });

        return response.token;
    }

    return refresh;
};

export default UseRefreshToken;
