import {useEffect, useState} from "react";
import useInterceptedFetch from "../hook/useInterceptedFetch.ts";
import useAuth from "../hook/useAuth.ts";
import API_ENDPOINTS from "../util/endpoint/ApiEndpoint.ts";
import HttpMethod from "../util/HttpMethod.ts";
import SimpleTicketDto from "../model/ticket/SimpleTicketDto.ts";
import Privilege from "../model/member/Privilege.ts";


interface SimpleTransactionDto {
    id: number;
    totalPrice: number;
    completedAt: string;
    transactionType: "PURCHASE" | "RETURN" | "TOP_UP";
}

const Dashboard = () => {
    const { auth } = useAuth();
    const interceptedFetch = useInterceptedFetch();

    const [walletBalance, setWalletBalance] = useState<number | null>(null);
    const [tickets, setTickets] = useState<SimpleTicketDto[]>([]);
    const [transactions, setTransactions] = useState<SimpleTransactionDto[]>([]);
    const [loading, setLoading] = useState(true);

    // Top-Up State
    const [isTopUpOpen, setIsTopUpOpen] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState("");

    const loadDashboardData = async () => {
        if (!auth.memberId) return;
        if (auth.privilege === Privilege.ADMINISTRATOR) return;

        setLoading(true);

        try {
            // 1. Fetch Wallet
            const walletRes = await interceptedFetch({
                endpoint: API_ENDPOINTS.wallet.replace(":id", auth.memberId),
                reqInit: { method: HttpMethod.GET },
            });
            if (walletRes.ok) {
                const walletData = await walletRes.json();
                setWalletBalance(walletData.money);
            }

            // 2. Fetch Tickets
            const ticketsRes = await interceptedFetch({
                endpoint: API_ENDPOINTS.clientTickets.replace(":id", auth.memberId),
            });
            if (ticketsRes.ok) {
                const ticketsData = await ticketsRes.json();
                setTickets(ticketsData);
            }

            // 3. Fetch Transactions
            const txRes = await interceptedFetch({
                endpoint: API_ENDPOINTS.transactionsByClientId.replace(":id", auth.memberId),
            });
            if (txRes.ok) {
                const txData = await txRes.json();
                setTransactions(txData);
            }
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, [auth.memberId]);

    const handleTopUp = async () => {
        const amount = parseFloat(topUpAmount);
        if (isNaN(amount) || amount <= 0 || !auth.memberId) return;

        try {
            const res = await interceptedFetch({
                endpoint: API_ENDPOINTS.addMoney.replace(":id", auth.memberId),
                reqInit: {
                    method: HttpMethod.POST,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: amount, description: "Top-up via panel" }),
                },
            });
            if (res.ok) {
                const updated = await res.json();
                setWalletBalance(updated.money);
                setIsTopUpOpen(false);
                setTopUpAmount("");
                loadDashboardData(); // Refresh tx history
            }
        } catch (error) {
            console.error("Top-up error:", error);
        }
    };

    const handleReturnTicket = async (ticketId: number) => {
        if (!confirm("Are you sure you want to return this ticket?")) return;
        try {
            await interceptedFetch({
                endpoint: API_ENDPOINTS.returnTicket.replace(":id", ticketId.toString()),
                reqInit: { method: HttpMethod.POST },
            });
            loadDashboardData(); // Refresh tickets, wallet, and tx history
        } catch (error) {
            console.error("Return error:", error);
        }
    };

    const handleDownloadPdf = async (ticketId: number) => {
        try {
            const res = await interceptedFetch({
                endpoint: API_ENDPOINTS.getTicketPdf.replace(":id", ticketId.toString()),
                reqInit: { method: HttpMethod.GET },
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `ticket_${ticketId}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("PDF download error:", error);
        }
    };

    if (loading) return <div className="p-8 text-[#717c82] uppercase tracking-widest text-[11px] font-bold">Synchronizing Ledger Data...</div>;

    return (
        <div className="flex flex-col gap-8 pb-12">

            {/* Header / Financial Ledger */}
            <div className="flex justify-between items-end border-l-4 border-[#0053db] pl-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tighter text-[#2a3439] uppercase">Client Dashboard</h2>
                    <p className="text-[#566166] text-[13px]">Financial status and secure asset logistics.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Column 1 & 2: Tickets (The Assets) */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Wallet Quick View */}
                    <div className="bg-[#0053db] text-white p-6 relative overflow-hidden flex justify-between items-center shadow-lg">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-1">Available Liquidity</p>
                            <p className="text-4xl font-black tracking-tighter">{walletBalance?.toFixed(2)} PLN</p>
                        </div>
                        <div className="relative z-10 flex gap-2">
                            {isTopUpOpen ? (
                                <div className="flex gap-2 bg-white/10 p-1 rounded-sm backdrop-blur-sm">
                                    <input
                                        type="number"
                                        value={topUpAmount}
                                        onChange={(e) => setTopUpAmount(e.target.value)}
                                        placeholder="Amount"
                                        className="w-24 bg-white text-[#2a3439] px-2 py-1 text-sm outline-none font-bold rounded-sm"
                                    />
                                    <button onClick={handleTopUp} className="bg-white text-[#0053db] px-4 py-1 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-100 rounded-sm">Deposit</button>
                                    <button onClick={() => setIsTopUpOpen(false)} className="px-2 text-white hover:text-red-300 material-symbols-outlined text-[18px]">close</button>
                                </div>
                            ) : (
                                <button onClick={() => setIsTopUpOpen(true)} className="border border-white/30 hover:bg-white/10 px-6 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors rounded-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[16px]">add</span> Add Funds
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Acquired Tickets */}
                    <div className="bg-white border border-[#a9b4b9]/30">
                        <div className="bg-[#f0f4f7] border-b border-[#a9b4b9]/30 px-5 py-3">
                            <h3 className="text-[11px] font-bold text-[#2a3439] uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px] text-[#0053db]">local_activity</span> Valid Event Credentials
                            </h3>
                        </div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tickets.length === 0 ? (
                                <p className="text-sm text-slate-500 col-span-2">No active tickets found in your registry.</p>
                            ) : (
                                tickets.map(ticket => (
                                    <div key={ticket.id} className="border border-[#717c82]/30 p-4 relative group hover:border-[#0053db] transition-colors bg-[#fdfdfd]">
                                        <div className="flex justify-between items-start mb-4 border-b border-[#717c82]/20 pb-3">
                                            <div>
                                                <h4 className="font-bold text-[#2a3439] leading-tight text-sm uppercase tracking-tight">{ticket.eventName}</h4>
                                                <p className="text-[11px] font-bold text-[#0053db] mt-1">{ticket.price.toFixed(2)} PLN</p>
                                            </div>
                                            <span className="material-symbols-outlined text-[#a9b4b9] text-[20px]">qr_code_2</span>
                                        </div>
                                        <div className="flex flex-col gap-1 mb-4">
                                            {ticket.standingArea ? (
                                                <span className="text-[11px] font-semibold text-[#566166] bg-[#e8eff3] w-max px-2 py-0.5 rounded-sm">Standing Area</span>
                                            ) : (
                                                <div className="flex gap-4 text-[11px] font-bold text-[#566166] uppercase tracking-wider">
                                                    <span>SEC: {ticket.sectorName}</span>
                                                    <span>ROW: {ticket.rowNumber}</span>
                                                    <span>SEAT: {ticket.seatNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleDownloadPdf(ticket.id)} className="flex-1 bg-[#2a3439] text-white py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-[#0053db] transition-colors rounded-sm flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">download</span> PDF
                                            </button>
                                            <button onClick={() => handleReturnTicket(ticket.id)} className="flex-1 border border-red-200 text-red-600 py-1.5 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors rounded-sm flex items-center justify-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">assignment_return</span> Return
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 3: Transaction History */}
                <div className="bg-white border border-[#a9b4b9]/30 flex flex-col h-full">
                    <div className="bg-[#f0f4f7] border-b border-[#a9b4b9]/30 px-5 py-3">
                        <h3 className="text-[11px] font-bold text-[#2a3439] uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-[#0053db]">receipt_long</span> Transaction Log
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[600px]">
                        {transactions.length === 0 ? (
                            <p className="text-sm text-slate-500 p-5">No transaction history.</p>
                        ) : (
                            <div className="divide-y divide-[#a9b4b9]/30">
                                {transactions.map((txn) => (
                                    <div key={txn.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                                        <div>
                                            <p className="text-[11px] font-bold text-[#2a3439] uppercase tracking-widest">
                                                {txn.transactionType.replace("_", " ")}
                                            </p>
                                            <p className="text-[10px] text-[#717c82] mt-0.5">
                                                {new Date(txn.completedAt).toLocaleString("pl-PL", { dateStyle: "short", timeStyle: "short" })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-black tracking-tight ${txn.transactionType === "RETURN" ? "text-red-600" : txn.transactionType === "TOP_UP" ? "text-green-600" : "text-[#2a3439]"}`}>
                                                {txn.transactionType === "PURCHASE" ? "-" : "+"}{txn.totalPrice.toFixed(2)} PLN
                                            </p>
                                            <p className="text-[9px] text-[#a9b4b9] font-bold uppercase tracking-widest mt-0.5">ID: {txn.id}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;