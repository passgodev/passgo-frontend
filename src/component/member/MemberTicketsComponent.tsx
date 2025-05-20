import {
  Box,
  Button,
  Card,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import AlertContext from "../../context/AlertProvider.tsx";
import useInterceptedFetch from "../../hook/useInterceptedFetch.ts";
import ClientDto from "../../model/client/ClientDto.ts";
import SimpleTicketDto from "../../model/ticket/SimpleTicketDto.ts";
import API_ENDPOINTS from "../../util/endpoint/ApiEndpoint.ts";
import Grid from "@mui/material/Grid";

interface MemberTicketsComponentProps {
  member: ClientDto;
}

const MemberTicketsComponent = ({ member }: MemberTicketsComponentProps) => {
  const [tickets, setTickets] = useState<SimpleTicketDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useContext(AlertContext);
  const interceptedFetch = useInterceptedFetch();

  useEffect(() => {
    if (!member.id) {
      showAlert("User ID is missing.", "error");
      return;
    }

    const endpoint = API_ENDPOINTS.clientTickets.replace(
      ":id",
      member.id.toString()
    );

    interceptedFetch({ endpoint })
      .then((res) => res.json())
      .then((data: SimpleTicketDto[]) => {
        setTickets(data);
      })
      .catch((err) => {
        showAlert("Error while fetching tickets.", "error");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [member.id]);

  const handleReturn = async (ticketId: number) => {
    try {
      await interceptedFetch({
        endpoint: `/api/tickets/${ticketId}/return`,
        reqInit: { method: "POST" },
      });
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      showAlert("Tickets has been returned.", "info");
    } catch (error) {
      console.error(error);
      showAlert("Error while returning ticket.", "error");
    }
  };

  const handleDownloadPdf = async (ticketId: number) => {
    try {
      const res = await interceptedFetch({
        endpoint: `/api/tickets/${ticketId}/pdf`,
        reqInit: { method: "GET" },
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket_${ticketId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      showAlert("Error while downloading ticket PDF", "error");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (tickets.length === 0) {
    return <Box sx={{ mt: 2, p: 2}}>You don't have any tickets yet.</Box>;
  }

  return (
    <Box sx={{ mb: 2, p: 2 }}>
      <Box mt={2}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, ml: 1 }}>
          Tickets
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              sx={{
                flex: "1 1 calc(50% - 16px)",
                p: 2,
                boxSizing: "border-box",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box flexGrow={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {ticket.eventName}
                  </Typography>
                  <Typography variant="body2">
                    Price: {ticket.price.toFixed(2)} PLN
                  </Typography>
                  {ticket.standingArea ? (
                    <Typography variant="body2">
                      Place - standing zone
                    </Typography>
                  ) : (
                    <Typography variant="body2">
                      Place: {ticket.sectorName} / row {ticket.rowNumber} / seat{" "}
                      {ticket.seatNumber}
                    </Typography>
                  )}
                </Box>
                <Box display="flex" gap={1} ml={2}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleReturn(ticket.id)}
                  >
                    return
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleDownloadPdf(ticket.id)}
                  >
                    download pdf
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MemberTicketsComponent;
