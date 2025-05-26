import {useContext, useEffect, useState} from "react";
import {Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Paper, Typography,} from "@mui/material";
import {Add, Cancel, CheckCircle, Delete, Visibility} from "@mui/icons-material";
import useInterceptedFetch from "../hook/useInterceptedFetch";
import ApiEndpoint from "../util/endpoint/ApiEndpoint";
import {BuildingDto} from "../model/building/BuildingDto.ts";
import {useNavigate} from "react-router-dom";
import WebEndpoint from "../util/endpoint/WebEndpoint.ts";
import AuthContext from "../context/AuthProvider.tsx";
import Privilege from "../model/member/Privilege.ts";

const BuildingListPage = () => {
    const [buildings, setBuildings] = useState<BuildingDto[]>([]);
    const [selected, setSelected] = useState<BuildingDto | null>(null);
    const fetch = useInterceptedFetch();
    const { auth } = useContext(AuthContext);
    const role = auth.privilege;
    const navigate = useNavigate();

    const loadBuildings = () => {
        fetch({ endpoint: ApiEndpoint.buildings })
            .then(res => res.json())
            .then(setBuildings);
    };

    useEffect(() => {
        loadBuildings();
    }, []);

    const loadBuildingDetails = (id: number) => {
        fetch({endpoint: `${ApiEndpoint.buildings}/${id}`})
            .then(res => res.json())
            .then(setSelected);
    }

    const handleDelete = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this building?")) return;
        fetch({
            endpoint: `${ApiEndpoint.buildings}/${id}`,
            reqInit: { method: "DELETE" },
        }).then(() => loadBuildings());
    };

    const handleApprove = (id: number) => {
        fetch({
            endpoint: `${ApiEndpoint.buildings}/${id}/status?status=APPROVED`,
            reqInit: { method: "PATCH" },
        }).then(() => loadBuildings());
    };

    const handleReject = (id: number) => {
        fetch({
            endpoint: `${ApiEndpoint.buildings}/${id}/status?status=REJECTED`,
            reqInit: { method: "PATCH" },
        }).then(() => loadBuildings());
    };

    return (
        <Box p={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Building List</Typography>
                {role === Privilege.ORGANIZER && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate(WebEndpoint.addBuilding)}
                    >
                        Add Building
                    </Button>
                )}
            </Box>

            {buildings.map((b) => (
                <Paper key={b.id} sx={{ p: 2, mb: 2, position: "relative" }}>
                    <Typography variant="h6">{b.name}</Typography>
                    <Typography>{b.address.city}, {b.address.street} {b.address.buildingNumber}</Typography>
                    <Typography variant="body2">Status: {b.status}</Typography>

                    <Box mt={1}>
                        <IconButton onClick={() => loadBuildingDetails(b.id)}><Visibility /></IconButton>
                        {role === Privilege.ADMINISTRATOR && (
                            <>
                                <IconButton color="success" onClick={() => handleApprove(b.id)}><CheckCircle/></IconButton>
                                <IconButton color="error" onClick={() => handleReject(b.id)}><Cancel/></IconButton>
                                <IconButton color="error" onClick={() => handleDelete(b.id)}><Delete /></IconButton>
                            </>
                        )}
                    </Box>
                </Paper>
            ))}

            <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth maxWidth="md">
                <DialogTitle>{selected?.name}</DialogTitle>
                <DialogContent>
                    {selected ? (
                        <>
                            <Typography variant="subtitle1" gutterBottom>Address:</Typography>
                            <Typography gutterBottom>
                                {selected.address.street} {selected.address.buildingNumber}, {selected.address.postalCode} {selected.address.city}, {selected.address.country}
                            </Typography>

                            <Typography variant="subtitle1" gutterBottom>Sectors:</Typography>
                            {selected.sectors?.length > 0 ? (
                                selected.sectors.map((sector, i) => (
                                    <Box key={i} mb={1}>
                                        <Typography fontWeight="bold">{sector.name}</Typography>
                                        <Typography variant="body2">
                                            Standing Area: {sector.standingArea ? "Yes" : "No"}
                                        </Typography>
                                        <Typography variant="body2">
                                            Rows: {sector.rows.length}
                                        </Typography>
                                        {sector.rows?.length > 0 ? (
                                            sector.rows.map((row, j) => (
                                                <Box key={j}>
                                                    <Typography variant="body2">
                                                        Row number: {row.rowNumber} Seats count: {row.seatsCount}
                                                    </Typography>
                                                </Box>
                                            ))
                                        ) : (
                                            <Typography variant="body2">No Rows loaded.</Typography>
                                        )}
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2">No sectors loaded.</Typography>
                            )}
                        </>
                    ) : (
                        <Typography>Loading...</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default BuildingListPage;