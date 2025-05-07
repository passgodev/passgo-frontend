import { Navigate, Outlet, useLocation } from 'react-router-dom';
import FeatureFlag from '../FeatureFlag.ts';
import useAuth from '../hook/useAuth.ts';
import Privilege from '../model/member/Privilege.ts';
import WEB_ENDPOINTS from '../util/endpoint/WebEndpoint.ts';


interface RequireAuthProps {
    allowedRoles?: Privilege[]
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const { auth } = useAuth();
    const location = useLocation();
    console.log('auth', auth);

    const doesContainRole = allowedRoles?.includes(auth.privilege!) ?? true;

    return (
        auth?.token || !FeatureFlag.requireAuth
            ? doesContainRole || !FeatureFlag.requireRole
                ? <Outlet />
                : <Navigate to={WEB_ENDPOINTS.unauthorized} state={{from: location}} replace />
            : <Navigate to={WEB_ENDPOINTS.login} state={{from: location}} replace />
    );
}

export default RequireAuth;