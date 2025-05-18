import AccountCircle from '@mui/icons-material/AccountCircle';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WEB_ENDPOINTS from '../../util/endpoint/WebEndpoint.ts';


const AccountButton = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigate = useNavigate();

    console.log(anchorEl);

    return (
        <IconButton
            id="basic-button"
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
        >
            <AccountCircle onClick={handleClick}/>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={(e)=> {
                    e.preventDefault();
                    handleClose();
                    navigate(WEB_ENDPOINTS.activeMemberProfile);
                }}>Profile</MenuItem>
                <MenuItem onClick={(e) => {
                    e.preventDefault();
                    handleClose();
                    navigate(WEB_ENDPOINTS.logout, {
                        replace: true,
                    });
                }}>Logout</MenuItem>
            </Menu>
        </IconButton>
    );
};
export default AccountButton;
