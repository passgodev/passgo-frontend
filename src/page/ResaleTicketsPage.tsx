import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useInterceptedFetch from "../hook/useInterceptedFetch.ts";
import API_ENDPOINTS from "../util/endpoint/ApiEndpoint.ts";
import HttpMethod from "../util/HttpMethod.ts";
import WEB_ENDPOINTS from "../util/endpoint/WebEndpoint.ts";

interface SaleEventDto {
    id: number;
    name: string;
    date: string;
    category?: string;
    address?: {
        city?: string;
    };
}

interface TicketForSale {
    ticketSaleId: number;
    ticketId: number;
    originalPrice: number;
    actualPrice: number;
    sectorName: string | null;
}

interface SaleInfoDto {
    eventDto: SaleEventDto;
    tickets: TicketForSale[];
}

const ResaleTicketsPage = () => {
    const interceptedFetch = useInterceptedFetch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saleInfo, setSaleInfo] = useState<SaleInfoDto | null>(null);
    const [selectedSaleIds, setSelectedSaleIds] = useState<number[]>([]);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);
    const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

    useEffect(() => {
        const loadForSale = async () => {
            setLoading(true);
            setError(null);

            try {
                const query = id ? `?eventId=${encodeURIComponent(id)}` : "";
                const res = await interceptedFetch({
                    endpoint: `${API_ENDPOINTS.ticketsForSale}${query}`,
                    reqInit: { method: HttpMethod.GET },
                });

                if (!res.ok) {
                    throw new Error(`Could not fetch resale tickets (${res.status})`);
                }

                const data: SaleInfoDto[] = await res.json();
                const firstEntry = data.find((entry) => entry.eventDto && String(entry.eventDto.id) === id) ?? data[0] ?? null;
                setSaleInfo(firstEntry);
                setSelectedSaleIds([]);
            } catch (err) {
                console.error(err);
                setError("Could not load resale tickets for this event.");
            } finally {
                setLoading(false);
            }
        };

        loadForSale();
    }, [id]);

    const tickets = useMemo(() => saleInfo?.tickets ?? [], [saleInfo]);
    const selectedTickets = useMemo(
        () => tickets.filter((ticket) => selectedSaleIds.includes(ticket.ticketSaleId)),
        [tickets, selectedSaleIds]
    );
    const selectedTotalPrice = useMemo(
        () => selectedTickets.reduce((acc, ticket) => acc + ticket.actualPrice, 0),
        [selectedTickets]
    );

    const toggleTicketSelection = (ticketSaleId: number) => {
        if (purchaseLoading) return;
        setPurchaseError(null);
        setPurchaseSuccess(null);
        setSelectedSaleIds((prev) =>
            prev.includes(ticketSaleId) ? prev.filter((idValue) => idValue !== ticketSaleId) : [...prev, ticketSaleId]
        );
    };

    const handlePurchaseSelected = async () => {
        if (selectedSaleIds.length === 0 || purchaseLoading) return;
        setPurchaseLoading(true);
        setPurchaseError(null);
        setPurchaseSuccess(null);

        try {
            const res = await interceptedFetch({
                endpoint: API_ENDPOINTS.buyTicketsOnSale,
                reqInit: {
                    method: HttpMethod.POST,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ticketSaleIds: selectedSaleIds }),
                },
            });

            if (!res.ok) {
                let backendMessage = `Purchase failed (${res.status})`;
                try {
                    const payload = await res.json();
                    if (payload?.message && typeof payload.message === "string") {
                        backendMessage = payload.message;
                    }
                } catch {
                    // Fallback to default message above when response is not JSON.
                }
                throw new Error(backendMessage);
            }

            const responseData: { totalPrice: number; ticketQuantity: number } = await res.json();
            setPurchaseSuccess(
                `Purchased ${responseData.ticketQuantity} ticket(s) for ${responseData.totalPrice.toFixed(2)} PLN.`
            );

            const query = id ? `?eventId=${encodeURIComponent(id)}` : "";
            const refreshRes = await interceptedFetch({
                endpoint: `${API_ENDPOINTS.ticketsForSale}${query}`,
                reqInit: { method: HttpMethod.GET },
            });
            if (refreshRes.ok) {
                const refreshedData: SaleInfoDto[] = await refreshRes.json();
                const firstEntry =
                    refreshedData.find((entry) => entry.eventDto && String(entry.eventDto.id) === id) ??
                    refreshedData[0] ??
                    null;
                setSaleInfo(firstEntry);
            }
            setSelectedSaleIds([]);
        } catch (err) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Could not purchase selected resale tickets. Try again.";
            setPurchaseError(message);
        } finally {
            setPurchaseLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-12 animation-fade-in">
            <div className="flex items-center justify-between border-l-4 border-[#0053db] pl-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tighter text-[#2a3439] uppercase">Resale Ticket Market</h2>
                    <p className="text-[#566166] text-[13px]">
                        {saleInfo?.eventDto?.name
                            ? `Additional tickets for ${saleInfo.eventDto.name}`
                            : "Additional tickets offered by other users"}
                    </p>
                </div>
                <button
                    onClick={() => navigate(WEB_ENDPOINTS.events)}
                    className="border border-[#a9b4b9]/40 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#566166] hover:border-[#0053db] hover:text-[#0053db] rounded-sm transition-colors"
                >
                    Back to Events
                </button>
            </div>

            {loading ? (
                <div className="p-8 text-[#717c82] uppercase tracking-widest text-[11px] font-bold">
                    Querying Resale Offers...
                </div>
            ) : error ? (
                <div className="border border-red-200 bg-red-50 text-red-700 px-5 py-4 text-sm font-semibold rounded-sm">
                    {error}
                </div>
            ) : tickets.length === 0 ? (
                <div className="bg-white border border-[#a9b4b9]/30 p-6 text-sm text-slate-500">
                    No additional tickets are currently available for this event.
                </div>
            ) : (
                <div className="space-y-5">
                    <div className="bg-white border border-[#a9b4b9]/30 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#717c82]">Selected offers</p>
                            <p className="text-sm font-black text-[#2a3439] mt-1">
                                {selectedSaleIds.length} ticket(s) | {selectedTotalPrice.toFixed(2)} PLN
                            </p>
                        </div>
                        <button
                            onClick={handlePurchaseSelected}
                            disabled={selectedSaleIds.length === 0 || purchaseLoading}
                            className="bg-[#0053db] text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-sm hover:bg-[#0048c1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {purchaseLoading ? "Purchasing..." : "Purchase Selected Tickets"}
                        </button>
                    </div>

                    {purchaseError && (
                        <div className="border border-red-200 bg-red-50 text-red-700 px-5 py-3 text-sm font-semibold rounded-sm">
                            {purchaseError}
                        </div>
                    )}
                    {purchaseSuccess && (
                        <div className="border border-green-200 bg-green-50 text-green-700 px-5 py-3 text-sm font-semibold rounded-sm">
                            {purchaseSuccess}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {tickets.map((ticket) => {
                            const isSelected = selectedSaleIds.includes(ticket.ticketSaleId);
                            return (
                                <button
                                    key={ticket.ticketSaleId}
                                    type="button"
                                    onClick={() => toggleTicketSelection(ticket.ticketSaleId)}
                                    className={`text-left bg-white border p-5 transition-colors shadow-sm ${
                                        isSelected
                                            ? "border-[#0053db] ring-2 ring-[#0053db]/20"
                                            : "border-[#a9b4b9]/30 hover:border-[#0053db]"
                                    }`}
                                >
                                    <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#0053db]">
                                                {isSelected ? "Selected Offer" : "Resale Offer"}
                                            </p>
                                            <p className="text-sm font-black text-[#2a3439] uppercase mt-1">
                                                {ticket.sectorName ? `Sector ${ticket.sectorName}` : "Standing Area"}
                                            </p>
                                        </div>
                                        <span className="material-symbols-outlined text-[#a9b4b9] text-[20px]">sell</span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold">
                                            <span className="text-[#717c82]">Original Price</span>
                                            <span className="text-[#566166]">{ticket.originalPrice.toFixed(2)} PLN</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold">
                                            <span className="text-[#717c82]">Resale Price</span>
                                            <span className="text-[#0053db]">{ticket.actualPrice.toFixed(2)} PLN</span>
                                        </div>
                                        <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold pt-2 border-t border-slate-100">
                                            <span className="text-[#a9b4b9]">Sale ID</span>
                                            <span className="text-[#717c82]">#{ticket.ticketSaleId}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResaleTicketsPage;
