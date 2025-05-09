import { IconButton, Typography, Box, Paper } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Faq from "../interface/FaqInterface";

interface Props {
    faq: Faq;
    onEdit: (faq: Faq) => void;
    onDelete: (faq: Faq) => void;
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
