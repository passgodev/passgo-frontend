import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useInterceptedFetch from "../hook/useInterceptedFetch";
import useAuth from "../hook/useAuth.ts";
import Privilege from "../model/member/Privilege.ts";
import ApiEndpoints from "../util/endpoint/ApiEndpoint";
import HttpMethod from '../util/HttpMethod.ts';

interface EventItem {
    id: number;
    name: string;
    date: string;
    description: string;
    category: string;
    status?: string;
    address: { city: string; };
    imageUrl?: string;
}

const EventsHub = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const interceptedFetch = useInterceptedFetch();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const isOrganizer = auth?.privilege === Privilege.ORGANIZER;
    const isAdmin = auth?.privilege === Privilege.ADMINISTRATOR;

    const loadEvents = async () => {
        let endpointToFetch = ApiEndpoints.approvedEvents;
        
        if (isAdmin) {
            endpointToFetch = ApiEndpoints.events; // Admins see everything
        } else if (isOrganizer && auth?.memberId) {
            endpointToFetch = ApiEndpoints.organizerEvents.replace(":id", auth.memberId); // Organizers see their own
        }

        try {
            const res = await interceptedFetch({ endpoint: endpointToFetch, reqInit: { method: HttpMethod.GET } });
            
            // ONLY try to parse and map if the backend actually succeeded
            if (res.ok) {
                const data = await res.json();
                // Double check that the data is actually an array to prevent crashes
                if (Array.isArray(data)) {
                    setEvents(data);
                } else {
                    console.error("Expected an array of events but got:", data);
                    setEvents([]); 
                }
            } else {
                console.error("Backend failed with status:", res.status);
                setEvents([]); // Keep the array empty so .map() doesn't crash
            }

        } catch (err) {
            console.error("Network or parsing error:", err);
            setEvents([]); // Keep the array empty on complete failure
        }
    };

    useEffect(() => {
        loadEvents();
    }, [auth?.memberId, auth?.privilege]);

    const handleAction = async (id: number, action: 'APPROVED' | 'REJECTED' | 'DELETE') => {
        const endpoint = action === 'DELETE' ? `${ApiEndpoints.events}/${id}` : `${ApiEndpoints.events}/${id}/status?status=${action}`;
        const method = action === 'DELETE' ? 'DELETE' : 'PATCH';
        await interceptedFetch({ endpoint, reqInit: { method } });
        loadEvents();
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex justify-between items-end mb-6 border-l-4 border-[#0053db] pl-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tighter text-[#2a3439] uppercase">Global Ledger</h2>
                    <p className="text-[#566166] text-[13px]">Discover, manage, and audit high-stakes technical events.</p>
                </div>
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-[#a9b4b9]/30 border border-[#a9b4b9]/30">
                {events.map((event) => (
                    <div key={event.id} className="bg-white p-5 flex flex-col group hover:bg-slate-50 transition-colors relative">

                        {/* Status Badges for Admins/Organizers */}
                        {(isAdmin || isOrganizer) && event.status && (
                            <div className="absolute top-8 left-8 z-10 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-200">
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${event.status === 'APPROVED' ? 'text-green-600' : 'text-amber-600'}`}>
                                    {event.status}
                                </span>
                            </div>
                        )}

                        <div className="relative h-48 mb-4 overflow-hidden bg-slate-200">
                            {event.imageUrl ? (
                                <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">No Image</div>
                            )}
                        </div>

                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[11px] font-bold text-[#0053db] uppercase tracking-widest">{event.category || 'General'}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#2a3439] leading-tight mb-4 group-hover:text-[#0053db] transition-colors">{event.name}</h3>

                        <div className="mt-auto space-y-3 pt-4 border-t border-[#a9b4b9]/20">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-[#717c82] uppercase tracking-widest">Date</span>
                                    <span className="text-sm font-black text-[#2a3439] tracking-tighter">{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-[#717c82] uppercase tracking-widest">Location</span>
                                    <p className="text-[12px] font-semibold text-[#566166]">{event.address?.city}</p>
                                </div>
                            </div>

                            {/* Conditional Rendering of Actions based on Role */}
                            {!isOrganizer && !isAdmin && (
                                <Link to={`/events/${event.id}`}>
                                    <button className="w-full border border-[#717c82] py-2.5 rounded-sm uppercase tracking-widest text-[11px] font-bold hover:bg-[#0053db] hover:text-white hover:border-[#0053db] transition-all mt-3">
                                        View & Buy Tickets
                                    </button>
                                </Link>
                            )}

                            {isOrganizer && (
                                <div className="flex gap-2 mt-3">
                                    <button className="flex-1 py-2 bg-white text-[#2a3439] border border-[#717c82] text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-100 transition-colors">Edit Details</button>
                                    <button onClick={() => handleAction(event.id, 'DELETE')} className="py-2 px-3 text-red-600 border border-red-200 hover:bg-red-50 rounded-sm"><span className="material-symbols-outlined text-[14px]">delete</span></button>
                                </div>
                            )}

                            {isAdmin && event.status === 'PENDING' && (
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => handleAction(event.id, 'APPROVED')} className="flex-1 py-2 bg-[#0053db] text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">Approve</button>
                                    <button onClick={() => handleAction(event.id, 'REJECTED')} className="flex-1 py-2 bg-transparent text-red-600 border border-red-600 text-[10px] font-bold uppercase tracking-widest rounded-sm">Reject</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsHub;