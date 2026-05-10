export type EventStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface StatsFilter {
    from?: string;
    to?: string;
    eventIds?: number[];
    status?: EventStatus;
    page: number;
    size: number;
}