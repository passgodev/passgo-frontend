import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import EventCard from "../component/EventCard";
import useInterceptedFetch from "../hook/useInterceptedFetch";
import ApiEndpoints from "../util/endpoint/ApiEndpoint";
import API_ENDPOINTS from "../util/endpoint/ApiEndpoint";
import HttpMethod from '../util/HttpMethod.ts';
import { loggerPrelogWithFactory } from '../util/logger/Logger.ts';


interface EventItem {
    id: number;
    name: string;
    date: string;
    description: string;
    address: {
        city: string;
    };
    imageUrl?: string;
}

const logger = loggerPrelogWithFactory('[Events]');


const EventsPage = () => {
    const [events, setEvents] = useState<EventItem[]>([]);

    const InterceptedFetch = useInterceptedFetch();

    useEffect(() => {
        const fetchEventsWithImages = async () => {
            try {
                const res = await InterceptedFetch({
                    endpoint: ApiEndpoints.approvedEvents,
                    reqInit: {
                        method: HttpMethod.GET
                    }
                });
                const data: EventItem[] = await res.json();

                const eventsWithImages = await Promise.all(
                    data.map(async (event) => {

                        const endpoint = API_ENDPOINTS.eventImage.replace(
                            ":id",
                            event.id.toString()
                        );

                        try {
                            logger.log('Fetching img, id:', event.id);
                            const imageRes = await InterceptedFetch({
                                endpoint: endpoint,
                                // reqInit: {
                                //     method: HttpMethod.GET
                                // }
                            });

                            if (!imageRes.ok) {
                                logger.log('Image returned status !== 200', imageRes);
                                throw new Error("Image not found");
                            }
                            const blob = await imageRes.blob();
                            const imageUrl = URL.createObjectURL(blob);
                            logger.log('Successfully fetched img for event, id:', event.id);
                            return { ...event, imageUrl };
                        } catch (err) {
                            console.warn(`No image for event ${event.id}`, err);
                            return { ...event }; // bez imageUrl
                        }
                    })
                );

                setEvents(eventsWithImages);
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        fetchEventsWithImages();
    }, []);

    logger.log(events);

    return (
        <>
            <Paper
                sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: "#64affa",
                    color: "#eee",
                    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <Typography variant="h5">Events</Typography>
            </Paper>

            <Box sx={{ p: 3 }}>
                {events.map((event) => (
                    <EventCard
                        key={event.id}
                        title={event.name}
                        date={event.date}
                        description={event.description}
                        city={event.address.city}
                        imageUrl={event.imageUrl}
                        id={event.id}
                    />
                ))}
            </Box>
        </>
    );
};

export default EventsPage;
