import Privilege from "../model/member/Privilege.ts";
import {Button} from "@mui/material";

interface AdminButtonProps {
    role?: Privilege;
    onClick: () => void;
    children: React.ReactNode;
}

const AdminAddFaqButton: React.FC<AdminButtonProps> = ({ role, onClick, children }) => {
    if (role !== Privilege.ADMINISTRATOR) return null;

    return (
        <Button variant="contained" onClick={onClick}>
            {children}
        </Button>
    );
};
export default AdminAddFaqButton;
