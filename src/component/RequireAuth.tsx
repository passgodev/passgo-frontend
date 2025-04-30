import { useLocation, Navigate, Outlet } from 'react-router-dom';
import FeatureFlag from '../FeatureFlag.ts';
import useAuth from '../hook/useAuth.ts';

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log('auth', auth);

    return (
        auth?.token || !FeatureFlag.requireAuth
            ? <Outlet />
            : <Navigate to="/login" state={{from: location}} replace />
    );
}

export default RequireAuth;