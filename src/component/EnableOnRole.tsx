import { ReactNode } from 'react';
import FeatureFlag from '../FeatureFlag.ts';
import useAuth from '../hook/useAuth.ts';
import Privilege from '../model/member/Privilege.ts';


interface EnableOnRoleProps {
    children: ReactNode,
    allowedRoles?: Privilege[]
}

const EnableOnRole = ({ children, allowedRoles }: EnableOnRoleProps) => {
    const { auth } = useAuth();

    const doesContainRole = allowedRoles?.includes(auth.privilege!) ?? false;

    return doesContainRole || !FeatureFlag.roleEnabled
        ? <>{children}</>
        : <></>
};

export default EnableOnRole;
