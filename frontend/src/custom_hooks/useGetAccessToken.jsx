import { useAuth0 } from "@auth0/auth0-react";

const useGetAccessToken = () => {
  const { getAccessTokenSilently } = useAuth0();

  return () =>
    getAccessTokenSilently({
      authorizationParams: {
        audience: import.meta.env.VITE_AUDIENCE,
        scope: "read:current_user",
      },
    });
};

export default useGetAccessToken;
