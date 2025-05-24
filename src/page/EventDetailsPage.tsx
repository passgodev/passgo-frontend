import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useInterceptedFetch from "../hook/useInterceptedFetch";
import API_ENDPOINTS from "../util/endpoint/ApiEndpoint";

interface EventDetails {
    id: number;
    name: string;
    date: string;
    description: string;
    category: string;
    building: {
        name: string;
        address: {
            country: string;
            city: string;
            street: string;
            postalCode: string;
            buildingNumber: string;
        };
        sectors: {
            id: number;
            name: string;
            standingArea: boolean;
            rows: {
                id: number;
                seats: {
                    id: number;
                }[];
            }[];
        }[];
    };
    imageUrl?: string;
}

const EventDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<EventDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const InterceptedFetch = useInterceptedFetch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {

            try {
                const res = await InterceptedFetch({
                    endpoint: `${API_ENDPOINTS.eventDetails}/${id}`,
                });

                if (!res.ok) throw new Error("Nie udało się pobrać wydarzenia");

                const data = await res.json();

                try {
                    const imageRes = await InterceptedFetch({
                        endpoint: `${API_ENDPOINTS.events}/${id}/image`,
                    });
                    if (imageRes.ok) {
                        const blob = await imageRes.blob();
                        const imageUrl = URL.createObjectURL(blob);
                        setEvent({ ...data, imageUrl });
                    } else {
                        setEvent(data);
                    }
                } catch {
                    setEvent(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <Box p={4} display="flex" justifyContent="center">
                <CircularProgress />
            </Box>
        );
    }

    if (!event) {
        return (
            <Box p={4}>
                <Typography variant="h5">Nie znaleziono wydarzenia.</Typography>
            </Box>
        );
    }
    
    console.log("DEBUGGG: ", event)

    const sectorCount = event.building.sectors.length;
    const rowCount = event.building.sectors.reduce(
        (acc, s) => acc + s.rows.length,
        0
    );
    const seatCount = event.building.sectors.reduce(
        (acc, s) =>
            acc + s.rows.reduce((rAcc, row) => rAcc + row.seats.length, 0),
        0
    );

    return (
        <Box p={4}>
            <Typography variant="h1" fontWeight="800" mb={2}>
                {event.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
                {new Date(event.date).toLocaleString("pl-PL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={2}>
                Category: {event.category}
            </Typography>

            {event.imageUrl && (
                <Box mb={3}>
                    <img
                        src={event.imageUrl}
                        alt={event.name}
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                            height: "auto",
                        }}
                    />
                </Box>
            )}

            <Typography variant="body1" fontSize="1.2rem" mb={3}>
                {event.description}
            </Typography>

            <Typography variant="h5" fontWeight="bold" mt={4}>
                Localization
            </Typography>
            <Typography>
                {event.building.name} — {event.building.address.street}{" "}
                {event.building.address.buildingNumber},{" "}
                {event.building.address.postalCode}{" "}
                {event.building.address.city}, {event.building.address.country}
            </Typography>

            <Typography variant="h5" fontWeight="bold" mt={4}>
                Arena details
            </Typography>
            <Typography>Sectors: {sectorCount}</Typography>
            <Typography>Rows: {rowCount}</Typography>
            <Typography>Seats: {seatCount}</Typography>

            <Box mt={4}>
                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                        fontSize: "1.25rem",
                        py: 2,
                        borderRadius: 4,
                        textTransform: "none",
                        backgroundImage:
                            "linear-gradient(45deg,rgb(66, 249, 255),rgb(40, 62, 234))", // Zielony gradient
                        color: "white", // Ustawienie koloru tekstu na biały
                        "&:hover": {
                            backgroundImage:
                                "linear-gradient(45deg,rgb(128, 228, 250),rgb(81, 107, 255))", // Zmiana gradientu przy hover
                        },
                    }}
                    onClick={() => navigate(`/events/${id}/buy`)}
                >
                    Buy tickets
                </Button>
            </Box>
        </Box>
    );
};

export default EventDetailsPage;
