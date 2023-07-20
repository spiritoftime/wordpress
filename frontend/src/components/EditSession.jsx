import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { formSchemas } from "../utils/multiPageFormZod";
import { zodResolver } from "@hookform/resolvers/zod";
import AddSessionPageOne from "./AddSessionPageOne";
import { Form } from "./ui/form";
import PageHeader from "./PageHeader";
import { Button } from "./ui/button";
import TopicFieldArray from "./TopicFieldArray";
import useGetAccessToken from "../custom_hooks/useGetAccessToken";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "../services/sessions";

const EditSession = () => {
  const { conferenceId, sessionId } = useParams();
  const getAccessToken = useGetAccessToken();
  const {
    data: session,
    isLoading: isSessionLoading,
    isFetching: isSessionFetching,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const accessToken = await getAccessToken();
      return getSession(accessToken, conferenceId, sessionId);
    },
    refetchOnWindowFocus: false, // it is not necessary to keep refetching
  });
  console.log("session", session);
  const FormSchema = formSchemas[2];

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      synopsis: "",
      startTime: "",
      endTime: "",
      sessionCode: "",
      location: "",
      isPublish: false,
      presentationDuration: 0,
      discussionDuration: 0,
      // sessionType: "Symposia",
      speakers: [{}],
      // topics: [{}],
    },
    mode: "onChange",
  });
  useEffect(() => {
    if (session) {
      form.reset({
        title: session.title,
        synopsis: session.synopsis,
        startTime: session.startTime,
        endTime: session.endTime,
        sessionCode: session.sessionCode,
        location: session.Room.room,
        presentationDuration: session.presentationDuration,
        discussionDuration: session.discussionDuration,
        isPublish: session.wordpressUrl ? true : false,
        date: new Date(session.date),
      });
      const moderators = session.Speakers.map(
        ({ SessionSpeaker: { role }, fullName }) => {
          return {
            value: fullName,
            label: fullName,
            role: role,
          };
        }
      );
      replace([...moderators]);
      // const rooms = conference.Rooms.map((room) => {
      //   console.log("room", room);
      //   room.roomId = room.id;
      //   return room;
      // });
      // replace([...rooms]);
    }
  }, [session]);

  const {
    control,
    watch,
    getValues,
    unregister,
    formState: { errors, isValid },
  } = form;
  const {
    fields: moderators,
    append: appendModerators,
    remove: removeModerators,
    replace,
  } = useFieldArray({
    control,
    name: "speakers",
  });
  // console.log("control", control);
  // const onSubmit = (data) => {
  //   console.log("data", data);
  //   addToDatabase(data);
  // };
  // const {
  //   fields: moderators,
  //   append,
  //   replace: replaceModerators,
  //   remove,
  // } = useFieldArray({
  //   control,
  //   name: "speakers",
  // });
  return (
    <div className="flex flex-col w-full p-8">
      <PageHeader rowType="Edit Session" hasButton={false} />
      <Form {...form}>
        <AddSessionPageOne
          moderators={moderators}
          append={appendModerators}
          remove={removeModerators}
          control={control}
        />
        <div>
          <Button
            onClick={() => {}}
            type="button"
            className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF]"
          >
            Allocate Time
          </Button>
          <TopicFieldArray fields={[]} control={control} />
        </div>
      </Form>
    </div>
  );
};

export default EditSession;
