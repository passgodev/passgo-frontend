import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FallbackCard from '../../component/page/FallbackCard.tsx';
import AlertContext from '../../context/AlertProvider.tsx';
import useAuth from '../../hook/useAuth.ts';
import useInterceptedFetch from '../../hook/useInterceptedFetch.ts';
import API_ENDPOINTS from '../../util/endpoint/ApiEndpoint.ts';
import WEB_ENDPOINTS from '../../util/endpoint/WebEndpoint.ts';
import HttpMethod from '../../util/HttpMethod.ts';


const LogoutPage = () => {
    const interceptedFetch = useInterceptedFetch();
    const { auth } = useAuth();
    const { showAlert } = useContext(AlertContext);
    const navigate = useNavigate();

    useEffect(() => {
        const hitLogout = async () => {
            console.log(`Logout of user with refreshToken: ${auth.refreshToken ?? localStorage.getItem('passgoRT')}`);

            const endpoint = API_ENDPOINTS.logout;
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            await interceptedFetch({ endpoint, reqInit: {
                method: HttpMethod.POST,
                credentials: 'include',
                body: JSON.stringify({
                    refreshToken: auth.refreshToken ?? localStorage.getItem('passgoRT')
                }),
                headers
            }})
                .then(res => {
                    if ( res.status == 204 ) {
                        localStorage.removeItem('passgoRT');
                        showAlert('Successfully logged out', 'info');
                    } else {
                        console.log('LogoutPage - status !== 204', res);
                        showAlert(res.status.toString(), 'error');
                    }
                });
        }
        console.log('HitLogout');
        hitLogout();
    }, []);

    return (
        <FallbackCard title='Logged out' navigateTo={{
            name: 'Log-in',
            callback: () => navigate(WEB_ENDPOINTS.login, {
                replace: true
            })
        }} />
    );
};
export default LogoutPage;
