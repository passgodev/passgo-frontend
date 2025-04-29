import { Route, Routes } from 'react-router-dom';
import Layout from './component/Layout.tsx';
import PersistLogin from './component/PersistLogin.tsx';
import RequireAuth from './component/RequireAuth.tsx';
import Home from './page/Home.tsx';
import LoginPage from './page/login/LoginPage.tsx';
import SignupPage from './page/signup/SignupPage.tsx';
import Transaction from './page/Transaction.tsx';


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />} >

                {/*public routes*/}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/*protected routes*/}
                <Route element={<PersistLogin />} >
                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<Home />} />
                            <Route path="/transaction" element={<Transaction />} />
                    </Route>
                </Route>

            </Route>
        </Routes>
    );
}

export default App;