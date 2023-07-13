import { addTime } from "./addTime";

export function allocateTime(
  appendTopics,
  startTime,
  presentationDuration,
  discussionDuration
) {
  for (const [i, topic] of appendTopics.entries()) {
    if (i === 0) {
      topic[`startTime`] = startTime;
      topic[`endTime`] = addTime(startTime, presentationDuration);
    } else {
      console.log("second start time", appendTopics[i - 1]);
      topic[`startTime`] = addTime(
        appendTopics[i - 1][`endTime`],
        discussionDuration
      );
      topic[`endTime`] = addTime(topic[`startTime`], presentationDuration);
    }
    // console.log(appendTopics,'appendTopics');
  }
  return appendTopics;
}
