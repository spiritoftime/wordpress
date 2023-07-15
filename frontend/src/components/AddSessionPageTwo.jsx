import React from "react";
import { DataTable } from "./DataTable";
import { SortableHeader } from "./SortableHeader";
import { RowCheckBox } from "./RowCheckBox";
import { useAppContext } from "../context/appContext";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { useQuery } from "@tanstack/react-query";
import { getTopicsForAddingToSession } from "../services/topics";

const AddSessionPageTwo = ({ control }) => {
  // const { selectedTopics } = useAppContext();
  // console.log("selectedtopics", selectedTopics);
  const getAccessToken = useGetAccessToken();
  const {
    data: topicsForAddingSession,
    isLoading: isTopicsForAddingSessionLoading,
    isFetching: isTopicsForAddingSessionFetching,
  } = useQuery({
    queryKey: ["topicsForAddingSession"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      const data = await getTopicsForAddingToSession(accessToken);
      const res = data.map((topic) => {
        const obj = {};
        obj.title = topic.title;
        obj.speaker = topic.Speakers.map((speaker) => speaker.fullName);
        obj.country = topic.Speakers.map((speaker) => speaker.country);
        obj.speakersId = topic.Speakers.map((speaker) => speaker.id);
        obj.numSessions = topic.Speakers.map(
          (speaker) => speaker.Sessions.length
        );
        return obj;
      });
      return res;
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });
  console.log(topicsForAddingSession, "topicsForAddingSession");
  // const topics = [
  //   {
  //     title: "Topic 1",
  //     speaker: "Speaker 1",
  //     country: "Country 1",
  //     numSessions: "1",
  //   },
  //   {
  //     title: "Topic 2",
  //     speaker: "Speaker 2",
  //     country: "Country 2",
  //     numSessions: "2",
  //   },
  // ];
  const columns = [
    RowCheckBox,
    {
      accessorKey: "title",
      header: ({ column }) => <SortableHeader column={column} title="Topic" />,
    },
    {
      accessorKey: "speaker",
      header: "Speaker",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      accessorKey: "numSessions",
      header: "Sessions",
    },
  ];
  return (
    <div className="flex flex-col gap-4 mt-6">
      <DataTable
        columns={columns}
        data={topicsForAddingSession}
        rowType={"Topics"}
        filterColumn={"title"}
        clickable={false}
      />
    </div>
  );
};

export default AddSessionPageTwo;
