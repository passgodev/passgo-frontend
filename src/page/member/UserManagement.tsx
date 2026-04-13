import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useInterceptedFetch from "../../hook/useInterceptedFetch.ts";
import API_ENDPOINTS from "../../util/endpoint/ApiEndpoint.ts";
import WEB_ENDPOINTS from "../../util/endpoint/WebEndpoint.ts";

type UserRole = "CLIENTS" | "ORGANIZERS";

const UserManagement = () => {
    const interceptedFetch = useInterceptedFetch();
    const navigate = useNavigate(); // Added for routing
    const [activeTab, setActiveTab] = useState<UserRole>("CLIENTS");
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async (role: UserRole) => {
        setIsLoading(true);
        const targetType = role === "CLIENTS" ? "CLIENT" : "ORGANIZER";
        const endpoint = API_ENDPOINTS.members.replace(":memberType", targetType);
        
        try {
            const res = await interceptedFetch({ endpoint, reqInit: { method: "GET" } });
            if (res.ok) {
                const data = await res.json();
                const userArray = Array.isArray(data) ? data : (data?.content || []);
                setUsers(userArray);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(activeTab);
    }, [activeTab]);

   // --- ACTION HANDLERS ---

    // 1. Delete & Reject (Removes the user from the database)
    const handleDelete = async (id: number) => {
        const isRejecting = activeTab === "ORGANIZERS" && users.find(u => u.id === id)?.isActive === false;
        const actionWord = isRejecting ? "reject this application" : "permanently delete this user";

        if (!window.confirm(`Are you sure you want to ${actionWord}?`)) return;

        const targetType = activeTab === "CLIENTS" ? "CLIENT" : "ORGANIZER";
        const endpoint = API_ENDPOINTS.memberById
            .replace(":id", id.toString())
            .replace(":memberType", targetType);

        try {
            const res = await interceptedFetch({ endpoint, reqInit: { method: "DELETE" } });
            if (res.ok) {
                fetchUsers(activeTab); // Refresh the table
            } else {
                console.error(`Failed to delete. Backend returned status: ${res.status}`);
                alert("Failed to delete user. Check the console for details.");
            }
        } catch (error) {
            console.error("Network error during deletion:", error);
        }
    };

    // 2. Approve (Activates an organizer)
    const handleApprove = async (id: number) => {
        const endpoint = API_ENDPOINTS.activateOrganizer.replace(":id", id.toString());
        try {
            await interceptedFetch({ endpoint, reqInit: { method: "PATCH" } });
            fetchUsers(activeTab); 
        } catch (error) {
            console.error("Failed to approve organizer:", error);
        }
    };

    // 3. View Details 
    const handleView = (id: number) => {
        // If you have a profile page, you would navigate to it here:
        // navigate(`/admin/users/${id}`);
        alert(`Viewing details for User ID: ${id}\n(You can link this to a full profile page later!)`);
    };

    // 4. Edit User
    const handleEdit = (id: number) => {
        // If you have an edit modal or page, trigger it here:
        alert(`Opening Edit Form for User ID: ${id}\n(You can link this to an edit modal later!)`);
    };

    // Calculate stats based on the exact backend logic
    const activeCount = users.filter(u => u.isActive).length;
    const activePercentage = users.length > 0 ? Math.round((activeCount / users.length) * 100) : 0;
    
    // Pending organizers are simply those where isActive is false/falsy
    const pendingCount = activeTab === "ORGANIZERS" ? users.filter(u => !u.isActive).length : 0;

    return (
        <div className="w-full max-w-7xl mx-auto animation-fade-in">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">System Registry</h1>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        High-Density Registry Access
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-[11px] font-bold uppercase tracking-widest flex items-center hover:bg-slate-50 transition-colors rounded-sm shadow-sm">
                        <span className="material-symbols-outlined text-[16px] mr-2">download</span>
                        Export CSV
                    </button>
                    {/* Fixed: Routes directly to the Signup Page */}
                    <button 
                        onClick={() => navigate(WEB_ENDPOINTS.signup)}
                        className="px-4 py-2 bg-[#0053db] text-white text-[11px] font-bold uppercase tracking-widest flex items-center hover:bg-[#0048c1] transition-colors rounded-sm shadow-sm"
                    >
                        <span className="material-symbols-outlined text-[16px] mr-2">add</span>
                        New Entry
                    </button>
                </div>
            </div>

            {/* Stat Cards Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[
                    { label: "TOTAL REGISTRY", value: users.length.toLocaleString(), icon: "database", color: "text-blue-500" },
                    { label: "ACTIVE STATUS", value: `${activePercentage}%`, icon: "check_circle", color: "text-green-400" },
                    { label: "NEW (24H)", value: "+12", icon: "person_add", color: "text-slate-300" },
                    { label: "PENDING REVIEW", value: pendingCount.toString(), icon: "pending", color: "text-amber-500" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-5 rounded-sm flex justify-between items-center shadow-sm">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                        </div>
                        <span className={`material-symbols-outlined text-4xl ${stat.color}`}>{stat.icon}</span>
                    </div>
                ))}
            </div>

            {/* Main Ledger Table Area */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
                <div className="flex justify-between items-center bg-slate-50/50 border-b border-slate-200 px-4 py-3">
                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Registry Type:</span>
                        <div className="flex bg-slate-200/50 p-1 rounded-sm border border-slate-200">
                            <button 
                                onClick={() => setActiveTab("CLIENTS")}
                                className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all ${activeTab === "CLIENTS" ? "bg-white shadow-sm text-[#0053db]" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Clients
                            </button>
                            <button 
                                onClick={() => setActiveTab("ORGANIZERS")}
                                className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all ${activeTab === "ORGANIZERS" ? "bg-white shadow-sm text-[#0053db]" : "text-slate-500 hover:text-slate-700"}`}
                            >
                                Organizers
                            </button>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing {users.length} Entries
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/50 border-b border-slate-200">
                                <th className="py-3 px-4 w-12"><input type="checkbox" className="rounded-sm border-slate-300" /></th>
                                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">First Name</th>
                                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Last Name</th>
                                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</th>
                                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="py-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right min-w-[140px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        Querying Ledger...
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        No {activeTab.toLowerCase()} found in registry.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => {
                                    // Identify if this is an organizer awaiting approval
                                    // An organizer is pending if their isActive boolean is false
                                    const isPendingOrganizer = activeTab === "ORGANIZERS" && !user.isActive;

                                    return (
                                        <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                                            <td className="py-3 px-4"><input type="checkbox" className="rounded-sm border-slate-300" /></td>
                                            <td className="py-3 px-4 text-slate-400 font-mono text-xs">#ML-{user.id}</td>
                                            <td className="py-3 px-4 font-semibold text-slate-900">{user.firstName || "N/A"}</td>
                                            <td className="py-3 px-4 font-semibold text-slate-900">{user.lastName || "N/A"}</td>
                                            <td className="py-3 px-4 text-slate-500">{user.email}</td>
                                            
                                            {/* Status Badge Update */}
                                            <td className="py-3 px-4">
                                                {isPendingOrganizer ? (
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700 border border-amber-200">PENDING</span>
                                                ) : user.isActive !== false ? (
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-blue-100 text-[#0053db]">ACTIVE</span>
                                                ) : (
                                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-red-100 text-red-700">SUSPENDED</span>
                                                )}
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-3 px-4 text-right flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {isPendingOrganizer ? (
                                                    <>
                                                        <button onClick={() => handleApprove(user.id)} className="px-2 py-1 bg-[#0053db] text-white text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#0048c1] transition-colors shadow-sm">Approve</button>
                                                        
                                                        {/* Reject fires the delete function */}
                                                        <button onClick={() => handleDelete(user.id)} className="px-2 py-1 bg-white border border-red-500 text-red-600 text-[9px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-50 transition-colors shadow-sm">Reject</button>
                                                        
                                                        {/* View Details */}
                                                        <button onClick={() => handleView(user.id)} className="p-1 text-slate-400 hover:text-[#0053db] transition-colors ml-1" title="View Details">
                                                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* Edit User */}
                                                        <button onClick={() => handleEdit(user.id)} className="p-1 text-slate-400 hover:text-[#0053db] transition-colors" title="Edit">
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        
                                                        {/* Delete Active User */}
                                                        <button onClick={() => handleDelete(user.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="bg-white border-t border-slate-200 px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Rows per page: 
                        <select className="border border-slate-200 rounded-sm bg-white px-2 py-1 outline-none">
                            <option>15</option>
                            <option>30</option>
                            <option>50</option>
                        </select>
                    </div>
                    <div className="flex gap-1 text-slate-400">
                        <button className="p-1 hover:text-slate-800"><span className="material-symbols-outlined text-[16px]">keyboard_double_arrow_left</span></button>
                        <button className="p-1 hover:text-slate-800"><span className="material-symbols-outlined text-[16px]">chevron_left</span></button>
                        <span className="px-2 py-1 text-xs font-bold text-slate-700">1 / 1</span>
                        <button className="p-1 hover:text-slate-800"><span className="material-symbols-outlined text-[16px]">chevron_right</span></button>
                        <button className="p-1 hover:text-slate-800"><span className="material-symbols-outlined text-[16px]">keyboard_double_arrow_right</span></button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserManagement;