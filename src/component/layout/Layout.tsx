import { CssBaseline } from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hook/useAuth.ts";
import Privilege from "../../model/member/Privilege.ts";
import WEB_ENDPOINTS from "../../util/endpoint/WebEndpoint.ts";
import { useState } from "react";






const Layout = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isClient = auth?.privilege === Privilege.CLIENT;
    const isOrganizer = auth?.privilege === Privilege.ORGANIZER;
    const isAdmin = auth?.privilege === Privilege.ADMINISTRATOR;

    // 2. Inside your Layout component, add this state:
    const [searchQuery, setSearchQuery] = useState("");

    // 3. Add this function to handle the Enter key:
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim() !== "") {
            navigate(`${WEB_ENDPOINTS.events}?q=${encodeURIComponent(searchQuery)}`);
        } else if (e.key === "Enter" && searchQuery.trim() === "") {
            navigate(WEB_ENDPOINTS.events); // Clear search
        }
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate(WEB_ENDPOINTS.logout, { replace: true });
    };

    return (
        <div className="bg-background text-on-surface min-h-screen flex selection:bg-primary/20 font-sans">
            <CssBaseline />
            
            {/* Sidebar Navigation */}
            <aside className="fixed left-0 top-0 h-screen w-60 border-r border-slate-300 bg-slate-100 flex flex-col py-4 z-50 shrink-0">
                <div className="px-6 mb-8">
                    <h1 className="text-xl font-black text-slate-900">PassGo Admin</h1>
                    <p className="uppercase tracking-wider text-[10px] font-bold text-slate-500">Precision Logistics</p>
                </div>

                <nav className="flex flex-col space-y-1 px-3">
                    <Link to={WEB_ENDPOINTS.events} className={`flex items-center px-3 py-2 cursor-pointer transition-all duration-150 group rounded-sm ${location.pathname === WEB_ENDPOINTS.events ? 'bg-slate-200/50 text-blue-700 border-l-4 border-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}>
                        <span className="material-symbols-outlined mr-3 text-[20px]">search</span>
                        <span className="uppercase tracking-wider text-[11px] font-bold">Events Hub</span>
                    </Link>

                    {(isClient || isAdmin) && (
                        <Link to={WEB_ENDPOINTS.activeMemberProfile} className={`flex items-center px-3 py-2 cursor-pointer transition-all duration-150 group rounded-sm ${location.pathname === WEB_ENDPOINTS.activeMemberProfile ? 'bg-slate-200/50 text-blue-700 border-l-4 border-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}>
                            <span className="material-symbols-outlined mr-3 text-[20px]">account_balance_wallet</span>
                            <span className="uppercase tracking-wider text-[11px] font-bold">My Dashboard</span>
                        </Link>
                    )}

                    {(isOrganizer || isAdmin) && (
                        <Link to={WEB_ENDPOINTS.building} className={`flex items-center px-3 py-2 cursor-pointer transition-all duration-150 group rounded-sm ${location.pathname === WEB_ENDPOINTS.building ? 'bg-slate-200/50 text-blue-700 border-l-4 border-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}>
                            <span className="material-symbols-outlined mr-3 text-[20px]">domain</span>
                            <span className="uppercase tracking-wider text-[11px] font-bold">Venues & Buildings</span>
                        </Link>
                    )}

                    {isAdmin && (
                        <Link to={WEB_ENDPOINTS.adminClientList} className={`flex items-center px-3 py-2 cursor-pointer transition-all duration-150 group rounded-sm ${location.pathname.includes('admin') ? 'bg-slate-200/50 text-blue-700 border-l-4 border-blue-700' : 'text-slate-500 hover:bg-slate-200'}`}>
                            <span className="material-symbols-outlined mr-3 text-[20px]">group</span>
                            <span className="uppercase tracking-wider text-[11px] font-bold">User Management</span>
                        </Link>
                    )}
                </nav>

                <div className="mt-auto px-6">
                    {(isOrganizer || isAdmin) && (
                        <Link to={WEB_ENDPOINTS.addEvent} className="w-full bg-primary text-on-primary py-2.5 rounded-sm uppercase tracking-wider text-[11px] font-bold hover:bg-primary-dim transition-colors mb-6 flex justify-center shadow-sm">
                            Create Event
                        </Link>
                    )}
                    <div className="space-y-1 border-t border-slate-300 pt-4 -mx-3 px-3">
                        <Link to={WEB_ENDPOINTS.faq} className="flex items-center px-3 py-2 text-slate-500 hover:bg-slate-200 transition-all duration-150 rounded-sm">
                            <span className="material-symbols-outlined mr-3 text-[18px]">help</span>
                            <span className="uppercase tracking-wider text-[11px] font-bold">Help / FAQ</span>
                        </Link>
                        
                        {auth?.token ? (
                            <button onClick={handleLogout} className="w-full flex items-center px-3 py-2 text-slate-500 hover:bg-slate-200 transition-all duration-150 rounded-sm">
                                <span className="material-symbols-outlined mr-3 text-[18px]">logout</span>
                                <span className="uppercase tracking-wider text-[11px] font-bold">Log Out</span>
                            </button>
                        ) : (
                            <Link to={WEB_ENDPOINTS.login} className="w-full flex items-center px-3 py-2 text-blue-700 hover:bg-slate-200 transition-all duration-150 rounded-sm">
                                <span className="material-symbols-outlined mr-3 text-[18px]">login</span>
                                <span className="uppercase tracking-wider text-[11px] font-bold">System Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Stage */}
            <div className="ml-60 flex-1 flex flex-col relative w-full">
                <div className="absolute inset-0 ledger-grid z-0"></div>
                
                {/* Top Navigation */}
                <header className="w-full sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-sm flex justify-between items-center px-6 h-14">
                    <div className="flex items-center gap-4 flex-1">
                        <span className="text-lg font-bold tracking-tight text-primary mr-4 hidden md:block">Precision Explorer</span>
                        
                        {/* Interactive Search Bar */}
                        <div className="relative max-w-md w-full">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                                <input 
                                    type="text" 
                                    placeholder="Filter events by name..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="w-full bg-surface-container-low border border-transparent text-xs pl-9 py-1.5 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-sm transition-all"
                                />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                         <button className="p-2 text-slate-500 hover:bg-slate-100 transition-colors rounded-sm">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
                        
                        {auth?.token ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-bold text-slate-900 leading-none">ID: {auth.memberId}</p>
                                    <p className="text-[9px] text-slate-500 uppercase tracking-tighter">{Privilege[auth.privilege as Privilege]}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-500">person</span>
                                </div>
                            </div>
                        ) : (
                           <Link to={WEB_ENDPOINTS.login} className="text-[11px] font-bold uppercase tracking-widest text-primary hover:underline">
                               Sign In
                           </Link>
                        )}
                    </div>
                </header>

                <main className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;