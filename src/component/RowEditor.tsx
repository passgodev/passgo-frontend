import {
    Box,
    TextField,
    Typography,
    IconButton
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Row } from "../model/building/Row.ts"

interface Props {
    row: Row;
    onChange: (row: Row) => void;
    onDelete: () => void;
}

const RowEditor = ({ row, onChange, onDelete }: Props) => {
    return (
        <Box ml={2} my={2} display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1">Row {row.rowNumber}</Typography>
            <TextField
                label="Seats"
                type="number"
                value={row.seatsCount}
                onChange={(e) =>
                    onChange({ ...row, seatsCount: +e.target.value })
                }
                size="small"
            />
            <IconButton onClick={onDelete} color="error">
                <Delete />
            </IconButton>
        </Box>
    );
};

export default RowEditor;