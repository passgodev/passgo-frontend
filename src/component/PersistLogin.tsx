import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useRefreshToken from '../hook/useRefreshToken.ts';
import useAuth from '../hook/useAuth.ts';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.log('persistLogin error', err);
            }
            finally {
                setIsLoading(false);
            }
        }

        console.log('auth', auth);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        !auth?.token ? verifyRefreshToken() : setIsLoading(false);
    }, []);


    useEffect(() => {
        console.log('isLoading', isLoading);
        console.log('access token: ', JSON.stringify(auth?.token));
    }, [isLoading])

    return (
        <>
            {
                isLoading
                ? <p>Loading...</p>
                : <Outlet />
            }
        </>
    )
}

export default PersistLogin;