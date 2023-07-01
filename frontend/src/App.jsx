import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Conferences from "./components/Conferences";
import AddConference from "./components/AddConference";
import Login from "./components/Login";
import Loading from "./components/Loading";
import Conference from "./components/Conference";

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
          <Route path="/conferences/:conferenceId" element={<Conference />} />
          <Route path="/add-conference" element={<AddConference />} />
        </Route>
      ) : (
        <Route path="/" element={<Login />} />
      )}
    </Routes>
  );
}

export default App;
