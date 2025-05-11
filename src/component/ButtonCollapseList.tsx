import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import WEB_ENDPOINTS from '../util/endpoint/WebEndpoint.ts';


const ButtonCollapseList = () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton onClick={handleClick} >
                <ListItemText primary="Members" />
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                {/*to different component*/}
            </ListItemButton>
            {/* Dodaj kolejne przyciski w razie potrzeby */}
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div">
                    <ListItemButton sx={{ pl: 4 }} component={Link} to={WEB_ENDPOINTS.adminClientList}>
                        <ListItemText primary="Clients" />
                    </ListItemButton>
                    <ListItemButton sx={{ pl: 4 }} component={Link} to={WEB_ENDPOINTS.adminOrganizerList}>
                        <ListItemText primary="Organizers" />
                    </ListItemButton>
                </List>
            </Collapse>
        </>
    );
};
export default ButtonCollapseList;
