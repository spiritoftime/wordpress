import React from "react";
import PageHeader from "./PageHeader";
import { DataTable } from "./DataTable";
import { Toaster } from "./ui/toaster";
import { useNavigate } from "react-router-dom";
import { SortableHeader } from "./SortableHeader";
import { RowCheckBox } from "./RowCheckBox";
import { RowActions } from "./RowActions";

const Sessions = () => {
  const conferenceId = 1;
  const navigate = useNavigate();
  const deleteSessionMutation = () => {};
  const sessions = [];
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
  const rowNavigate = () => {};
  const setConference = () => {};
  return (
    <>
      <div className="container py-10 mx-auto">
        <PageHeader
          rowType="Sessions"
          handleClick={() => navigate(`/add-conference/${conferenceId}`)}
          hasButton={true}
        />
        <DataTable
          columns={columns}
          data={sessions}
          rowType={"sessions"}
          filterColumn={"title"}
          rowNavigate={rowNavigate}
          setData={setConference}
        />
      </div>
      <Toaster />
    </>
  );
};

export default Sessions;