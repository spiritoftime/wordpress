import React, { useEffect, useState } from "react";
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
import { allocateTime } from "../utils/allocateTime";

const EditSession = () => {
  const { conferenceId, sessionId } = useParams();
  const [isAllocated, setIsAllocated] = useState(false);
  const [topicsToAppend, setTopicsToAppend] = useState([]);
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
  function combineSpeakersByRole(moderators) {
    const speakerMap = {};

    moderators.forEach((moderator) => {
      const speakerRole = moderator.SessionSpeaker.role;

      if (!speakerMap[speakerRole]) {
        speakerMap[speakerRole] = {
          speakerRole,
          speaker: [
            {
              id: moderator.id,
              value: moderator.fullName,
              label: moderator.fullName,
            },
          ],
        };
      } else {
        speakerMap[speakerRole].speaker.push({
          id: moderator.id,
          value: moderator.fullName,
          label: moderator.fullName,
        });
      }
    });

    return Object.values(speakerMap);
  }
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      synopsis: "",
      startTime: "",
      endTime: "",
      sessionCode: "",
      isPublish: false,
      presentationDuration: 0,
      discussionDuration: 0,

      speakers: [{}],
      // topics: [{}],
    },
    mode: "onChange",
  });
  useEffect(() => {
    if (session && Object.keys(session).length > 0) {

      form.reset({
        title: session.title,
        synopsis: session.synopsis,
        startTime: session.startTime.substring(0, 5),
        endTime: session.endTime.substring(0, 5),
        sessionType: session.sessionType,
        sessionCode: session.sessionCode,
        location: session.Room.room,
        presentationDuration: session.presentationDuration,
        discussionDuration: session.discussionDuration,
        isPublish: session.wordpressUrl ? true : false,
        date: new Date(session.date),
      });
      const moderators = session.Speakers;
      const combinedSpeakers = combineSpeakersByRole(moderators);
      replaceSpeakers(combinedSpeakers);
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
    replace: replaceSpeakers,
  } = useFieldArray({
    control,
    name: "speakers",
  });
  const {
    fields: topicDetails,
    append: appendTopics,
    remove: removeTopics,
    update: updateTopics,
    replace: replaceTopics,
  } = useFieldArray({
    control,
    name: "topics",
  });
  // console.log("control", control);
  const onSubmit = (data) => {
    console.log("data", data);
    // addToDatabase(data);
  };
  // console.log(errors, "errors");
  // console.log(isValid, "valid");
  return (
    <div className="flex flex-col w-full p-8">
      <PageHeader rowType="Edit Session" hasButton={false} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AddSessionPageOne
            moderators={moderators}
            append={appendModerators}
            remove={removeModerators}
            control={control}
          />
          <div>
            <Button
              onClick={() => {
                let appendTopics = [];
                if (!isAllocated) {
                  session.Topics.forEach((topic, index) => {
                    console.log("topicaaaaa", topic);
                    const appendTopic = {};
                    appendTopic[`topic`] = topic.title;
                    // if only one speaker in the row selected
                    if (typeof topic.Speakers === "string") {
                      appendTopic[`speakers`] = [
                        {
                          value: topic.Speakers.fullName,
                          label: topic.Speakers.fullName,
                        },
                      ];
                    } else if (Array.isArray(topic.Speakers)) {
                      const speakers = [];
                      const speakersId = [];
                      topic.Speakers.forEach((speaker) => {
                        speakers.push({
                          value: speaker.fullName,
                          label: speaker.fullName,
                        });
                        speakersId.push(speaker.id);
                      });
                      appendTopic[`speakers`] = [...speakers];
                      appendTopic[`id`] = [...speakersId];
                    }
                    appendTopic[`topicId`] = topic.id;

                    appendTopics.push(appendTopic);
                  });
                  const presentationDuration = +getValues(
                    "presentationDuration"
                  );
                  const discussionDuration = +getValues("discussionDuration");
                  const startTime = getValues("startTime");
                  appendTopics = allocateTime(
                    appendTopics,
                    startTime,
                    presentationDuration,
                    discussionDuration
                  );
                  setIsAllocated(true);
                  setTopicsToAppend(appendTopics);
                  replaceTopics(appendTopics);
                } else {
                  const presentationDuration = +getValues(
                    "presentationDuration"
                  );
                  const discussionDuration = +getValues("discussionDuration");
                  const startTime = getValues("startTime");
                  appendTopics = allocateTime(
                    topicsToAppend,
                    startTime,
                    presentationDuration,
                    discussionDuration
                  );
                  // console.log("append topics", appendTopics);
                  for (const [i, topic] of appendTopics.entries())
                    updateTopics(i, topic);
                }
              }}
              type="button"
              className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF]"
            >
              Allocate Time
            </Button>
            <TopicFieldArray fields={topicDetails} control={control} />
          </div>
          <div className="flex gap-2 mx-auto w-fit">
            <Button
              disabled={!isValid}
              type="submit"
              className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF]"
            >
              Save
            </Button>

            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </div>
  );
};

export default EditSession;
