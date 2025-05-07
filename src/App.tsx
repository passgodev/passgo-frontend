import { Route, Routes } from "react-router-dom";
import Layout from "./component/Layout.tsx";
import PersistLogin from "./component/PersistLogin.tsx";
import RequireAuth from "./component/RequireAuth.tsx";
import Home from "./page/Home.tsx";
import LoginPage from "./page/login/LoginPage.tsx";
import SignupPage from "./page/signup/SignupPage.tsx";
import Transaction from "./page/Transaction.tsx";
import FaqPage from "./page/FaqPage.tsx";
import WebEndpoints from "./util/endpoint/WebEndpoint.ts";
import EventsPage from "./page/Events.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/">
        {/*public routes*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/*protected routes*/}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/transaction" element={<Transaction />} />
              <Route path={WebEndpoints.faq} element={<FaqPage />} />

              <Route path="/events" element={<EventsPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
