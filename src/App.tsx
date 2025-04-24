import Layout from './components/Layout.tsx';
import RequireAuth from './components/RequireAuth.tsx';
import Home from './pages/Home.tsx';
import LoginPage from './pages/LoginPage.tsx';
import { Routes, Route } from 'react-router-dom';
import SignupPage from './pages/signup/SignupPage.tsx';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />} >

                {/*public routes*/}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/*protected routes*/}
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<Home />} />
                </Route>

            </Route>
        </Routes>
    );
}

export default App;