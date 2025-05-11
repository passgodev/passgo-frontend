import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Collapse, List, ListItemButton, ListItemText } from '@mui/material';
import { ReactElement, useState } from 'react';


interface ButtonCollapseListProps {
    children: ReactElement<typeof ListItemButton>[]
    name: string
}

const ButtonCollapseList = ({ children, name }: ButtonCollapseListProps) => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton onClick={handleClick} >
                <ListItemText primary={name} />
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div">
                    <>
                        {children}
                    </>
                </List>
            </Collapse>
        </>
    );
};
export default ButtonCollapseList;
