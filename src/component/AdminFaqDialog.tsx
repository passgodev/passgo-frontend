import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";
import Faq from "../interface/FaqInterface";

interface Props {
    open: boolean;
    faq: Partial<Faq> | null;
    onClose: () => void;
    onChange: (faq: Partial<Faq>) => void;
    onSave: () => void;
}

const AdminFaqDialog = ({ open, faq, onClose, onChange, onSave }: Props) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{faq?.id ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
        <DialogContent>
            <TextField
                fullWidth
                label="Question"
                margin="normal"
                value={faq?.question || ""}
                onChange={(e) =>
                    onChange({ ...faq!, question: e.target.value })
                }
            />
            <TextField
                fullWidth
                label="Answer"
                margin="normal"
                multiline
                rows={4}
                value={faq?.answer || ""}
                onChange={(e) => onChange({ ...faq!, answer: e.target.value })}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={onSave}>
                Save
            </Button>
        </DialogActions>
    </Dialog>
);

export default AdminFaqDialog;
