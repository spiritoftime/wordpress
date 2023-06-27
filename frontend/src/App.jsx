import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Conferences from "./components/Conferences";
import AddConference from "./components/AddConference";
import Login from "./components/Login";
import Loading from "./components/Loading";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <DashboardLayout /> : <Login />}
      >
        <Route path="dashboard" element={<Conferences />} />
        <Route path="add-conference" element={<AddConference />} />
      </Route>
    </Routes>
  );
}

export default App;
