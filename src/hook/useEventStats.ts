import { useCallback, useState } from 'react';
import { StatsFilter } from '../model/stats/StatsFilter.ts';
import { FullStatsResponse } from '../model/stats/StatsResponse.ts';
import API_ENDPOINTS from '../util/endpoint/ApiEndpoint.ts';
import HttpMethod from '../util/HttpMethod.ts';
import useInterceptedFetch from './useInterceptedFetch.ts';

const buildStatsQuery = (filter: StatsFilter): string => {
    const params = new URLSearchParams();
    if (filter.from) params.set('from', filter.from);
    if (filter.to) params.set('to', filter.to);
    if (filter.status) params.set('status', filter.status);
    if (filter.eventIds?.length) {
        filter.eventIds.forEach(id => params.append('eventIds', String(id)));
    }
    params.set('page', String(filter.page));
    params.set('size', String(filter.size));
    return params.toString();
};

const useEventStats = () => {
    const interceptedFetch = useInterceptedFetch();
    const [data, setData] = useState<FullStatsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async (filter: StatsFilter) => {
        setLoading(true);
        setError(null);
        try {
            const query = buildStatsQuery(filter);
            const endpoint = `${API_ENDPOINTS.statistics}?${query}`;
            const res = await interceptedFetch({ endpoint, reqInit: { method: HttpMethod.GET } });
            if (!res.ok) {
                setError(`Error ${res.status}: ${res.statusText}`);
                return;
            }
            const json: FullStatsResponse = await res.json();
            setData(json);
        } catch (e) {
            setError(String(e));
        } finally {
            setLoading(false);
        }
    }, [interceptedFetch]);

    return { data, loading, error, fetchStats };
};

export default useEventStats;