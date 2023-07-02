import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./context/appContext.jsx";
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Auth0Provider
            domain={import.meta.env.VITE_DOMAIN}
            clientId={import.meta.env.VITE_CLIENT_ID}
            authorizationParams={{
              redirect_uri: window.location.origin,
              audience: import.meta.env.VITE_AUDIENCE,
              scope:
                "openid profile email read:current_user update:current_user_metadata",
            }}
          >
            <App />
          </Auth0Provider>
        </BrowserRouter>
      </QueryClientProvider>
    </AppProvider>
  </React.StrictMode>
);
