import { Box } from "@mui/material";
import { useEffect, useState } from "react";

import EventCard from "../component/EventCard";
import ApiEndpoints from "../util/endpoint/ApiEndpoint";

interface EventItem {
  id: number;
  name: string;
  date: string;
  description: string;
}

const EventsPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch(ApiEndpoints.events)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
      });
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
          />
        ))}
      </Box>
    </>
  );
};

export default EventsPage;
