import { useQuery, useQueryClient } from "@tanstack/react-query";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { getConferences } from "../services/conferences";
import { useState } from "react";
import { NormalComboBox } from "./NormalComboBox";

const Conference = () => {
  const getAccessToken = useGetAccessToken();

  const { data: conferences, isLoading: isConferenceFetching } = useQuery({
    queryKey: ["conferences"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getConferences(accessToken);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });
  return (
    <div className="flex flex-col">
      <NormalComboBox
        options={conferences}
        validateProperty={"name"}
        displayProperty={"name"}
        fieldName={"conference"}
      />
    </div>
  );
};

export default Conference;
