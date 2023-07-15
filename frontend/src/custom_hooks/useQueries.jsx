import useGetAccessToken from "./useGetAccessToken";
import { getContacts } from "../services/contacts";
import { useQuery } from "@tanstack/react-query";

const useGetContacts = () => {
  const getAccessToken = useGetAccessToken();
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getContacts(accessToken);
    },

    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });
};
export default useGetContacts;
