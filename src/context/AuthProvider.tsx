import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";
import Privilege from '../model/member/Privilege.ts';

interface AuthProviderProps {
    children: ReactNode;
}

interface Auth {
    memberId?: string,
    token?: string,
    refreshToken?: string,
    privilege?: Privilege
}

interface IAuthContext {
    auth: Auth,
    setAuth:  Dispatch<SetStateAction<Auth>>
}

const AuthContext = createContext<IAuthContext>({
    auth: {},
    setAuth: () => {}
});

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<Auth>({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
};

export { AuthProvider, type Auth }

export default AuthContext;