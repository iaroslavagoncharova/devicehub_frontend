import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { UpdateProvider } from "./contexts/UpdateContexts";
import Home from "./views/Home";
import Layout from "./views/Layout";
import Devices from "./views/Devices";
import "./App.css";
import Login from "./views/Login";

import SingleDevice from "./components/SingleDevice";
import Data from "./views/data";
import { UserProvider } from "./contexts/UserContext";

// App Component
const App: React.FC = () => {
  return (
    <>
      <Router basename={import.meta.env.BASE_URL}>
        <UserProvider>
          <UpdateProvider>
            <Routes>
              <Route element={<Layout />}>
                {/* Home page accessible without login */}
                <Route path="/" element={<Home />} />
                {/* Devices page accessible without login */}
                <Route path="/devices" element={<Devices />} />
                {/* Data page accessible without login */}
                <Route path="/data" element={<Data />} />
                <Route
                  path="/devices/name/:deviceName"
                  element={<SingleDevice />}
                />
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          </UpdateProvider>
        </UserProvider>
      </Router>
    </>
  );
};

export default App;
