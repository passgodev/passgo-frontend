import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, CircularProgress, Button, Chip, Paper, Divider, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useInterceptedFetch from "../hook/useInterceptedFetch";
import API_ENDPOINTS from "../util/endpoint/ApiEndpoint";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

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
            
            if (!id) return;
            const endpoint = API_ENDPOINTS.eventDetails.replace(":id", id.toString());

            try {
                const res = await InterceptedFetch({
                    endpoint: endpoint,
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
                {/* Header Section */}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                      <Chip
                        label={event.category.toUpperCase()}
                        sx={{
                          bgcolor: "#dce8ff",
                          color: "#2956b5",
                          fontWeight: 900,
                          letterSpacing: 1.2,
                          fontSize: 11,
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        letterSpacing: -1.3,
                        textTransform: "capitalize",
                        fontSize: { xs: "2.2rem", md: "3rem" },
                        lineHeight: 0.95,
                      }}
                    >
                      {event.name}
                    </Typography>
                  </Box>

                  <Chip
                    label="TRANSACTION ID: EV-2026-512"
                    sx={{
                      alignSelf: "flex-start",
                      bgcolor: "#f0f4f9",
                      color: "#506576",
                      fontWeight: 700,
                      letterSpacing: 0.6,
                      fontSize: 10,
                      px: 1,
                      border: "1px solid rgba(34, 54, 87, 0.12)",
                    }}
                  />
                </Box>

                {/* Event Date & Time Section */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    borderColor: "rgba(34, 54, 87, 0.18)",
                    background: "rgba(255,255,255,0.92)",
                  }}
                >
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 3 }}>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 10,
                          fontWeight: 900,
                          letterSpacing: 1.6,
                          textTransform: "uppercase",
                          color: "#617089",
                          mb: 0.8,
                        }}
                      >
                        Event Date
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1.3rem",
                          fontWeight: 900,
                          color: "#20304a",
                        }}
                      >
                        {new Date(event.date).toLocaleDateString("pl-PL", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 10,
                          fontWeight: 900,
                          letterSpacing: 1.6,
                          textTransform: "uppercase",
                          color: "#617089",
                          mb: 0.8,
                        }}
                      >
                        Start Time
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1.3rem",
                          fontWeight: 900,
                          color: "#20304a",
                        }}
                      >
                        {new Date(event.date).toLocaleTimeString("pl-PL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Two Column Layout */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 420px" },
                    gap: 3,
                  }}
                >
                  {/* Left Column: Image & Description */}
                  <Stack spacing={2.5}>
                    {/* Image */}
                    {event.imageUrl && (
                      <Paper
                        variant="outlined"
                        sx={{
                          overflow: "hidden",
                          borderColor: "rgba(34, 54, 87, 0.18)",
                          aspectRatio: "16/10",
                        }}
                      >
                        <Box
                          component="img"
                          src={event.imageUrl}
                          alt={event.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Paper>
                    )}

                    {/* Description */}
                    {event.description && (
                      <Paper
                        variant="outlined"
                        sx={{
                          p: { xs: 2, md: 3 },
                          borderColor: "rgba(34, 54, 87, 0.18)",
                          background: "rgba(255,255,255,0.92)",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 900,
                            letterSpacing: 1.7,
                            textTransform: "uppercase",
                            color: "#3d4c63",
                            mb: 1.5,
                          }}
                        >
                          Description
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.95rem",
                            lineHeight: 1.7,
                            color: "#4d5f79",
                          }}
                        >
                          {event.description}
                        </Typography>
                      </Paper>
                    )}
                  </Stack>

                  {/* Right Column: Localization & Arena Details */}
                  <Stack spacing={2.5}>
                    {/* Localization */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        borderColor: "rgba(34, 54, 87, 0.18)",
                        background: "rgba(255,255,255,0.92)",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.5 }}>
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
                          📍
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
                          Localization
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            color: "#70819b",
                            mb: 0.6,
                          }}
                        >
                          Venue Reference
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: "#20304a",
                            mb: 2,
                          }}
                        >
                          {event.building.name}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 900,
                            letterSpacing: 1.5,
                            textTransform: "uppercase",
                            color: "#70819b",
                            mb: 0.6,
                          }}
                        >
                          Geographic Metadata
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#4d5f79",
                            lineHeight: 1.6,
                          }}
                        >
                          {event.building.address.street}{" "}
                          {event.building.address.buildingNumber}
                          <br />
                          {event.building.address.postalCode}{" "}
                          {event.building.address.city}
                          <br />
                          {event.building.address.country}
                        </Typography>
                      </Box>
                    </Paper>

                    {/* Arena Details */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: { xs: 2.5, md: 3 },
                        borderColor: "rgba(34, 54, 87, 0.18)",
                        background: "rgba(255,255,255,0.92)",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.5 }}>
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
                          🏛️
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
                          Arena Details
                        </Typography>
                      </Box>

                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            sx={{
                              fontSize: 10,
                              fontWeight: 900,
                              letterSpacing: 1.5,
                              textTransform: "uppercase",
                              color: "#70819b",
                              mb: 0.6,
                            }}
                          >
                            Sector Count
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1.4rem",
                              fontWeight: 900,
                              color: "#2453c7",
                            }}
                          >
                            {sectorCount.toString().padStart(2, "0")}
                          </Typography>
                        </Box>

                        <Divider sx={{ borderColor: "rgba(34, 54, 87, 0.12)" }} />

                        <Box>
                          <Typography
                            sx={{
                              fontSize: 10,
                              fontWeight: 900,
                              letterSpacing: 1.5,
                              textTransform: "uppercase",
                              color: "#70819b",
                              mb: 0.6,
                            }}
                          >
                            Row Allocation
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1.4rem",
                              fontWeight: 900,
                              color: "#2453c7",
                            }}
                          >
                            {rowCount.toString().padStart(2, "0")}
                          </Typography>
                        </Box>

                        <Divider sx={{ borderColor: "rgba(34, 54, 87, 0.12)" }} />

                        <Box>
                          <Typography
                            sx={{
                              fontSize: 10,
                              fontWeight: 900,
                              letterSpacing: 1.5,
                              textTransform: "uppercase",
                              color: "#70819b",
                              mb: 0.6,
                            }}
                          >
                            Seat Density
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "1.4rem",
                              fontWeight: 900,
                              color: "#2453c7",
                            }}
                          >
                            {seatCount} Units
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Stack>
                </Box>

                {/* Buy Tickets Button */}
                <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate(`/events/${id}/buy`)}
                    sx={{
                      minWidth: { xs: "100%", sm: 420 },
                      px: 5,
                      py: 2.5,
                      borderRadius: "2px",
                      bgcolor: "#0f57d6",
                      color: "white",
                      textTransform: "uppercase",
                      letterSpacing: 2.5,
                      fontWeight: 900,
                      fontSize: 14,
                      boxShadow: "0 12px 28px rgba(15, 87, 214, 0.25)",
                      display: "flex",
                      gap: 1.5,
                      justifyContent: "center",
                      "&:hover": {
                        bgcolor: "#0a49bb",
                        boxShadow: "0 14px 30px rgba(15, 87, 214, 0.28)",
                      },
                    }}
                  >
                    <ShoppingCartIcon sx={{ fontSize: 20 }} />
                    Buy tickets
                    <ArrowForwardIcon sx={{ fontSize: 18 }} />
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
    );
};

export default EventDetailsPage;
