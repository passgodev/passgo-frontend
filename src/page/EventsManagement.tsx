import {
    Box, Typography, Button, IconButton, TextField, Paper, Grid, Checkbox, FormControlLabel
} from "@mui/material";
import {
    Visibility, CheckCircle, Cancel, Delete, Add
} from "@mui/icons-material";
import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import WebEndpoint from "../util/endpoint/WebEndpoint";
import ApiEndpoint from "../util/endpoint/ApiEndpoint";
import useInterceptedFetch from "../hook/useInterceptedFetch";
import {DetailedEventDto} from "../model/event/DetailedEventDto.ts";
import TicketInfoViewer from "../component/TicketInfoViewer.tsx";
import AuthContext from "../context/AuthProvider.tsx";
import Privilege from "../model/member/Privilege.ts";
const EventsManagementPage = () => {
    const [events, setEvents] = useState<DetailedEventDto[]>([]);
    const [eventImages, setEventImages] = useState<Record<number, string>>({});
    const [expandedEventId, setExpandedEventId] = useState<number | null>(null);
    const [showTickets, setShowTickets] = useState(false);
    const { auth } = useContext(AuthContext);
    const role = auth.privilege;
    const id = auth.memberId;

    const fetch = useInterceptedFetch();
    const navigate = useNavigate();

    const loadAllEvents = () => {
        fetch({ endpoint: ApiEndpoint.events })
            .then(res => res.json())
            .then(setEvents);
    };

    const loadOrganizerEvents = (id: string | undefined) => {
        if(id === undefined) {
            return;
        }

        fetch({ endpoint: ApiEndpoint.organizerEvents.replace(":id", id) })
            .then(res => res.json())
            .then(setEvents);
    };


    const loadEvents = () => {
        if(role === Privilege.ADMINISTRATOR){
            loadAllEvents();
        } else if(role === Privilege.ORGANIZER){
            loadOrganizerEvents(id);
        }
    };

    const loadImage = (eventId: number) => {
        fetch( { endpoint: ApiEndpoint.eventImage.replace(":id", eventId.toString()) } )
            .then(res => {
                if (!res.ok) throw new Error("Image fetch failed");
                return res.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                setEventImages(prev => ({ ...prev, [eventId]: url }));
            })
            .catch(err => console.error("Image load error:", err));
    };

    const handleToggleExpand = (eventId: number) => {
        setExpandedEventId(prev => {
            const newId = prev === eventId ? null : eventId;
            if (newId !== null && !eventImages[newId]) {
                loadImage(newId);
            }
            return newId;
        });
    };


    useEffect(() => {
        loadEvents();
    }, []);

    const handleApprove = (id: number) => {
        fetch({
            endpoint: `${ApiEndpoint.events}/${id}/status?status=APPROVED`,
            reqInit: { method: "PATCH" }
        }).then(() => loadEvents());
    };

    const handleReject = (id: number) => {
        fetch({
            endpoint: `${ApiEndpoint.events}/${id}/status?status=REJECTED`,
            reqInit: { method: "PATCH" }
        }).then(() => loadEvents());
    };

    const handleDelete = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        fetch({
            endpoint: `${ApiEndpoint.events}/${id}`,
            reqInit: { method: "DELETE" }
        }).then(() => loadEvents());
    };

    const handleFieldChange = (id: number, field: string, value: any) => {
        setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, [field]: value } : ev));
    };

    const handleUpdate = (id: number) => {
        const eventToUpdate = events.find(e => e.id === id);
        if (!eventToUpdate) return;

        const payload = {
            name: eventToUpdate.name,
            description: eventToUpdate.description,
            category: eventToUpdate.category,
            date: eventToUpdate.date
        };

        fetch({
            endpoint: `${ApiEndpoint.events}/${id}`,
            reqInit: {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }
        }).then(() => loadEvents());
    };

    return (
        <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Events management</Typography>
                {role === Privilege.ORGANIZER && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate(WebEndpoint.addEvent)}
                    >
                        Add Event
                    </Button>
                )}
            </Box>

            {events.map(event => (
                <Paper key={event.id} sx={{ p: 2, mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{event.name} ({event.category}) Status: {event.status}</Typography>
                        <Box>
                            <IconButton onClick={() => handleToggleExpand(event.id)}><Visibility /></IconButton>
                            {role === Privilege.ADMINISTRATOR && (
                                <>
                                    <IconButton color="success" onClick={() => handleApprove(event.id)}><CheckCircle /></IconButton>
                                    <IconButton color="error" onClick={() => handleReject(event.id)}><Cancel /></IconButton>
                                </>
                            )}
                            <IconButton color="error" onClick={() => handleDelete(event.id)}><Delete /></IconButton>
                        </Box>
                    </Box>

                    {expandedEventId === event.id && (
                        <Box mt={2}>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <Typography variant="h6">Building name: {event.buildingName}</Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Typography variant="h6">Address: {event.address.city}, {event.address.street}, {event.address.buildingNumber}</Typography>
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        label="Name"
                                        fullWidth
                                        value={event.name}
                                        onChange={e => handleFieldChange(event.id, "name", e.target.value)}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        label="Description"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={event.description}
                                        onChange={e => handleFieldChange(event.id, "description", e.target.value)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        label="Category"
                                        fullWidth
                                        value={event.category}
                                        onChange={e => handleFieldChange(event.id, "category", e.target.value)}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        label="Date"
                                        fullWidth
                                        type="datetime-local"
                                        value={event.date.slice(0, 16)}
                                        onChange={e => handleFieldChange(event.id, "date", e.target.value)}
                                    />
                                </Grid>

                                {eventImages[event.id] && (
                                    <Box mb={2}>
                                        <img src={eventImages[event.id]} alt="Event" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }} />
                                    </Box>
                                )}

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showTickets}
                                            onChange={(e) => setShowTickets(e.target.checked)}
                                        />
                                    }
                                    label="Show tickets info"
                                />

                                {showTickets && (<TicketInfoViewer eventId={event.id} />)}

                                <Grid size={12}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleUpdate(event.id)}
                                    >
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>
            ))}
        </Box>
    )
};

export default EventsManagementPage;