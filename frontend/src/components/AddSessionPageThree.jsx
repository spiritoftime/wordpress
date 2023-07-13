import React, { useEffect, useState } from "react";
import AddSessionPageOne from "./AddSessionPageOne";
import { Button } from "./ui/button";
import TopicFieldArray from "./TopicFieldArray";
import { useFieldArray } from "react-hook-form";
import { useAppContext } from "../context/appContext";
import { allocateTime } from "../utils/allocateTime";

const AddSessionPageThree = ({ control, getValues }) => {
  const {
    fields: topicDetails,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "topics",
  });
  const { selectedTopics } = useAppContext();
  const [isAllocated, setIsAllocated] = useState(false);
  console.log("selected topics", selectedTopics);
  useEffect(() => {
    let appendTopics = [];
    selectedTopics.forEach((topic, index) => {
      const appendTopic = {};
      appendTopic[`topic`] = topic.title;
      // if only one speaker in the row selected
      if (typeof topic.speaker === "string") {
        appendTopic[`speakers`] = [
          { value: topic.speaker, label: topic.speaker },
        ];
      } else if (Array.isArray(topic.speaker)) {
        const speakers = [];
        topic.speaker.forEach((speaker) => {
          speakers.push({ value: speaker, label: speaker });
        });
        appendTopic[`speakers`] = [...topic.speaker];
      }
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
    remove(0);
    append(appendTopics);
  }, [isAllocated]);
  return (
    <div className="flex flex-col gap-6">
      <AddSessionPageOne control={control} />
      <div>
        <Button
          onClick={() => {
            // update the fields and reallocate time
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
