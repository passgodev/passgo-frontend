import { IconButton, Typography, Box, Paper } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import FaqDto from "../model/faq/FaqDto.ts";

interface Props {
    faq: FaqDto;
    onEdit: (faq: FaqDto) => void;
    onDelete: (faq: FaqDto) => void;
}

const AdminFaqListItem = ({ faq, onEdit, onDelete }: Props) => (
    <Paper sx={{ p: 2, mb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
                <Typography fontWeight="bold">{faq.question}</Typography>
                <Typography>{faq.answer}</Typography>
            </Box>
            <Box>
                <IconButton onClick={() => onEdit(faq)}>
                    <Edit />
                </IconButton>
                <IconButton onClick={() => onDelete(faq)}>
                    <Delete />
                </IconButton>
            </Box>
        </Box>
    </Paper>
);

export default AdminFaqListItem;
