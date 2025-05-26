import {
    Box, Typography, TextField, Button, MenuItem, Grid, Paper
} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import useInterceptedFetch from "../hook/useInterceptedFetch";
import ApiEndpoint from "../util/endpoint/ApiEndpoint";
import WebEndpoint from "../util/endpoint/WebEndpoint";
import dayjs from "dayjs";
import {BuildingDto} from "../model/building/BuildingDto.ts";
import {RowDto} from "../model/building/RowDto.ts";
import AuthContext from "../context/AuthProvider.tsx";
import Privilege from "../model/member/Privilege.ts";

const AddEventPage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(dayjs().format("YYYY-MM-DDTHH:mm"));
    const [buildingId, setBuildingId] = useState<number | null>(null);
    const [buildings, setBuildings] = useState<BuildingDto[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [selected, setSelected] = useState<BuildingDto | null>(null);
    const [rowPrices, setRowPrices] = useState<Record<number, string>>({});

    const fetch = useInterceptedFetch();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const role = auth.privilege;
    const organizerId = auth.memberId;
    console.log('organizerId: ', organizerId);

    useEffect(() => {
        if(role !== Privilege.ORGANIZER){
            return;
        }

        fetch({ endpoint: ApiEndpoint.buildings })
            .then(res => res.json())
            .then(setBuildings);
    }, []);

    const loadBuildingDetails = (id: number) => {
        fetch({endpoint: ApiEndpoint.buildingsDetails.replace(":id", id.toString())})
            .then(res => res.json())
            .then(data => {
                setSelected(data);
                const prices: Record<number, string> = {};
                data.sectors.forEach((sector: { rows: RowDto[]; }) => {
                    sector.rows.forEach(row => {
                        prices[row.id] = "";
                    });
                });
                setRowPrices(prices);
            });
    }

    const handleSubmit = async () => {
        if(organizerId === undefined) {
            return;
        }
        const payload = {
            organizerId,
            name,
            buildingId,
            date,
            description,
            category,
            rowPrices: Object.fromEntries(
                Object.entries(rowPrices).map(([k, v]) => [k, parseFloat(v)])
            ),
        };

        const res = await fetch({
            endpoint: ApiEndpoint.events,
            reqInit: {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        });

        if (res.ok) {
            const created = await res.json();
            const eventId = created.id;

            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);

                const imageRes = await fetch({
                    endpoint: ApiEndpoint.eventImage.replace(":id", eventId.toString()),
                    reqInit: {
                        method: "POST",
                        body: formData,
                    }
                });

                if (!imageRes.ok) {
                    alert("Event created, but image upload failed.");
                    return;
                }
            }
        }
        navigate(WebEndpoint.eventsManagement);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={2}>Add New Event</Typography>

            <Grid container spacing={2}>
                <Grid size={12}>
                    <TextField
                        label="Event Name"
                        fullWidth
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </Grid>

                <Grid size={12}>
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </Grid>

                <Grid size={6}>
                    <TextField
                        label="Category"
                        fullWidth
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    />
                </Grid>

                <Grid size={6}>
                    <TextField
                        label="Date and Time"
                        type="datetime-local"
                        fullWidth
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </Grid>

                <Grid size={12}>
                    <TextField
                        select
                        fullWidth
                        label="Building"
                        value={buildingId ?? ""}
                        onChange={e => {
                            const id = parseInt(e.target.value);
                            setBuildingId(id);
                            loadBuildingDetails(id);
                        }}
                    >
                        {buildings.map(b => (
                            <MenuItem key={b.id} value={b.id}>
                                {b.name}, {b.address.city}, {b.address.street} {b.address.buildingNumber}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {selected && (
                    <Grid size={12}>
                        <Paper sx={{ p: 2, mt: 2 }}>
                            <Typography variant="h6" gutterBottom>Set Row Prices</Typography>
                            <Grid container spacing={2}>
                                {selected.sectors.flatMap(sector =>
                                    sector.rows.map(row => (
                                        <Grid size={6} key={row.id}>
                                            <TextField
                                                label={`Price for ${sector.name}, row ${row.rowNumber}`}
                                                fullWidth
                                                type="number"
                                                slotProps={{
                                                    htmlInput: { min: 0 }
                                                }}
                                                value={rowPrices[row.id] ?? ""}
                                                onChange={e =>
                                                    setRowPrices(prev => ({
                                                        ...prev,
                                                        [row.id]: e.target.value,
                                                    }))
                                                }
                                            />
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                <Grid size={12}>
                    <Button variant="outlined" component="label">
                        Upload Image
                        <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                        />
                    </Button>
                    {imageFile && <Typography mt={1}>{imageFile.name}</Typography>}
                </Grid>


                <Grid size={12}>
                    <Button variant="contained" onClick={handleSubmit}>
                        Create Event
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AddEventPage;