import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import EventCard from "../component/EventCard";
import ApiEndpoints from "../util/endpoint/ApiEndpoint";
import useInterceptedFetch from "../hook/useInterceptedFetch";

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

const EventsPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);

  const InterceptedFetch = useInterceptedFetch();


  useEffect(() => {
    const fetchEventsWithImages = async () => {
      try {
        const res = await InterceptedFetch({endpoint:ApiEndpoints.events});
        const data: EventItem[] = await res.json();

        const eventsWithImages = await Promise.all(
          data.map(async (event) => {
            try {
              const imageRes = await InterceptedFetch(
                {endpoint:`${ApiEndpoints.events}/${event.id}/image`}
              );
              if (!imageRes.ok) throw new Error("Image not found");
              const blob = await imageRes.blob();
              const imageUrl = URL.createObjectURL(blob);
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

  return (
    <>
      <Box sx={{ p: 3 }}>
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.name}
            date={event.date}
            description={event.description}
            city={event.address.city}
            imageUrl={event.imageUrl}
          />
        ))}
      </Box>
    </>
  );
};

export default EventsPage;
