import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import Faq from "../interface/FaqInterface";

interface Props {
    open: boolean;
    faq: Faq | null;
    onCancel: () => void;
    onConfirm: () => void;
}

const AdminDeleteConfirmDialog = ({
    open,
    faq,
    onCancel,
    onConfirm,
}: Props) => (
    <Dialog open={open} onClose={onCancel}>
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
            Are you sure you want to delete FAQ: "{faq?.question}"?
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button color="error" onClick={onConfirm}>
                Delete
            </Button>
        </DialogActions>
    </Dialog>
);

export default AdminDeleteConfirmDialog;
