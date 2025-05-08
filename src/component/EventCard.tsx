import { Paper, Typography, Box } from "@mui/material";

interface EventCardProps {
  title: string;
  date: string;
  description: string;
  city: string;
  imageUrl?: string;
}

const EventCard = ({
  title,
  date,
  description,
  city,
  imageUrl,
}: EventCardProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        transition: "background-color 0.3s ease",
        backgroundColor: "#fff",
        "&:hover": {
          backgroundColor: "#f0f0f0",
          cursor: "pointer",
        },
      }}
    >
      <Box display="flex" alignItems="stretch" minHeight="180px">
        <Box flex={1} pr={2}>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: "1.5rem" }} color="text.secondary">
            {new Date(date).toLocaleString("pl-PL", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
          <Typography
            sx={{ fontSize: "1.5rem", fontWeight: 550 }}
            color="text.secondary"
          >
            {city}
          </Typography>
          <Box mt={1}>
            <Typography sx={{ mt: 2.5, fontSize: "1.15rem" }}>
              {description}
            </Typography>
          </Box>
        </Box>

        {imageUrl && (
          <Box ml={1}>
            <img
              src={imageUrl}
              alt={title}
              style={{
                height: "260px", //HARDCODE to trzeba zmienic ale za chuja nie wiem jak
                width: "auto",
                borderRadius: "4px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default EventCard;
