import {
    Box, Button, Typography, TextField, Paper, Grid, IconButton
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import { Building } from "../model/building/Building.ts"
import { Sector } from "../model/building/Sector.ts"
import { useNavigate } from "react-router-dom";
import SectorEditor from "../component/SectorEditor.tsx";
import StandingAreaEditor from "../component/StandingAreaEditor.tsx";
import useInterceptedFetch from "../hook/useInterceptedFetch.ts";
import ApiEndpoint from "../util/endpoint/ApiEndpoint.ts";
import WebEndpoint from "../util/endpoint/WebEndpoint.ts";


const AddBuildingPage = () => {
    const [building, setBuilding] = useState<Building>({
        name: "",
        address: {
            country: "",
            city: "",
            street: "",
            postalCode: "",
            buildingNumber: "",
        },
        sectors: [],
    });
    const [hasStandingArea, setHasStandingArea] = useState<boolean>(false);
    const [standingAreaSector, setStandingAreaSector] = useState<Sector>({
        name: "Standing",
        standingArea: true,
        rows: [{ rowNumber: 0, seatsCount: 0 }]
    });

    const fetch = useInterceptedFetch();
    const navigate = useNavigate();


    const addSector = () => {
        setBuilding((prev) => ({
            ...prev,
            sectors: [
                ...prev.sectors,
                { name: "", standingArea: false, rows: [] },
            ],
        }));
    };

    const updateSector = (index: number, sector: Sector) => {
        const newSectors = [...building.sectors];
        newSectors[index] = sector;
        setBuilding((prev) => ({ ...prev, sectors: newSectors }));
    };

    const removeSector = (index: number) => {
        const newSectors = [...building.sectors];
        newSectors.splice(index, 1);
        setBuilding((prev) => ({ ...prev, sectors: newSectors }));
    };

    const handleSubmit = () => {
        const payload = {
            name: building.name,
            address: building.address,
            sectors: hasStandingArea ? [standingAreaSector, ...building.sectors] : building.sectors
        };

        fetch({
            endpoint: ApiEndpoint.buildings,
            reqInit: {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        }).then((res) => {
            if (res.ok) navigate(WebEndpoint.building);
        });
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" mb={2}>Add New Building</Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">Building Info</Typography>
                <TextField
                    label="Building Name"
                    fullWidth
                    margin="normal"
                    value={building.name}
                    onChange={(e) =>
                        setBuilding({ ...building, name: e.target.value })
                    }
                />
                <Grid container spacing={2}>
                    {["country", "city", "street", "postalCode", "buildingNumber"].map((field) => (
                        <Grid size={6} key={field} >
                            <TextField
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                fullWidth
                                value={(building.address as any)[field]}
                                onChange={(e) =>
                                    setBuilding((prev) => ({
                                        ...prev,
                                        address: {
                                            ...prev.address,
                                            [field]: e.target.value,
                                        },
                                    }))
                                }
                            />
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">Sectors</Typography>
                <StandingAreaEditor
                    hasStandingArea={hasStandingArea}
                    setHasStandingArea={setHasStandingArea}
                    standingAreaSector={standingAreaSector}
                    setStandingAreaSector={setStandingAreaSector}
                />
                {building.sectors.map((sector, index) => (
                    <Paper key={index} sx={{ p: 2, my: 2, position: "relative" }}>
                        <SectorEditor
                            sector={sector}
                            onChange={(updated) => updateSector(index, updated)}
                        />
                        <IconButton
                            onClick={() => removeSector(index)}
                            color="error"
                            sx={{ position: "absolute", bottom: 35, right: 16 }}
                        >
                            <Delete />
                        </IconButton>
                    </Paper>
                ))}
                <Button variant="outlined" onClick={addSector}>
                    + Add Sector
                </Button>
            </Paper>

            <Button variant="contained" onClick={handleSubmit}>
                Submit Building
            </Button>
        </Box>
    );
};

export default AddBuildingPage;