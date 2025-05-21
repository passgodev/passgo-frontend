import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import ApiEndpoint from "../util/endpoint/ApiEndpoint";
import {TicketInfo} from "../model/ticket/TicketInfo.ts";
import useInterceptedFetch from "../hook/useInterceptedFetch.ts";

interface TicketInfoViewerProps {
    eventId: number;
}

const TicketInfoViewer = ({ eventId }: TicketInfoViewerProps) => {
    const [ticketsInfo, setTicketsInfo] = useState<TicketInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const fetch = useInterceptedFetch();

    useEffect(() => {
        setLoading(true);
        fetch({ endpoint: ApiEndpoint.ticketsInfo.replace(":eventId", eventId.toString()) })
            .then(res => res.json())
            .then(setTicketsInfo)
            .finally(() => setLoading(false));
    }, [eventId]);

    if (loading) return <CircularProgress />;
    if (ticketsInfo.length === 0) return <Typography>No ticket data available.</Typography>;

    return (
        <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>Tickets Info</Typography>
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Sector</th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Row</th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Tickets</th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>Price</th>
                </tr>
                </thead>
                <tbody>
                {ticketsInfo.map((t, i) => (
                    <tr key={i}>
                        <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{t.sectorName}</td>
                        <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{t.rowNumber === 0 ? '-' : t.rowNumber}</td>
                        <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{t.ticketAmount}</td>
                        <td style={{ borderBottom: "1px solid #eee", padding: "8px" }}>{t.price.toFixed(2)} zł</td>
                    </tr>
                ))}
                </tbody>
            </Box>
        </Box>
    );
};

export default TicketInfoViewer;
