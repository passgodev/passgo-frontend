import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hook/useAuth.ts';

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log('auth', auth);

    return (
        auth?.token
            ? <Outlet />
            : <Navigate to="/login" state={{from: location}} replace />
    );
}

export default RequireAuth;