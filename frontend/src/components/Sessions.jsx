import React from "react";
import PageHeader from "./PageHeader";
import { DataTable } from "./DataTable";
import { Toaster } from "./ui/toaster";
import { useNavigate } from "react-router-dom";
import { SortableHeader } from "./SortableHeader";
import { RowCheckBox } from "./RowCheckBox";
import { RowActions } from "./RowActions";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { useQuery } from "@tanstack/react-query";
import { getSessions } from "../services/sessions";
import Loading from "./Loading";
import { useAppContext } from "../context/appContext";

const Sessions = () => {
  const { setSession } = useAppContext();
  const getAccessToken = useGetAccessToken();
  const {
    data: sessions,
    isLoading: isSessionsLoading,
    isFetching: isSessionsFetching,
  } = useQuery({
    queryKey: ["conferences"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getSessions(accessToken);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });
  const conferenceId = 1;
  const navigate = useNavigate();
  const deleteSessionMutation = () => {};

  const columns = [
    RowCheckBox,
    {
      accessorKey: "title",
      header: ({ column }) => (
        <SortableHeader column={column} title="Session Name" />
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const amount = row.getValue("date");
        const formatted = amount.split("T")[0];

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
    },
    {
      accessorKey: "endTime",
      header: "End Time",
    },
    RowActions("Session", deleteSessionMutation),
  ];
  const rowNavigate = (rowId) => navigate(`/sessions/${rowId}`);
  if (isSessionsFetching || isSessionsLoading)
    return (
      <div className="w-full mx-auto">
        <Loading />
      </div>
    );
  return (
    <>
      <div className="container py-10 mx-auto">
        <PageHeader
          rowType="Sessions"
          handleClick={() => navigate(`/add-session`)}
          hasButton={true}
        />
        <DataTable
          columns={columns}
          data={sessions}
          rowType={"sessions"}
          filterColumn={"title"}
          rowNavigate={rowNavigate}
          setData={setSession}
          clickable={true}
        />
      </div>
      <Toaster />
    </>
  );
};

export default Sessions;
