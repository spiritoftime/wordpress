import { useEffect } from "react";
import { RowActions } from "./RowActions";
import { useAppContext } from "../context/appContext";
import { getSpeakers } from "../services/contacts";

import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster } from "./ui/toaster";

import { DataTable } from "./DataTable";
import { RowCheckBox } from "./RowCheckBox";
import { SortableHeader } from "./SortableHeader";
import PageHeader from "./PageHeader";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { deleteContact } from "../services/contacts";
import Loading from "./Loading";

const Speakers = () => {
  const navigate = useNavigate();
  const getAccessToken = useGetAccessToken();
  const queryClient = useQueryClient();
  const { setSpeaker } = useAppContext();
  const { conferenceId } = useParams();

  const {
    data: speakers,
    isLoading: isSpeakersLoading,
    isFetching: isSpeakersFetching,
  } = useQuery({
    queryKey: ["speakers", conferenceId], // Refetch when there is a change in conferenceId
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getSpeakers(accessToken, conferenceId);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
    cacheTime: 0, // Disable cache
  });

  const { mutate: deleteContactMutation, isLoading: isDeleting } = useMutation({
    mutationFn: async ({ rowData }) => {
      const accessToken = await getAccessToken();
      return deleteContact(rowData, accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"], { exact: true });
    },
  });

  const columns = [
    // RowCheckBox,
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <SortableHeader column={column} title="First Name" />
      ),
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "organisation",
      header: "Organisation",
    },
    RowActions("Contact", deleteContactMutation),
  ];

  // console.log(speakers);

  // Use isSpeakersFetching to show loading screen when refetching
  if (isSpeakersLoading || isSpeakersFetching || isDeleting) {
    return (
      <div className="w-full mx-auto">
        <Loading />
      </div>
    );
  }

  const rowNavigate = (rowId) =>
    navigate(`/conferences/speakers/${conferenceId}/${rowId}`);

  return (
    <>
      <div className="container py-10 mx-auto">
        <PageHeader
          rowType="Speakers"
          handleClick={() =>
            navigate(`/conferences/speakers/add-speakers/${conferenceId}`)
          }
          hasButton={true}
        />
        <DataTable
          columns={columns}
          data={speakers}
          rowType={"Speakers"}
          filterColumn={"lastName"}
          rowNavigate={rowNavigate}
          setData={setSpeaker}
          clickable={true}
        />
      </div>
      <Toaster />
    </>
  );
};

export default Speakers;
