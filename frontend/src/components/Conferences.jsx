import React, { useEffect } from "react";
import { RowActions } from "./RowActions";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

import { DataTable } from "./DataTable";
import { RowCheckBox } from "./RowCheckBox";
import { SortableHeader } from "./SortableHeader";
import PageHeader from "./PageHeader";
const columns = [
  RowCheckBox,
  {
    accessorKey: "conferenceName",
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
  RowActions("Conference"),
];
const Conferences = () => {
  const navigate = useNavigate();

  const data = [
    {
      id: "728ed52f",
      conferenceName: "APACRS 2023",
      venue: "Singapore",
      startDate: "2023-07-01",
      endDate: "2023-07-03",
    },
    // ...
  ];

  return (
    <div className="container py-10 mx-auto">
      <PageHeader
        rowType="Conference"
        handleClick={() => navigate("/add-conference")}
        hasButton={true}
      />
      <DataTable
        columns={columns}
        data={data}
        rowType={"conferences"}
        filterColumn={"conferenceName"}
      />
    </div>
  );
};

export default Conferences;
