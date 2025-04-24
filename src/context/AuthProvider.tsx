import { createContext,  ReactNode,  useState } from "react";

interface AuthProviderProps {
    children: ReactNode;
}

interface Auth {
    token?: string
}

interface IAuthContext {
    auth: Auth,
    setAuth: (val: Auth) => void
}

const AuthContext = createContext<IAuthContext>({
    auth: {},
    setAuth: () => {}
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState<Auth>({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthContext;