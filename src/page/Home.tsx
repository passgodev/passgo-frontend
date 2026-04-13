import { Link } from "react-router-dom";
import WebEndpoints from "../util/endpoint/WebEndpoint";

const Home = () => {
    return (
        <div className="min-h-screen bg-[#f7f9fb] flex flex-col items-center justify-center relative selection:bg-[#dbe1ff]">
            {/* Structural Background Ledger Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, #a9b4b9 1px, transparent 1px), linear-gradient(to bottom, #a9b4b9 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="z-10 text-center max-w-2xl px-6 flex flex-col items-center">

                {/* Status Indicator */}
                <div className="mb-6 border border-[#0053db]/30 bg-[#0053db]/5 text-[#0053db] px-3 py-1 rounded-full flex items-center gap-2 w-max">
                    <span className="w-2 h-2 rounded-full bg-[#0053db] animate-pulse"></span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">System Online</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-[#2a3439] tracking-tighter mb-4 uppercase">
                    PassGo <span className="text-[#0053db]">Logistics</span>
                </h1>

                <p className="text-[#566166] text-sm md:text-base font-medium mb-10 max-w-lg mx-auto">
                    High-density event administration and secure credential infrastructure. Access the global ledger to discover, manage, and audit technical events.
                </p>

                <div className="flex gap-4 justify-center w-full">
                    <Link to={WebEndpoints.events} className="bg-[#0053db] text-white px-8 py-3 rounded-sm uppercase tracking-widest text-[11px] font-bold hover:bg-blue-700 transition-colors shadow-md">
                        Enter Global Ledger
                    </Link>
                    <Link to={WebEndpoints.login} className="bg-white text-[#2a3439] border border-[#717c82]/30 px-8 py-3 rounded-sm uppercase tracking-widest text-[11px] font-bold hover:bg-slate-50 transition-colors">
                        System Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default Home;