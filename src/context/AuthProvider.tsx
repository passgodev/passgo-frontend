import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

interface Auth {
    token?: string,
    refreshToken?: string,
    memberType?: string
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