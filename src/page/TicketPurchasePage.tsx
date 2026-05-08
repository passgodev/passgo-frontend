import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AlertContext from "../context/AlertProvider";
import useInterceptedFetch from "../hook/useInterceptedFetch";
import API_ENDPOINTS from "../util/endpoint/ApiEndpoint";
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
  const { showAlert } = useContext(AlertContext);

  const [eventTitle, setEventTitle] = useState<string>("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedSector, setSelectedSector] = useState<number | "">("");
  const [selectedRow, setSelectedRow] = useState<number | "">("");
  const [selectedSeat, setSelectedSeat] = useState<number | "">("");
  const [addedTickets, setAddedTickets] = useState<Ticket[]>([]);

  const totalPrice = addedTickets.reduce((sum, ticket) => sum + ticket.price, 0);

  const parseSelectNumber = (value: unknown) => {
    if (value === "") {
      return "";
    }

    return Number(value);
  };

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
      showAlert("This ticket has already been choosen.", "error");
      return;
    }

    setAddedTickets((prev) => [...prev, ticketToAdd]);
  };

  const handleBuyTickets = async () => {
    if (addedTickets.length === 0) {
      showAlert("Add at least one ticket.", "error");
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
        let backendMessage = `Purchase failed (${res.status})`;
        try {
          const payload = await res.json();
          if (payload?.message && typeof payload.message === "string") {
            backendMessage = payload.message;
          }
        } catch {
          // Fall back to the generic status-based message when the server
          // returns a non-JSON error body.
        }

        throw new Error(backendMessage);
      }

      showAlert("Successfully purchased tickets.", "info");
      setAddedTickets([]);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong!";
      showAlert(message, "error");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 112px)",
        color: "#182235",
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(40, 59, 92, 0.14)",
          background:
            "linear-gradient(180deg, rgba(252, 253, 255, 0.96) 0%, rgba(242, 246, 252, 0.98) 100%)",
          boxShadow: "0 18px 50px rgba(28, 39, 63, 0.08)",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(131, 145, 168, 0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(131, 145, 168, 0.09) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
            opacity: 0.35,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, p: { xs: 2, md: 4 } }}>
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    letterSpacing: 2.6,
                    color: "#4b5c79",
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  Transactional Portal
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: -1.3,
                    textTransform: "uppercase",
                    fontSize: { xs: "2rem", md: "2.7rem" },
                    lineHeight: 0.98,
                  }}
                >
                  Buy tickets for {eventTitle || "selected event"}
                </Typography>
                <Typography
                  sx={{
                    mt: 1.2,
                    maxWidth: 760,
                    color: "#5f6f89",
                    fontSize: { xs: "0.95rem", md: "1rem" },
                  }}
                >
                  Allocate a sector, row, and seat, then review the active
                  inventory ledger before completing the purchase.
                </Typography>
              </Box>

              <Chip
                label={`Event ID: ${id ?? "N/A"}`}
                sx={{
                  alignSelf: "flex-start",
                  bgcolor: "#dce8ff",
                  color: "#2956b5",
                  fontWeight: 800,
                  letterSpacing: 0.7,
                  px: 0.5,
                }}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 180px" },
                gap: 0,
                alignItems: "stretch",
              }}
            >
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2, md: 3 },
                  borderColor: "rgba(34, 54, 87, 0.18)",
                  borderRight: { md: "0" },
                  borderRadius: "2px 0 0 2px",
                  background: "rgba(255,255,255,0.88)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    mb: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "6px",
                      bgcolor: "#eff4fb",
                      color: "#2956b5",
                      fontWeight: 900,
                      fontSize: 14,
                    }}
                  >
                    ⌁
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 900,
                      letterSpacing: 1.8,
                      textTransform: "uppercase",
                      color: "#3f4f69",
                    }}
                  >
                    Allocation Parameters
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(3, minmax(0, 1fr))",
                    },
                    gap: 2,
                  }}
                >
                  <Select
                    value={selectedSector}
                    onChange={(e) => {
                      setSelectedSector(parseSelectNumber(e.target.value));
                      setSelectedRow("");
                      setSelectedSeat("");
                    }}
                    displayEmpty
                    sx={selectFieldSx}
                  >
                    <MenuItem value="">Sector allocation</MenuItem>
                    {uniqueSectors.map(([sectorId, sectorName]) => (
                      <MenuItem key={sectorId} value={sectorId}>
                        {sectorName}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    value={selectedRow}
                    onChange={(e) => {
                      setSelectedRow(parseSelectNumber(e.target.value));
                      setSelectedSeat("");
                    }}
                    displayEmpty
                    disabled={selectedSector === ""}
                    sx={selectFieldSx}
                  >
                    <MenuItem value="">Row designation</MenuItem>
                    {uniqueRows.map((rowId) => (
                      <MenuItem key={rowId} value={rowId}>
                        Row {rowId}
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    value={selectedSeat}
                    onChange={(e) => setSelectedSeat(parseSelectNumber(e.target.value))}
                    displayEmpty
                    disabled={selectedRow === ""}
                    sx={selectFieldSx}
                  >
                    <MenuItem value="">Seat identifier</MenuItem>
                    {availableSeats.map((seatId) => (
                      <MenuItem key={seatId} value={seatId}>
                        Seat {seatId}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
              </Paper>

              <Button
                variant="contained"
                onClick={handleAddTicket}
                disabled={
                  selectedSector === "" || selectedRow === "" || selectedSeat === ""
                }
                sx={{
                  minHeight: { xs: 72, md: "100%" },
                  borderRadius: { xs: "0 0 2px 2px", md: "0 2px 2px 0" },
                  bgcolor: "#0f57d6",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  fontWeight: 900,
                  fontSize: 13,
                  boxShadow: "none",
                  border: "1px solid #0f57d6",
                  "&:hover": {
                    bgcolor: "#0a49bb",
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#abc0ef",
                    color: "rgba(255,255,255,0.85)",
                  },
                }}
              >
                + Add Ticket
              </Button>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                overflow: "hidden",
                borderColor: "rgba(34, 54, 87, 0.18)",
                background: "rgba(255,255,255,0.92)",
              }}
            >
              <Box
                sx={{
                  px: { xs: 2, md: 3 },
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  background: "#e6edf5",
                  borderBottom: "1px solid rgba(34, 54, 87, 0.12)",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 900,
                      letterSpacing: 1.7,
                      textTransform: "uppercase",
                      color: "#3d4c63",
                    }}
                  >
                    Selected Inventory Ledger
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#6d7c94", mt: 0.4 }}>
                    Review the active ticket set before purchase.
                  </Typography>
                </Box>
                <Chip
                  label={`Current count: ${addedTickets.length.toString().padStart(2, "0")}`}
                  size="small"
                  sx={{
                    bgcolor: "transparent",
                    border: "1px solid rgba(34, 54, 87, 0.18)",
                    color: "#56657f",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                />
              </Box>

              <Box sx={{ overflowX: "auto" }}>
                <Table sx={{ minWidth: 720 }}>
                  <TableHead>
                    <TableRow>
                      {["Sector", "Row", "Seat", "Unit Price", "Action"].map((label) => (
                        <TableCell
                          key={label}
                          sx={{
                            fontSize: 11,
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: 1.4,
                            color: "#617089",
                            bgcolor: "#edf2f7",
                            borderBottomColor: "rgba(34, 54, 87, 0.12)",
                            py: 1.4,
                          }}
                        >
                          {label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {addedTickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} sx={{ py: 7, borderBottom: "none" }}>
                          <Box
                            sx={{
                              textAlign: "center",
                              color: "#a1acbc",
                              textTransform: "uppercase",
                              letterSpacing: 1.2,
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            End of active selection ledger
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      addedTickets.map((ticket) => (
                        <TableRow key={ticket.id} hover>
                          <TableCell
                            sx={{
                              py: 2.4,
                              borderBottomColor: "rgba(34, 54, 87, 0.08)",
                              fontWeight: 700,
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: 800,
                                  color: "#20304a",
                                  lineHeight: 1.1,
                                }}
                              >
                                {ticket.sectorName}
                              </Typography>
                              {ticket.standingArea && (
                                <Typography sx={{ fontSize: 10, color: "#8a95a8", mt: 0.3 }}>
                                  General admission
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              py: 2.4,
                              borderBottomColor: "rgba(34, 54, 87, 0.08)",
                              fontWeight: 700,
                            }}
                          >
                            {ticket.rowId}
                          </TableCell>
                          <TableCell
                            sx={{
                              py: 2.4,
                              borderBottomColor: "rgba(34, 54, 87, 0.08)",
                              fontWeight: 700,
                            }}
                          >
                            {ticket.seatId}
                          </TableCell>
                          <TableCell
                            sx={{
                              py: 2.4,
                              borderBottomColor: "rgba(34, 54, 87, 0.08)",
                              fontWeight: 900,
                              color: "#2453c7",
                            }}
                          >
                            {ticket.price.toFixed(2)} PLN
                          </TableCell>
                          <TableCell
                            sx={{
                              py: 2.4,
                              borderBottomColor: "rgba(34, 54, 87, 0.08)",
                            }}
                          >
                            <IconButton
                              edge="end"
                              aria-label="Remove ticket"
                              onClick={() =>
                                setAddedTickets((prev) =>
                                  prev.filter((t) => t.id !== ticket.id)
                                )
                              }
                              sx={{
                                border: "1px solid rgba(196, 94, 86, 0.2)",
                                bgcolor: "rgba(255, 248, 246, 0.9)",
                                color: "#c85d54",
                                borderRadius: 1,
                                width: 34,
                                height: 34,
                                "&:hover": {
                                  bgcolor: "rgba(255, 236, 232, 0.95)",
                                },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>

              <Divider sx={{ borderColor: "rgba(34, 54, 87, 0.12)" }} />

              <Box
                sx={{
                  px: { xs: 2, md: 3 },
                  py: 1.8,
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  background: "#eef3f8",
                }}
              >
                <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  <Box>
                    <Typography sx={ledgerLabelSx}>Subtotal</Typography>
                    <Typography sx={ledgerValueSx}>{totalPrice.toFixed(2)} PLN</Typography>
                  </Box>
                  <Box>
                    <Typography sx={ledgerLabelSx}>Seats selected</Typography>
                    <Typography sx={ledgerValueSx}>{addedTickets.length}</Typography>
                  </Box>
                </Box>

                <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: 1.6,
                      color: "#5e6f89",
                    }}
                  >
                    Total amount payable
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "1.8rem", md: "2.2rem" },
                      fontWeight: 900,
                      lineHeight: 1,
                      color: "#2453c7",
                    }}
                  >
                    {totalPrice.toFixed(2)} PLN
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Box sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleBuyTickets}
                disabled={addedTickets.length === 0}
                sx={{
                  minWidth: { xs: "100%", sm: 320 },
                  px: 5,
                  py: 2,
                  borderRadius: "2px",
                  bgcolor: "#0f57d6",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: 2.5,
                  fontWeight: 900,
                  fontSize: 14,
                  boxShadow: "0 12px 28px rgba(15, 87, 214, 0.25)",
                  "&:hover": {
                    bgcolor: "#0a49bb",
                    boxShadow: "0 14px 30px rgba(15, 87, 214, 0.28)",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#b7c7e8",
                    color: "rgba(255,255,255,0.92)",
                  },
                }}
              >
                Buy Tickets
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

const selectFieldSx = {
  minHeight: 58,
  bgcolor: "white",
  borderRadius: 0,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(34, 54, 87, 0.18)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(34, 54, 87, 0.32)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#0f57d6",
  },
  "& .MuiSelect-select": {
    py: 1.6,
    fontSize: 14,
    color: "#20304a",
    fontWeight: 700,
  },
};

const ledgerLabelSx = {
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: "#70819b",
};

const ledgerValueSx = {
  mt: 0.4,
  fontSize: 18,
  fontWeight: 900,
  color: "#20304a",
};

export default TicketPurchasePage;
