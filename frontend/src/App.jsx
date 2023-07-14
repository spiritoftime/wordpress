import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Conferences from "./components/Conferences";
import AddConference from "./components/AddConference";
import AddContact from "./components/AddContact";
import Contacts from "./components/Contacts";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Loading from "./components/Loading";
import Conference from "./components/Conference";
import Sessions from "./components/Sessions";
import Speakers from "./components/Speakers";
import AddSpeakers from "./components/AddSpeakers";
import Speaker from "./components/Speaker";
import NotFound from "./components/NotFound";
import AddSession from "./components/AddSession";
import Session from "./components/Session";

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
        <Route path="conferences">
          <Route path=":conferenceId" element={<Conference />} />
          <Route path="speakers/:conferenceId" element={<Speakers />} />
          <Route
            path="speakers/:conferenceId/:speakerId"
            element={<Speaker />}
          />
          <Route path="add-speakers/:conferenceId" element={<AddSpeakers />} />

          <Route
            path="sessions/:conferenceId"
            element={<div>This is the session page</div>}
          />
          <Route
            path="program-overview/:conferenceId"
            element={<div>This is the program overview page</div>}
          />
        </Route>
        <Route path="/sessions/:sessionId" element={<Session />} />
        <Route path="/add-session" element={<AddSession />} />
        <Route path="add-conference" element={<AddConference />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="contacts/:contactId" element={<Contact />} />
        <Route path="add-contact" element={<AddContact />} />
        <Route path="/sessions" element={<Sessions />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  // return (
  //   <Routes>
  //     {isAuthenticated ? (
  //       <Route path="/" element={<DashboardLayout />}>
  //         <Route path="/" element={<Conferences />} />
  //         <Route path="/conferences/:conferenceId" element={<Conference />} />
  //         {/* <Route
  //           path="conferences/:conferenceId/add-speakers"
  //           element={<AddSpeakers />}
  //         /> */}
  //         <Route path="/add-conference" element={<AddConference />} />
  //         <Route path="/contacts" element={<Contacts />} />
  //         <Route path="/contacts/:contactId" element={<Contact />} />
  //         <Route path="/add-contact" element={<AddContact />} />
  //       </Route>
  //     ) : (
  //       <Route path="/" element={<Login />} />
  //     )}
  //   </Routes>
  // );
}

export default App;
