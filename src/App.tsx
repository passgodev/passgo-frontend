import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./component/layout/Layout.tsx";
import PersistLogin from "./component/PersistLogin.tsx";
import RequireAuth from "./component/RequireAuth.tsx";
import Privilege from "./model/member/Privilege.ts";
import WEB_ENDPOINTS from "./util/endpoint/WebEndpoint.ts";

// Auth Pages
import LoginPage from "./page/login/LoginPage.tsx";
import LogoutPage from './page/logout/LogoutPage.tsx';
import SignupPage from "./page/signup/SignupPage.tsx";
import UnauthorizedPage from "./page/UnauthorizedPage.tsx";
import PageNotFound from "./page/PageNotFound.tsx";

// New Core Pages
import Dashboard from "./page/Dashboard.tsx";
import EventsHub from "./page/EventsHub.tsx";

// Other Existing Pages
import AddEventPage from "./page/AddEvent.tsx";
import AdminFaqPage from "./page/AdminFaqPage.tsx";
import BuildingHub from "./page/BuildingHub.tsx";
import EventDetailsPage from './page/EventDetailsPage.tsx';
import FaqPage from "./page/FaqPage.tsx";
import UserManagement from "./page/member/UserManagement.tsx";
import TicketPurchasePage from "./page/TicketPurchasePage.tsx";
import Transaction from "./page/transaction/Transaction.tsx";

const App = () => {
    return (
        <Routes>
            {/* --- STANDALONE AUTHENTICATION PAGES --- */}
            <Route path={WEB_ENDPOINTS.login} element={<LoginPage />} />
            <Route path={WEB_ENDPOINTS.signup} element={<SignupPage />} />
            <Route path={WEB_ENDPOINTS.unauthorized} element={<UnauthorizedPage />} />
            <Route path={WEB_ENDPOINTS.logout} element={<LogoutPage />} />

            {/* --- MAIN APPLICATION (WRAPPED IN SIDEBAR LAYOUT) --- */}
            <Route element={<PersistLogin />}>
                <Route element={<Layout />}>
                    
                    {/* PUBLIC ROUTES (Anyone can view these, no login required) */}
                    <Route path={WEB_ENDPOINTS.home} element={<Navigate to={WEB_ENDPOINTS.events} replace />} />
                    <Route path={WEB_ENDPOINTS.events} element={<EventsHub />} />
                    <Route path={WEB_ENDPOINTS.eventById} element={<EventDetailsPage />} />
                    <Route path={WEB_ENDPOINTS.faq} element={<FaqPage />} />

                    {/* PROTECTED ROUTES (Must be logged in) */}
                    <Route element={<RequireAuth />}>
                        <Route path={WEB_ENDPOINTS.activeMemberProfile} element={<Dashboard />} />
                        <Route path={WEB_ENDPOINTS.buyTickets} element={<TicketPurchasePage />} />
                        <Route path={WEB_ENDPOINTS.transaction} element={<Transaction />} />
                    </Route>

                    {/* ORGANIZERS & ADMINS ONLY */}
                    <Route element={<RequireAuth allowedRoles={[Privilege.ORGANIZER, Privilege.ADMINISTRATOR]} />}>
                        <Route path={WEB_ENDPOINTS.addEvent} element={<AddEventPage />} />
                        <Route path={WEB_ENDPOINTS.building} element={<BuildingHub />} />
                        <Route path={WEB_ENDPOINTS.addBuilding} element={<BuildingHub />} />
                        <Route path={WEB_ENDPOINTS.eventsManagement} element={<Navigate to={WEB_ENDPOINTS.events} replace />} />
                    </Route>

                    {/* ADMINS ONLY */}
                    <Route element={<RequireAuth allowedRoles={[Privilege.ADMINISTRATOR]} />}>
                        <Route path={WEB_ENDPOINTS.adminFaq} element={<AdminFaqPage />} />
                        <Route path={WEB_ENDPOINTS.adminClientList} element={<UserManagement />} />
                    </Route>

                </Route>
            </Route>

            {/* CATCH ALL */}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default App;