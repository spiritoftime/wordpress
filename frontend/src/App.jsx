import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { AlertDialogDemo } from "./components/AlertDialog";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();

  return <AlertDialogDemo></AlertDialogDemo>;
}

export default App;
