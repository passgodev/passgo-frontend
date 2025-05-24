import {
    Box,
    TextField,
    Button,
    Divider,
} from "@mui/material";
import { Sector } from "../model/building/Sector.ts"
import { Row } from "../model/building/Row.ts"
import RowEditor from "./RowEditor.tsx";

interface Props {
    sector: Sector;
    onChange: (sector: Sector) => void;
}

const SectorEditor = ({ sector, onChange }: Props) => {
    const updateRow = (index: number, row: Row) => {
        const newRows = [...sector.rows];
        newRows[index] = row;
        onChange({ ...sector, rows: newRows });
    };

    const addRow = () => {
        const newRow: Row = { rowNumber: sector.rows.length + 1, seatsCount: 0 };
        onChange({ ...sector, rows: [...sector.rows, newRow] });
    };

    const removeRow = (index: number) => {
        const newRows = [...sector.rows];
        newRows.splice(index, 1);
        onChange({ ...sector, rows: newRows });
    };

    return (
        <Box my={2}>
            <Divider sx={{ mb: 2 }} />
            <TextField
                label="Sector Name"
                fullWidth
                margin="normal"
                value={sector.name}
                onChange={(e) => onChange({ ...sector, name: e.target.value })}
            />
            {sector.rows.map((row, i) => (
                <RowEditor key={i} row={row} onChange={(r) => updateRow(i, r)} onDelete={() => removeRow(i)} />
            ))}
            <Button variant="outlined" onClick={addRow}>
                + Add Row
            </Button>
        </Box>
    );
};

export default SectorEditor;