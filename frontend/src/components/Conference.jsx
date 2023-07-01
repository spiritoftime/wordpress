import { useQuery, useQueryClient } from "@tanstack/react-query";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { getConferences } from "../services/conferences";
import { useState } from "react";
import { NormalComboBox } from "./NormalComboBox";
import { useLocation } from "react-router-dom";

const Conference = () => {
  const location = useLocation();
  const [comboBoxValue, setComboBoxValue] = useState(location.state);
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
    <div className="flex flex-col w-full p-12">
      {!isConferenceFetching && (
        <NormalComboBox
          options={conferences}
          validateProperty={"name"}
          displayProperty={"name"}
          fieldName={"conference"}
          value={comboBoxValue}
          setValue={setComboBoxValue}
        />
      )}
      <h1 className="text-4xl font-bold">{comboBoxValue}</h1>
      <div className="flex w-full gap-6">
        <div className="w-full flex p-6 border-[#EAECF0] flex-col gap-6  shadow-md">
          <h2 className="text-2xl font-medium">Total speakers</h2>
          <h3 className="text-4xl font-semibold">120</h3>
        </div>
        <div className="w-full flex p-6 border-[#EAECF0] flex-col gap-6  shadow-md">
          <h2 className="text-2xl font-medium">Total Symposia</h2>
          <h3 className="text-4xl font-semibold">120</h3>
        </div>
        <div className="w-full flex p-6 border-[#EAECF0] flex-col gap-6  shadow-md">
          <h2 className="text-2xl font-medium">Total Masterclasses</h2>
          <h3 className="text-4xl font-semibold">120</h3>
        </div>
      </div>
    </div>
  );
};

export default Conference;
