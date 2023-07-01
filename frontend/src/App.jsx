import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Conferences from "./components/Conferences";
import AddConference from "./components/AddConference";
import AddContact from "./components/AddContact";
import Login from "./components/Login";
import Loading from "./components/Loading";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      {isAuthenticated ? (
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<Conferences />} />
          <Route path="/add-conference" element={<AddConference />} />
          <Route path="/add-contact" element={<AddContact />} />
        </Route>
      ) : (
        <Route path="/" element={<Login />} />
      )}
    </Routes>
  );
}

export default App;
