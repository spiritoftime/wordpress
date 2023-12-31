import React, { useEffect, useState } from "react";
import AddSessionPageOne from "./AddSessionPageOne";
import { Button } from "./ui/button";
import TopicFieldArray from "./TopicFieldArray";
import { useFieldArray } from "react-hook-form";
import { useAppContext } from "../context/appContext";
import { allocateTime } from "../utils/allocateTime";

const AddSessionPageThree = ({
  control,
  getValues,
  moderators,
  append: appendMods,
  remove: removeMods,
}) => {
  const {
    fields: topicDetails,
    append,
    remove,
    update,
  } = useFieldArray({
    control,
    name: "topics",
  });
  const { selectedTopics } = useAppContext();
  // console.log("selectedTopics", selectedTopics);
  const [isAllocated, setIsAllocated] = useState(false);
  const [topicsToAppend, setTopicsToAppend] = useState([]);

  return (
    <div className="flex flex-col gap-6">
      <AddSessionPageOne
        moderators={moderators}
        append={appendMods}
        remove={removeMods}
        control={control}
      />
      <div>
        <Button
          onClick={() => {
            let appendTopics = [];
            if (!isAllocated) {
              selectedTopics.forEach((topic, index) => {
                console.log("topicaaaaa", topic);
                const appendTopic = {};
                appendTopic[`topic`] = topic.title;
                // if only one speaker in the row selected
                if (typeof topic.speaker === "string") {
                  appendTopic[`speakers`] = [
                    {
                      value: topic.speaker,
                      label: topic.speaker,
                      topicId: topic.id,
                    },
                  ];
                } else if (Array.isArray(topic.speaker)) {
                  const speakers = [];
                  topic.speaker.forEach((speaker) => {
                    speakers.push({
                      value: speaker,
                      label: speaker,
                      id: topic.speakersId[0],
                      speakerPostId: topic.speakerPostId[0],
                      speakerLink: topic.speakerLink[0],
                    });
                  });
                  appendTopic[`speakers`] = [...speakers];
                  appendTopic[`id`] = [...topic.speakersId];
                }
                appendTopic[`topicId`] = topic.topicId;

                appendTopics.push(appendTopic);
              });
              const presentationDuration = +getValues("presentationDuration");
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
              append(appendTopics);
            } else {
              const presentationDuration = +getValues("presentationDuration");
              const discussionDuration = +getValues("discussionDuration");
              const startTime = getValues("startTime");
              appendTopics = allocateTime(
                topicsToAppend,
                startTime,
                presentationDuration,
                discussionDuration
              );
              // console.log("append topics", appendTopics);
              for (const [i, topic] of appendTopics.entries()) update(i, topic);
            }
          }}
          type="button"
          className="bg-[#0D05F2] text-white font-semibold hover:bg-[#3D35FF]"
        >
          Allocate Time
        </Button>
        <TopicFieldArray fields={topicDetails} control={control} />
      </div>
    </div>
  );
};

export default AddSessionPageThree;
