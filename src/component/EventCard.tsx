import { Paper, Typography, Box } from "@mui/material";

interface EventCardProps {
  title: string;
  date: string;
  description: string;
}

const EventCard = ({ title, date, description }: EventCardProps) => {
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {date}
      </Typography>
      <Box mt={1}>
        <Typography>{description}</Typography>
      </Box>
    </Paper>
  );
};

export default EventCard;
