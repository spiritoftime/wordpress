import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Conferences from "./components/Conferences";
function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Conferences />} />
      </Route>
    </Routes>
  );
}

export default App;
