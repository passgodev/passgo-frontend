import { Route, Routes } from 'react-router-dom';
import Layout from './component/Layout.tsx';
import PersistLogin from './component/PersistLogin.tsx';
import RequireAuth from './component/RequireAuth.tsx';
import Home from './page/Home.tsx';
import LoginPage from './page/login/LoginPage.tsx';
import SignupPage from './page/signup/SignupPage.tsx';
import Transaction from './page/transaction/Transaction.tsx';


const App = () => {
    return (
        <Routes>
            <Route path="/" >

                {/*public routes*/}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/*protected routes*/}
                <Route element={<PersistLogin />} >
                    <Route element={<RequireAuth />}>
                        <Route element={<Layout />} >

                            <Route path="/" element={<Home />} />
                            <Route path="/transaction" element={<Transaction />} />
                        </Route>
                    </Route>
                </Route>

            </Route>
        </Routes>
    );
}

export default App;