import { Navigate, Outlet, useLocation } from 'react-router-dom';
import FeatureFlag from '../FeatureFlag.ts';
import useAuth from '../hook/useAuth.ts';


interface RequireAuthProps {
    allowedRoles?: string[]
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log('auth', auth);

    const doesContainRole = allowedRoles?.includes(auth.memberType!) ?? true;

    return (
        auth?.token || !FeatureFlag.requireAuth
            ? doesContainRole || !FeatureFlag.requireRole
                ? <Outlet />
                : <Navigate to='/unauthorized' state={{from: location}} replace />
            : <Navigate to="/login" state={{from: location}} replace />
    );
}

export default RequireAuth;