import { FormEvent, useCallback, useContext, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import AlertContext from '../../context/AlertProvider.tsx';
import { Auth } from '../../context/AuthProvider.tsx';
import useAuth from '../../hook/useAuth.ts';
import { retrieveMemberId, transferMemberTypeToPrivilege } from '../../util/AccessTokenUtil.ts';
import API_ENDPOINTS from '../../util/endpoint/ApiEndpoint.ts';
import WEB_ENDPOINTS from '../../util/endpoint/WebEndpoint.ts';
import HttpMethod from '../../util/HttpMethod.ts';
import logger from '../../util/logger/Logger.ts';

interface LoginResponse {
    token: string;
    refreshToken: string;
}

interface LoginErrorResponse {
    message: string;
}

const parseLoginResponse = (text: string): LoginResponse | undefined => {
    try {
        return JSON.parse(text) as unknown as LoginResponse;
    } catch (e) {
        logger.log('Login Page', 'parseLoginResponse error', e);
        return undefined;
    }
};

const parseErrorMessage = (error: string): string => {
    try {
        const parsedError = JSON.parse(error) as unknown as LoginErrorResponse;
        return parsedError.message;
    } catch (e) {
        logger.log('Login Page', 'parseLoginErrorMessage error', e);
        return error;
    }
};

const fieldLabelClass = 'block text-[10px] font-bold uppercase tracking-wider text-[#566166] mb-1.5';
const inputBaseClass = 'block w-full py-2 bg-white border border-[#a9b4b9] text-sm font-medium placeholder:text-[#a9b4b9]/60 focus:ring-0 focus:border-[#0053db] focus:bg-white transition-all outline-none';

const LoginPage = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { showAlert } = useContext(AlertContext);
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = useCallback(async (event: FormEvent) => {
        event.preventDefault();

        logger.log("Form submitted", "login", login, "password", password);
        const response = await fetch(
            API_ENDPOINTS.login,
            {
                method: HttpMethod.POST,
                body: JSON.stringify({ login, password }),
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            })
            .then(async (res) => {
                logger.log('login response', res);
                const text = await res.clone().text();

                if (res.status === 200) {
                    const jsonResponse = parseLoginResponse(text);
                    if (jsonResponse === undefined) {
                        showAlert('Login response is undefined', 'error');
                        return;
                    }

                    const { token: accessToken, refreshToken } = jsonResponse;
                    const privilege = transferMemberTypeToPrivilege(accessToken);
                    const memberId = retrieveMemberId(accessToken);
                    const authObject: Auth = { memberId, token: accessToken, refreshToken, privilege };
                    logger.log('response 200', 'authObject', authObject);

                    setAuth(authObject);
                    // todo change to http only cookies, do not store it locally
                    localStorage.setItem('passgoRT', refreshToken);

                    setLogin('');
                    setPassword('');

                    navigate(from, { replace: true });
                } else if (res.status >= 400 && res.status < 599) {
                    const errMsg = (text.length !== 0) ? parseErrorMessage(text) : (res.status + ' ' + res.statusText);
                    logger.log('loginPage', 'got res.status between 400 and 599', errMsg);
                    showAlert(errMsg, 'error');
                } else {
                    const errorMessage = `Unexpected response code: ${res.status}`;
                    logger.log('loginPage', errorMessage, 'failed response: ', res);
                    showAlert(errorMessage, 'error');
                }
            })
            .catch(err => {
                const errorMessage = `Error occured while logging in. ${err}`;
                logger.log('loginPage', errorMessage);
                showAlert(errorMessage, 'error');
            });
        logger.log('loginPage', 'proceed response', response);
    }, [from, login, navigate, password, setAuth, showAlert]);

    return (
        <div
            className="bg-[#f7f9fb] text-[#2a3439] min-h-screen flex flex-col items-center justify-center font-[Inter] px-4"
            style={{
                backgroundImage:
                    'linear-gradient(to right, rgba(169,180,185,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(169,180,185,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }}
        >
            <main className="w-full max-w-md">
                {/* Brand */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0053db] text-white mb-4 outline outline-2 outline-offset-2 outline-[#0053db]/20">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
                    </div>
                    <h1 className="text-[#2a3439] font-black text-2xl tracking-tighter uppercase leading-none mb-1">Passgo</h1>
                    <p className="text-[#717c82] text-[10px] uppercase tracking-[0.2em] font-semibold">Secure Ticketing Platform</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-[#a9b4b9] shadow-sm overflow-hidden">
                    <div className="bg-[#e1e9ee] border-b border-[#a9b4b9] py-3 px-6">
                        <h2 className="text-[#566166] text-xs font-bold uppercase tracking-widest">Authentication Terminal</h2>
                    </div>

                    <div className="p-6 md:p-8">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Identity / Email */}
                            <div className="space-y-1.5">
                                <label className={fieldLabelClass} htmlFor="login">Identity / Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a9b4b9] group-focus-within:text-[#0053db] transition-colors">
                                        <span className="material-symbols-outlined text-sm">person</span>
                                    </div>
                                    <input
                                        id="login"
                                        className={`${inputBaseClass} pl-9 pr-3`}
                                        type="text"
                                        placeholder="Email Address"
                                        onChange={(e) => setLogin(e.target.value)}
                                        value={login}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-end">
                                    <label className={fieldLabelClass} htmlFor="password">Security Protocol / Password</label>
                                    <span className="text-[9px] uppercase font-bold tracking-tight text-[#0053db] cursor-default select-none">
                                        Reset Password
                                    </span>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a9b4b9] group-focus-within:text-[#0053db] transition-colors">
                                        <span className="material-symbols-outlined text-sm">lock</span>
                                    </div>
                                    <input
                                        id="password"
                                        className={`${inputBaseClass} pl-9 pr-10`}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#a9b4b9] hover:text-[#2a3439] transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center pt-1">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="w-3.5 h-3.5 text-[#0053db] bg-white border-[#a9b4b9] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                                />
                                <label htmlFor="remember" className="ml-2 text-[10px] uppercase font-semibold tracking-wide text-[#566166] cursor-pointer">
                                    Maintain persistent session
                                </label>
                            </div>

                            {/* Submit */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full flex justify-center items-center py-2.5 px-4 bg-[#0053db] text-white text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#0048c1] active:scale-[0.98] transition-all shadow-md cursor-pointer"
                                >
                                    Authorize Access
                                    <span className="material-symbols-outlined ml-2 text-sm">login</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Card footer */}
                    <div className="bg-[#e8eff3] py-3 px-6 border-t border-[#a9b4b9] flex justify-center items-center">
                        <span className="text-[#717c82] text-[10px] uppercase tracking-wider">New personnel?</span>
                        <button
                            onClick={() => navigate(WEB_ENDPOINTS.signup)}
                            className="ml-2 text-[#0053db] font-bold text-[10px] uppercase tracking-wider hover:underline underline-offset-2 cursor-pointer"
                        >
                            Register Identity
                        </button>
                    </div>
                </div>
            </main>

            {/* Edge lines */}
            <div className="fixed top-0 left-0 w-12 h-full border-r border-[#a9b4b9]/10 pointer-events-none hidden md:block" />
            <div className="fixed top-0 right-0 w-12 h-full border-l border-[#a9b4b9]/10 pointer-events-none hidden md:block" />
            <div className="fixed bottom-0 left-0 w-full h-12 border-t border-[#a9b4b9]/10 pointer-events-none hidden md:block" />
        </div>
    );
};

export default LoginPage;