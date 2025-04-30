import {
    AppBar,
    Box,
    Container,
    CssBaseline,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
            <CssBaseline />

            {/* AppBar: Górny pasek */}
            <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {/* Logo + Nazwa aplikacji */}
                        PassGo
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ display: 'flex', flex: 1 }}>
                {/* Drawer: Nawigacja boczna */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            <ListItemButton to="/transaction">
                                <ListItemText primary="Transactions" />
                            </ListItemButton>
                            {/* Dodaj kolejne przyciski w razie potrzeby */}
                        </List>
                    </Box>
                </Drawer>

                {/* Główna zawartość */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1
                    }}
                >
                    <Container maxWidth={false} disableGutters={false}>
                        <Outlet /> {/* Tu renderujemy przekazane strony */}
                    </Container>
                </Box>
            </Box>

            {/* Stopka */}
            <Box component="footer" sx={{ py: 2, textAlign: 'right', backgroundColor: '#f5f5f5' }}>
                <Typography variant="body2" color="text.secondary" sx={{marginRight: '20px'}}>
                    {/* Placeholder dla stopki */}
                    © 2025 PassGo
                </Typography>
            </Box>
        </Box>
    );
};
export default Layout;
