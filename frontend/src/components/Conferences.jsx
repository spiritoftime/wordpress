import React, { useEffect } from "react";
import { RowActions } from "./RowActions";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./DataTable";
import { RowCheckBox } from "./RowCheckBox";
import { SortableHeader } from "./SortableHeader";
import PageHeader from "./PageHeader";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { getConferences } from "../services/conferences";
import Loading from "./Loading";
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
  RowActions("Conference"),
];
const Conferences = () => {
  const getAccessToken = useGetAccessToken();
  const queryClient = useQueryClient();

  const { data: conferences, isLoading: isConferenceFetching } = useQuery({
    queryKey: ["conferences"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getConferences(accessToken);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });
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
  if (isConferenceFetching)
    return (
      <div className="w-full mx-auto">
        <Loading />
      </div>
    );
  console.log(conferences);
  return (
    <div className="container py-10 mx-auto">
      <PageHeader rowType="Conference" />
      <DataTable
        columns={columns}
        data={conferences}
        rowType={"conferences"}
        filterColumn={"conferenceName"}
      />
    </div>
  );
};

export default Conferences;
