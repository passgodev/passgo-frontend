import { Paper, Typography, FormControlLabel, Checkbox, TextField } from "@mui/material";
import { Sector } from "../model/building/Sector";

interface Props {
    hasStandingArea: boolean;
    setHasStandingArea: (val: boolean) => void;
    standingAreaSector: Sector;
    setStandingAreaSector: (sector: Sector) => void;
}

const StandingAreaEditor = ({
                                hasStandingArea,
                                setHasStandingArea,
                                standingAreaSector,
                                setStandingAreaSector
                            }: Props) => {
    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Standing Area</Typography>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={hasStandingArea}
                        onChange={(e) => setHasStandingArea(e.target.checked)}
                    />
                }
                label="Include standing area"
            />

            {hasStandingArea && (
                <Paper sx={{ p: 2, my: 2 }}>
                    <TextField
                        label="Standing Area Name"
                        fullWidth
                        margin="normal"
                        value={standingAreaSector.name}
                        onChange={(e) =>
                            setStandingAreaSector({
                                ...standingAreaSector,
                                name: e.target.value
                            })
                        }
                    />
                    <TextField
                        label="Capacity (number of standing places)"
                        fullWidth
                        type="number"
                        margin="normal"
                        value={standingAreaSector.rows[0].seatsCount}
                        onChange={(e) =>
                            setStandingAreaSector({
                                ...standingAreaSector,
                                rows: [
                                    {
                                        rowNumber: 0,
                                        seatsCount: parseInt(e.target.value) || 0
                                    }
                                ]
                            })
                        }
                    />
                </Paper>
            )}
        </Paper>
    );
};

export default StandingAreaEditor;
