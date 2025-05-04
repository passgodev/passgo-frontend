import { Route, Routes } from 'react-router-dom';
import Layout from './component/Layout.tsx';
import PersistLogin from './component/PersistLogin.tsx';
import RequireAuth from './component/RequireAuth.tsx';
import Home from './page/Home.tsx';
import LoginPage from './page/login/LoginPage.tsx';
import ActiveMemberProfilePage from './page/member/ActiveMemberProfilePage.tsx';
import ClientInfoPage from './page/member/client/ClientInfoPage.tsx';
import SignupPage from './page/signup/SignupPage.tsx';
import TestOnlyAuthorized from './page/TestOnlyAuthorized.tsx';
import Transaction from './page/transaction/Transaction.tsx';
import UnauthorizedPage from './page/UnauthorizedPage.tsx';


const App = () => {
    return (
        <Routes>
            <Route path="/" >

                {/* public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* protected routes */}
                <Route element={<PersistLogin />} >
                    {/* member with no set role(memberType) can access */}
                    <Route element={<RequireAuth />}>
                        <Route element={<Layout />} >
                            <Route path="/" element={<Home />} />
                            <Route path="/transaction" element={<Transaction />} />
                            <Route path="/clients/:id" element={<ClientInfoPage />} />
                            <Route path="/members/me" element={<ActiveMemberProfilePage />} />
                        </Route>
                    </Route>
                    <Route element={<RequireAuth allowedRoles={['ADMINISTRATOR']} />} >
                        <Route element={<Layout />} >
                            <Route path='testauthorize' element={<TestOnlyAuthorized/>} />
                        </Route>
                    </Route>
                </Route>

            </Route>
        </Routes>
    );
}

export default App;