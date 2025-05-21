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
    Typography,
} from "@mui/material";
import { Link, Outlet } from "react-router-dom";
import Privilege from "../../model/member/Privilege.ts";
import CardWrapperComponent from "../../page/member/CardWrapperComponent.tsx";
import WEB_ENDPOINTS from "../../util/endpoint/WebEndpoint.ts";
import ButtonCollapseList from "../ButtonCollapseList.tsx";
import EnableOnRole from "../EnableOnRole.tsx";
import AccountButton from "./AccountButton.tsx";

const drawerWidth = 240;

const Layout = () => {
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
            <AppBar
                position="sticky"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Typography variant="h6" noWrap component="div">
                        <Link
                            to={WEB_ENDPOINTS.home}
                            style={{ textDecoration: "none", color: "white" }}
                        >
                            {/* Logo + Nazwa aplikacji */}
                            PassGo
                        </Link>
                    </Typography>
                    <AccountButton />
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
                            <ListItemButton
                                component={Link}
                                to={WEB_ENDPOINTS.transaction}
                            >
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
                                to={WEB_ENDPOINTS.events}
                            >
                                <ListItemText primary="Events" />
                            </ListItemButton>

                            <ListItemButton
                                component={Link}
                                to={WEB_ENDPOINTS.eventsManagement}
                            >
                                <ListItemText primary="Events Management" />
                            </ListItemButton>

                            <ListItemButton
                                component={Link}
                                to={WEB_ENDPOINTS.building}
                            >
                                <ListItemText primary="Building" />
                            </ListItemButton>

                            <EnableOnRole
                                allowedRoles={[Privilege.ADMINISTRATOR]}
                            >
                                <ListItemButton
                                    component={Link}
                                    to={WEB_ENDPOINTS.adminFaq}
                                >
                                    <ListItemText primary="Admin FAQ" />
                                </ListItemButton>
                            </EnableOnRole>
                            <EnableOnRole
                                allowedRoles={[Privilege.ADMINISTRATOR]}
                            >
                                <ButtonCollapseList name="Members">
                                    <ListItemButton
                                        sx={{ pl: 4 }}
                                        component={Link}
                                        to={WEB_ENDPOINTS.adminClientList}
                                    >
                                        <ListItemText primary="Clients" />
                                    </ListItemButton>
                                    <ListItemButton
                                        sx={{ pl: 4 }}
                                        component={Link}
                                        to={WEB_ENDPOINTS.adminOrganizerList}
                                    >
                                        <ListItemText primary="Organizers" />
                                    </ListItemButton>
                                </ButtonCollapseList>
                            </EnableOnRole>
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
                        <CardWrapperComponent>
                            <Outlet />
                        </CardWrapperComponent>
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
