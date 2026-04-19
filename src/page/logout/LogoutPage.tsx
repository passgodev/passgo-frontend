import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertContext from '../../context/AlertProvider.tsx';
import useAuth from '../../hook/useAuth.ts';
import useInterceptedFetch from '../../hook/useInterceptedFetch.ts';
import API_ENDPOINTS from '../../util/endpoint/ApiEndpoint.ts';
import WEB_ENDPOINTS from '../../util/endpoint/WebEndpoint.ts';
import HttpMethod from '../../util/HttpMethod.ts';

const LogoutPage = () => {
    const interceptedFetch = useInterceptedFetch();
    const { auth } = useAuth();
    const { showAlert } = useContext(AlertContext);
    const navigate = useNavigate();

    useEffect(() => {
        const hitLogout = async () => {
            console.log(`Logout of user with refreshToken: ${auth.refreshToken ?? localStorage.getItem('passgoRT')}`);

            const endpoint = API_ENDPOINTS.logout;
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            await interceptedFetch({ endpoint, reqInit: {
                method: HttpMethod.POST,
                credentials: 'include',
                body: JSON.stringify({
                    refreshToken: auth.refreshToken ?? localStorage.getItem('passgoRT')
                }),
                headers
            }})
                .then(res => {
                    if (res.status == 204) {
                        localStorage.removeItem('passgoRT');
                        showAlert('Successfully logged out', 'info');
                    } else {
                        console.log('LogoutPage - status !== 204', res);
                        showAlert(res.status.toString(), 'error');
                    }
                });
        };
        console.log('HitLogout');
        hitLogout();
    }, []);

    return (
        <div
            className="bg-[#f7f9fb] text-[#2a3439] min-h-screen flex flex-col font-[Inter]"
            style={{
                backgroundImage:
                    'linear-gradient(to right, rgba(169,180,185,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(169,180,185,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }}
        >
            {/* Nav */}
            <nav className="bg-[#f8fafc] border-b border-[#cbd5e1] flex justify-between items-center px-6 h-14 fixed top-0 w-full z-50">
                <span className="text-lg font-black tracking-tighter text-[#0f172a] uppercase">Passgo</span>
                <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[#64748b]">help_outline</span>
                    <span className="material-symbols-outlined text-[#64748b]">vpn_key</span>
                </div>
            </nav>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center pt-14 pb-20 px-4">
                <div className="w-full max-w-md bg-white border border-[#a9b4b9]/30 p-1">
                    <div className="border border-[#a9b4b9] p-8 flex flex-col items-center text-center">
                        {/* Brand */}
                        <div className="mb-12">
                            <div className="flex items-center justify-center mb-1">
                                <div className="w-8 h-8 bg-[#0053db] flex items-center justify-center mr-2">
                                    <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                                </div>
                                <h1 className="text-xl font-black tracking-tighter text-[#2a3439] uppercase">Passgo</h1>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#717c82]">Secure Ticketing Platform</p>
                        </div>

                        {/* Icon */}
                        <div className="mb-8 w-20 h-20 rounded-full border border-[#a9b4b9] flex items-center justify-center bg-[#e8eff3]">
                            <span className="material-symbols-outlined text-4xl text-[#717c82]">lock</span>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 mb-10">
                            <h2 className="text-2xl font-bold tracking-tight uppercase text-[#2a3439]">Session Terminated</h2>
                            <div className="w-12 h-0.5 bg-[#0053db] mx-auto" />
                            <p className="text-sm text-[#566166] leading-relaxed max-w-[280px] mx-auto">
                                Your secure session has been successfully closed. All local temporary cache data has been purged.
                            </p>
                        </div>

                        {/* Action */}
                        <div className="w-full space-y-4">
                            <button
                                onClick={() => navigate(WEB_ENDPOINTS.login, { replace: true })}
                                className="block w-full bg-[#0053db] text-white py-3 px-6 text-sm font-bold uppercase tracking-widest hover:bg-[#0048c1] transition-colors active:scale-[0.98] cursor-pointer"
                            >
                                Return to Authentication
                            </button>
                            <div className="flex items-center justify-center gap-4 py-4">
                                <div className="h-px flex-grow bg-[#a9b4b9]/20" />
                                <span className="text-[10px] font-bold text-[#717c82] uppercase tracking-widest whitespace-nowrap">Security Checkpoint</span>
                                <div className="h-px flex-grow bg-[#a9b4b9]/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#f1f5f9] fixed bottom-0 w-full flex justify-between items-center px-6 py-4 border-t border-[#cbd5e1] z-50">
                <span className="text-[#94a3b8] font-bold text-[10px] tracking-widest uppercase">
                    © 2024 Passgo. Secured Terminal.
                </span>
                <span className="text-[10px] font-bold text-[#0053db] uppercase tracking-widest">v4.8.2-SECURE</span>
            </footer>
        </div>
    );
};

export default LogoutPage;