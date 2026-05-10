import { useNavigate } from 'react-router-dom';
import WEB_ENDPOINTS from '../util/endpoint/WebEndpoint.ts';

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#f7f9fb]"
            style={{
                backgroundImage:
                    'linear-gradient(to right, rgba(169,180,185,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(169,180,185,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }}
        >
            <div className="w-full max-w-md bg-white border border-[#a9b4b9]/30 p-1">
                <div className="border border-[#a9b4b9] p-8 flex flex-col items-center text-center">
                    {/* Brand */}
                    <div className="mb-12">
                        <div className="flex items-center justify-center mb-1">
                            <div className="w-8 h-8 bg-[#0053db] flex items-center justify-center mr-2">
                                <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                            </div>
                            <h1 className="text-xl font-black tracking-tighter text-[#2a3439] uppercase">Passgo</h1>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#717c82]">Secure Ticketing Platform</p>
                    </div>

                    {/* Icon */}
                    <div className="mb-8 w-20 h-20 rounded-full border border-[#a9b4b9] flex items-center justify-center bg-[#e8eff3]">
                        <span className="material-symbols-outlined text-4xl text-[#717c82]">search_off</span>
                    </div>

                    {/* Content */}
                    <div className="space-y-4 mb-10">
                        <h2 className="text-2xl font-bold tracking-tight uppercase text-[#2a3439]">404 Not Found</h2>
                        <div className="w-12 h-0.5 bg-[#0053db] mx-auto" />
                        <p className="text-sm text-[#566166] leading-relaxed max-w-[280px] mx-auto">
                            The requested resource could not be located. The route may have been moved or does not exist.
                        </p>
                    </div>

                    {/* Action */}
                    <div className="w-full">
                        <button
                            onClick={() => navigate(WEB_ENDPOINTS.home)}
                            className="block w-full bg-[#0053db] text-white py-3 px-6 text-sm font-bold uppercase tracking-widest hover:bg-[#0048c1] transition-colors active:scale-[0.98] cursor-pointer"
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;