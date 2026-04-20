import { useEffect, useState } from 'react';
import { EventStatus, StatsFilter } from '../model/stats/StatsFilter.ts';
import useEventStats from '../hook/useEventStats.ts';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const labelClass = 'block text-[10px] font-bold uppercase tracking-wider text-[#566166] mb-1';
const inputClass = 'border border-[#a9b4b9] bg-white px-2 py-1.5 text-xs focus:border-[#0053db] focus:outline-none focus:ring-1 focus:ring-[#0053db] transition-all';
const selectClass = `${inputClass} cursor-pointer`;


const EventStatsPage = () => {
    const { data, loading, error, fetchStats } = useEventStats();

    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [status, setStatus] = useState<EventStatus | ''>('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const buildFilter = (): StatsFilter => ({
        from: from ? new Date(from).toISOString() : undefined,
        to: to ? new Date(to).toISOString() : undefined,
        status: status || undefined,
        page,
        size,
    });

    useEffect(() => {
        fetchStats(buildFilter());
    }, [page, size]);

    const handleApplyFilters = () => {
        setPage(0);
        fetchStats({ ...buildFilter(), page: 0 });
    };

    const handleClearFilters = () => {
        setFrom('');
        setTo('');
        setStatus('');
        setPage(0);
        fetchStats({ page: 0, size });
    };

    const eventsStats = data?.eventsStats;
    const totalPages = eventsStats?.totalPages ?? 1;

    const summaryCards = [
        { label: 'Total Tickets', value: data?.totalTickets ?? '—', icon: 'confirmation_number' },
        { label: 'Tickets Bought', value: data?.totalBoughtTickets ?? '—', icon: 'sell' },
        { label: 'Avg. Arena Occupancy', value: data ? `${data.averageAreaOccupy.toFixed(1)}%` : '—', icon: 'stadium' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="border-b border-[#a9b4b9]/40 pb-4">
                <h1 className="text-lg font-black uppercase tracking-wider text-[#2a3439]">Event Statistics</h1>
                <p className="text-xs text-[#566166] mt-0.5">Performance overview of all registered events</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {summaryCards.map(({ label, value, icon }) => (
                    <div key={label} className="bg-white border border-[#a9b4b9]/40 px-5 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#e8eff3] flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[#566166] text-[20px]">{icon}</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#717c82]">{label}</p>
                            <p className="text-xl font-black text-[#2a3439] leading-tight">{String(value)}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Bar + Pagination */}
            <div className="bg-white border border-[#a9b4b9]/40 px-5 py-4">
                <div className="flex flex-wrap items-end gap-4">
                    {/* From */}
                    <div>
                        <label className={labelClass}>From</label>
                        <input
                            type="date"
                            className={inputClass}
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                        />
                    </div>

                    {/* To */}
                    <div>
                        <label className={labelClass}>To</label>
                        <input
                            type="date"
                            className={inputClass}
                            value={to}
                            onChange={e => setTo(e.target.value)}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className={labelClass}>Status</label>
                        <select
                            className={selectClass}
                            value={status}
                            onChange={e => setStatus(e.target.value as EventStatus | '')}
                        >
                            <option value="">All</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleApplyFilters}
                            className="bg-[#0053db] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 hover:bg-[#0048c1] transition-colors cursor-pointer"
                        >
                            Apply
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="bg-white border border-[#a9b4b9] text-[#566166] text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 hover:bg-[#f0f4f7] transition-colors cursor-pointer"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Pagination — pushed to the right */}
                    <div className="flex items-end gap-3 ml-auto">
                        <div>
                            <label className={labelClass}>Per page</label>
                            <select
                                className={selectClass}
                                value={size}
                                onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
                            >
                                {PAGE_SIZE_OPTIONS.map(n => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(p => p - 1)}
                                className="border border-[#a9b4b9] bg-white text-[#566166] px-2.5 py-1.5 text-xs hover:bg-[#f0f4f7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px] leading-none">chevron_left</span>
                            </button>
                            <span className="text-[10px] font-bold text-[#566166] uppercase tracking-wide whitespace-nowrap">
                                {page + 1} / {Math.max(totalPages, 1)}
                            </span>
                            <button
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                                className="border border-[#a9b4b9] bg-white text-[#566166] px-2.5 py-1.5 text-xs hover:bg-[#f0f4f7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px] leading-none">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#a9b4b9]/40 overflow-hidden">
                <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                    <table className="w-full text-left border-collapse min-w-[640px]">
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-[#e1e9ee] border-b border-[#a9b4b9]">
                                {['Event Name', 'Category', 'Tickets Number', 'Available Tickets', 'Arena Occupancy'].map(col => (
                                    <th key={col} className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#566166] whitespace-nowrap">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-xs text-[#717c82] uppercase tracking-wider">
                                        <span className="material-symbols-outlined animate-spin text-[#0053db] text-2xl block mx-auto mb-2">progress_activity</span>
                                        Loading statistics...
                                    </td>
                                </tr>
                            )}
                            {!loading && error && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-xs text-[#9f403d] uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-2xl block mx-auto mb-2">error</span>
                                        {error}
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && eventsStats?.content.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-xs text-[#717c82] uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-2xl block mx-auto mb-2">search_off</span>
                                        No events match the selected filters
                                    </td>
                                </tr>
                            )}
                            {!loading && !error && eventsStats?.content.map((row, idx) => (
                                <tr
                                    key={idx}
                                    className="border-b border-[#a9b4b9]/20 hover:bg-[#f0f4f7] transition-colors"
                                >
                                    <td className="px-4 py-3 text-xs font-semibold text-[#2a3439]">{row.eventName}</td>
                                    <td className="px-4 py-3 text-xs text-[#566166]">{row.category}</td>
                                    <td className="px-4 py-3 text-xs text-[#2a3439] font-mono">{row.ticketsNumber}</td>
                                    <td className="px-4 py-3 text-xs text-[#2a3439] font-mono">{row.availableTickets}</td>
                                    <td className="px-4 py-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-1.5 bg-[#e8eff3] overflow-hidden">
                                                <div
                                                    className="h-full bg-[#0053db] transition-all"
                                                    style={{ width: `${Math.min(row.arenaOccupancy, 100)}%` }}
                                                />
                                            </div>
                                            <span className="font-mono text-[#2a3439]">{row.arenaOccupancy.toFixed(1)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Table footer */}
                {eventsStats && (
                    <div className="px-4 py-2 border-t border-[#a9b4b9]/20 bg-[#f7f9fb] flex justify-between items-center">
                        <span className="text-[10px] text-[#717c82] uppercase tracking-wide">
                            {eventsStats.totalElements} total records
                        </span>
                        <span className="text-[10px] text-[#717c82] uppercase tracking-wide">
                            Page {page + 1} of {Math.max(totalPages, 1)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventStatsPage;