import AccountCircle from '@mui/icons-material/AccountCircle';
import {
    AppBar,
    Box,
    Collapse,
    Container,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import WEB_ENDPOINTS from '../util/endpoint/WebEndpoint.ts';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const drawerWidth = 240;

const Layout = () => {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                flexDirection: "column",
            }}
        >
            <CssBaseline />

            {/* AppBar: Górny pasek */}
            <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{justifyContent: 'space-between'}}>
                    <Typography variant="h6" noWrap component="div">
                        <Link to={WEB_ENDPOINTS.home} style={{ textDecoration: 'none', color: 'white' }}>
                            {/* Logo + Nazwa aplikacji */}
                            PassGo
                        </Link>
                    </Typography>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                        component={Link} to='/members/me'
                    >
                        <AccountCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: "flex", flex: 1 }}>
                {/* Drawer: Nawigacja boczna */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: "border-box",
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: "auto" }}>
                        <List>
                            <ListItemButton component={Link} to={WEB_ENDPOINTS.transaction} >
                                <ListItemText primary="Transactions" />
                            </ListItemButton>
                            <ListItemButton
                                component={Link}
                                to={WEB_ENDPOINTS.faq}
                            >
                                <ListItemText primary="FAQ" />
                            </ListItemButton>
                            <ListItemButton
                                component={Link}
                                to={WEB_ENDPOINTS.adminFaq}
                            >
                                <ListItemText primary="Admin FAQ" />
                            </ListItemButton>
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
                        </List>
                    </Box>
                </Drawer>

                {/* Główna zawartość */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    <Container maxWidth={false} disableGutters={false}>
                        <Outlet /> {/* Tu renderujemy przekazane strony */}
                    </Container>
                </Box>
            </Box>

            {/* Stopka */}
            <Box
                component="footer"
                sx={{ py: 2, textAlign: "right", backgroundColor: "#f5f5f5" }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginRight: "20px" }}
                >
                    {/* Placeholder dla stopki */}© 2025 PassGo
                </Typography>
            </Box>
        </Box>
    );
};
export default Layout;
