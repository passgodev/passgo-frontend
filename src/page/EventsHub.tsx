import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
    imageUrl?: string; // This will hold our local blob URL
}

const EventsHub = () => {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const interceptedFetch = useInterceptedFetch();
    const { auth } = useAuth();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const isAdmin = auth?.privilege === Privilege.ADMINISTRATOR;
    const isOrganizer = auth?.privilege === Privilege.ORGANIZER;

    const loadEvents = async () => {
        setIsLoading(true);
        let endpointToFetch = ApiEndpoints.approvedEvents;
        
        if (isAdmin) endpointToFetch = ApiEndpoints.events;
        else if (isOrganizer && auth?.memberId) endpointToFetch = ApiEndpoints.organizerEvents.replace(":id", auth.memberId);

        try {
            const res = await interceptedFetch({ endpoint: endpointToFetch, reqInit: { method: HttpMethod.GET } });
            if (res.ok) {
                const data: EventItem[] = await res.json();
                
                // --- FIX: Fetch Images for each event ---
                const eventsWithImages = await Promise.all(
                    data.map(async (event) => {
                        try {
                            const imgRes = await interceptedFetch({
                                endpoint: ApiEndpoints.eventImage.replace(":id", event.id.toString()),
                                reqInit: { method: HttpMethod.GET }
                            });
                            if (imgRes.ok) {
                                const blob = await imgRes.blob();
                                return { ...event, imageUrl: URL.createObjectURL(blob) };
                            }
                        } catch (e) { console.error("Img error", e); }
                        return event;
                    })
                );
                setEvents(eventsWithImages);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
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

    // --- SEARCH FILTER ---
    const displayedEvents = events.filter(event => 
        event.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="animation-fade-in">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 border-l-4 border-[#0053db] pl-6">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter text-[#2a3439] uppercase leading-none">Global Ledger</h2>
                    <p className="text-[#566166] text-[11px] font-bold uppercase tracking-widest mt-2">Node Event Registry & Infrastructure Audit</p>
                </div>
                {query && (
                    <div className="text-[10px] font-bold text-[#0053db] bg-blue-50 px-3 py-1 rounded-sm uppercase tracking-widest border border-blue-100">
                        Filtering by: {query}
                    </div>
                )}
            </div>

            {/* Grid View */}
            {isLoading ? (
                <div className="text-center py-20 uppercase text-[10px] font-bold text-slate-400 tracking-widest">Querying Infrastructure...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedEvents.map((event) => ( // <-- MODIFIED: Using displayedEvents
                        <div key={event.id} className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col group hover:border-[#0053db] transition-all shadow-sm">
                            
                            {/* Image with overlay status */}
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <span className="material-symbols-outlined text-4xl">image</span>
                                    </div>
                                )}
                                
                                {event.status && (isAdmin || isOrganizer) && (
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-sm shadow-sm ${
                                            event.status === 'APPROVED' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <span className="text-[10px] font-bold text-[#0053db] uppercase tracking-widest mb-1">{event.category || 'General'}</span>
                                <h3 className="text-lg font-black text-[#2a3439] leading-tight mb-4 uppercase">{event.name}</h3>

                                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network Date</p>
                                        <p className="text-xs font-bold text-slate-800">{new Date(event.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Venue Node</p>
                                        <p className="text-xs font-bold text-slate-800">{event.address?.city}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-5 space-y-2">
                                    {isAdmin && event.status === 'PENDING' ? (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleAction(event.id, 'APPROVED')} className="flex-1 bg-[#0053db] text-white py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#0048c1]">Authorize</button>
                                            <button onClick={() => handleAction(event.id, 'REJECTED')} className="flex-1 border border-red-200 text-red-600 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-red-50">Reject</button>
                                        </div>
                                    ) : isOrganizer ? (
                                        <div className="flex gap-2">
                                            <button className="flex-1 border border-slate-300 text-slate-600 py-2 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-slate-50">Manage</button>
                                            <button onClick={() => handleAction(event.id, 'DELETE')} className="px-3 border border-red-100 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-sm">
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <Link to={`/events/${event.id}`}>
                                            <button className="w-full bg-slate-900 text-white py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-colors">
                                                Access & Buy Tickets
                                            </button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventsHub;