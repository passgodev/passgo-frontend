import { Paginated } from '../../util/pagination/Paginated.ts';

export interface StatsResponse {
    eventName: string;
    category: string;
    ticketsNumber: number;
    availableTickets: number;
    arenaOccupancy: number;
}

export interface FullStatsResponse {
    eventsStats: Paginated<StatsResponse>;
    totalTickets: number;
    totalBoughtTickets: number;
    averageAreaOccupy: number;
}