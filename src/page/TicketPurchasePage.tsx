import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useInterceptedFetch from "../hook/useInterceptedFetch";
import API_ENDPOINTS from "../util/endpoint/ApiEndpoint";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WEB_ENDPOINTS from "../util/endpoint/WebEndpoint";

interface Ticket {
  id: number;
  price: number;
  sectorId: number;
  sectorName: string;
  rowId: number;
  seatId: number;
  standingArea: boolean;
}

const TicketPurchasePage = () => {
  const { id } = useParams<{ id: string }>();
  const InterceptedFetch = useInterceptedFetch();

  const [eventTitle, setEventTitle] = useState<string>("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedSector, setSelectedSector] = useState<number | "">("");
  const [selectedRow, setSelectedRow] = useState<number | "">("");
  const [selectedSeat, setSelectedSeat] = useState<number | "">("");
  const [addedTickets, setAddedTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchEventAndTickets = async () => {
      try {
        const res = await InterceptedFetch({
          endpoint: `${API_ENDPOINTS.events}/${id}`,
        });
        if (!res.ok) throw new Error("Not able to fetch this event.");

        const data = await res.json();
        setEventTitle(data.name);

        const ticketsRes = await InterceptedFetch({
          endpoint: `${API_ENDPOINTS.events}/${id}/tickets`,
        });
        if (!ticketsRes.ok) throw new Error("Not able to fetch tickets.");
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEventAndTickets();
  }, [id]);

  const uniqueSectors = [
    ...new Map(tickets.map((t) => [t.sectorId, t.sectorName])).entries(),
  ];

  const uniqueRows =
    selectedSector === ""
      ? []
      : [
          ...new Set(
            tickets
              .filter((t) => t.sectorId === selectedSector)
              .map((t) => t.rowId)
          ),
        ];

  const availableSeats =
    selectedSector === "" || selectedRow === ""
      ? []
      : tickets
          .filter(
            (t) => t.sectorId === selectedSector && t.rowId === selectedRow
          )
          .map((t) => t.seatId);

  const handleAddTicket = () => {
    if (selectedSector === "" || selectedRow === "" || selectedSeat === "")
      return;

    const ticketToAdd = tickets.find(
      (t) =>
        t.sectorId === selectedSector &&
        t.rowId === selectedRow &&
        t.seatId === selectedSeat
    );

    if (!ticketToAdd) return;


    const alreadyAdded = addedTickets.some(
      (t) =>
        t.sectorId === selectedSector &&
        t.rowId === selectedRow &&
        t.seatId === selectedSeat
    );

    if (alreadyAdded) {
      alert("This ticket has already been choosen.");
      return;
    }

    setAddedTickets((prev) => [...prev, ticketToAdd]);
  };

  const handleBuyTickets = async () => {
    if (addedTickets.length === 0) {
      alert("Add at least one ticket.");
      return;
    }

    const ticketIds = addedTickets.map((t) => t.id);

    try {
      const res = await InterceptedFetch({
        endpoint: WEB_ENDPOINTS.purchaseTickets,
        reqInit: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ticketIds }),
        },
      });

      if (!res.ok) {
        throw new Error("Error while purchasing tickets.");
      }

      alert("Secesfully purchased tickets.");
      setAddedTickets([]);
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <Box p={4} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center">
        Buy tickets for {eventTitle} event
      </Typography>

      <Box display="flex" gap={2} alignItems="center" mb={3}>
        {/* Wybór sektora */}
        <Select
          value={selectedSector}
          onChange={(e) => {
            setSelectedSector(e.target.value as number);
            setSelectedRow("");
            setSelectedSeat("");
          }}
          displayEmpty
        >
          <MenuItem value="">Choose sector</MenuItem>
          {uniqueSectors.map(([sectorId, sectorName]) => (
            <MenuItem key={sectorId} value={sectorId}>
              {sectorName}
            </MenuItem>
          ))}
        </Select>

        {/* Wybór rzędu */}
        <Select
          value={selectedRow}
          onChange={(e) => {
            setSelectedRow(e.target.value as number);
            setSelectedSeat("");
          }}
          displayEmpty
          disabled={selectedSector === ""}
        >
          <MenuItem value="">Choose row</MenuItem>
          {uniqueRows.map((rowId) => (
            <MenuItem key={rowId} value={rowId}>
              Row {rowId}
            </MenuItem>
          ))}
        </Select>

        {/* Wybór miejsca */}
        <Select
          value={selectedSeat}
          onChange={(e) => setSelectedSeat(e.target.value as number)}
          displayEmpty
          disabled={selectedRow === ""}
        >
          <MenuItem value="">Choose seat</MenuItem>
          {availableSeats.map((seatId) => (
            <MenuItem key={seatId} value={seatId}>
              Seat {seatId}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          onClick={handleAddTicket}
          disabled={
            selectedSector === "" || selectedRow === "" || selectedSeat === ""
          }
          size="large"
        >
          Add ticket
        </Button>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        width="100%"
        maxWidth={1000}
        sx={{ "& .MuiTypography-root": { fontSize: "1.2rem" } }}
      >
        {addedTickets.map((ticket) => (
          <Card key={ticket.id} variant="outlined">
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography>
                    <strong>Sector:</strong> {ticket.sectorName}
                  </Typography>
                  <Typography>
                    <strong>Row:</strong> {ticket.rowId}
                  </Typography>
                  <Typography>
                    <strong>Seat:</strong> {ticket.seatId}
                  </Typography>
                  <Typography>
                    <strong>Price:</strong> {ticket.price.toFixed(2)} PLN
                  </Typography>
                  {ticket.standingArea && (
                    <Typography variant="body2" color="text.secondary">
                      Standing ticket
                    </Typography>
                  )}
                </Box>
                <IconButton
                  edge="end"
                  aria-label="Usuń bilet"
                  onClick={() =>
                    setAddedTickets((prev) =>
                      prev.filter((t) => t.id !== ticket.id)
                    )
                  }
                  sx={{ mr: 2 }} // margines od prawej
                >
                  <DeleteIcon sx={{ fontSize: 30, color: "red" }} />{" "}
                  {/* większa ikona */}
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>


      <Button
        variant="contained"
        size="large"
        onClick={handleBuyTickets}
        disabled={addedTickets.length === 0}
        sx={{
          mt: 3,
          fontSize: "1.25rem",
          py: 2,
          borderRadius: 4,
          textTransform: "none",
          backgroundImage:
            "linear-gradient(45deg,rgb(66, 249, 255),rgb(40, 62, 234))",
          color: "white",
          "&:hover": {
            backgroundImage:
              "linear-gradient(45deg,rgb(128, 228, 250),rgb(81, 107, 255))",
          },
          "&.Mui-disabled": {
            display: "none",
          },
        }}
      >
        Buy tickets
      </Button>
    </Box>
  );
};

export default TicketPurchasePage;
