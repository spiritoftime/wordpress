import React, { useEffect } from "react";
import { RowActions } from "./RowActions";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Toaster } from "./ui/toaster";

import { DataTable } from "./DataTable";
import { RowCheckBox } from "./RowCheckBox";
import { SortableHeader } from "./SortableHeader";
import PageHeader from "./PageHeader";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { deleteConference, getConferences } from "../services/conferences";
import Loading from "./Loading";
import { useAppContext } from "../context/appContext";

const Conferences = ({ setNewComboBoxValue }) => {
  const navigate = useNavigate();
  const getAccessToken = useGetAccessToken();
  const queryClient = useQueryClient();
  const { setConference } = useAppContext();

  const {
    data: conferences,
    isLoading: isConferenceFetching,
    isFetching: isConferenceRefetching,
  } = useQuery({
    queryKey: ["conferences"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getConferences(accessToken);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });

  const { mutate: deleteConferenceMutation } = useMutation({
    mutationFn: async ({ rowData }) => {
      const accessToken = await getAccessToken();
      return deleteConference(rowData.id, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["conferences"], { exact: true });
    },
  });

  const columns = [
    RowCheckBox,
    {
      accessorKey: "name",
      header: ({ column }) => (
        <SortableHeader column={column} title="Conference Name" />
      ),
    },
    {
      accessorKey: "venue",
      header: "Venue",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
    },
    {
      accessorKey: "endDate",
      header: "End Date",
    },
    RowActions("Conference", deleteConferenceMutation),
  ];

  // Use isConferenceRefetching to show loading screen when refetching
  if (isConferenceFetching || isConferenceRefetching)
    return (
      <div className="w-full mx-auto">
        <Loading />
      </div>
    );

  const rowNavigate = (rowId) => navigate(`/conferences/${rowId}`);
  return (
    <>
      <div className="container py-10 mx-auto">
        <PageHeader
          rowType="Conferences"
          handleClick={() => navigate("/add-conference")}
          hasButton={true}
        />
        <DataTable
          columns={columns}
          data={conferences}
          rowType={"conferences"}
          filterColumn={"name"}
          rowNavigate={rowNavigate}
          setData={setConference}
          // setNewComboBoxValue={setNewComboBoxValue}
        />
      </div>
      <Toaster />
    </>
  );
};

export default Conferences;
