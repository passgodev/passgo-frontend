import { Route, Routes } from 'react-router-dom';
import Layout from './component/Layout.tsx';
import PersistLogin from './component/PersistLogin.tsx';
import RequireAuth from './component/RequireAuth.tsx';
import Privilege from './model/member/Privilege.ts';
import Home from './page/Home.tsx';
import LoginPage from './page/login/LoginPage.tsx';
import ActiveMemberProfilePage from './page/member/ActiveMemberProfilePage.tsx';
import ClientInfoPage from './page/member/client/ClientInfoPage.tsx';
import PageNotFound from './page/PageNotFound.tsx';
import SignupPage from './page/signup/SignupPage.tsx';
import TestOnlyAuthorized from './page/TestOnlyAuthorized.tsx';
import Transaction from './page/transaction/Transaction.tsx';
import UnauthorizedPage from './page/UnauthorizedPage.tsx';
import FaqPage from './page/FaqPage.tsx';
import AdminFaqPage from './page/AdminFaqPage.tsx';
import WEB_ENDPOINTS from './util/endpoint/WebEndpoint.ts';
import EventsPage from "./page/Events.tsx";

const App = () => {
    return (
        <Routes>
            <Route path={WEB_ENDPOINTS.home} >

                {/* public routes */}
                <Route path={WEB_ENDPOINTS.login} element={<LoginPage />} />
                <Route path={WEB_ENDPOINTS.signup} element={<SignupPage />} />
                <Route path={WEB_ENDPOINTS.unauthorized} element={<UnauthorizedPage />} />

                {/* protected routes */}
                <Route element={<PersistLogin />} >
                    {/* member with no set role(memberType) can access */}
                    <Route element={<RequireAuth />}>
                        <Route element={<Layout />} >
                            <Route path={WEB_ENDPOINTS.home} element={<Home />} />
                            <Route path={WEB_ENDPOINTS.transaction} element={<Transaction />} />
                            <Route path={WEB_ENDPOINTS.clientById} element={<ClientInfoPage />} />
                            <Route path={WEB_ENDPOINTS.activeMemberProfile} element={<ActiveMemberProfilePage />} />
                            <Route path={WEB_ENDPOINTS.faq} element={<FaqPage />} />
                            <Route path={WEB_ENDPOINTS.adminFaq} element={<AdminFaqPage />} />
                            <Route path={WEB_ENDPOINTS.events} element={<EventsPage />} />
                        </Route>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={[Privilege.ADMINISTRATOR]} />} >
                        <Route element={<Layout />} >
                            <Route path='testauthorize' element={<TestOnlyAuthorized/>} />
                        </Route>
                    </Route>
                </Route>
            </Route>
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    );
};

export default App;
