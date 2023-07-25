/**
 * Function to retrieve all speakers to update when creating a session
 * @param {array} speakers
 * @param {array} topics
 * @returns {array} an array of speakers to update
 */
function getSpeakersToUpdate(speakers, topics) {
  const speakersToUpdate = [];

  // Used to check if speaker already exist in speakersToUpdate array
  const checkForDuplicates = {};

  // Add moderators into speakersToUpdate
  for (let i = 0; i < speakers.length; i++) {
    const speakersForARole = speakers[i].speaker;
    for (let j = 0; j < speakersForARole.length; j++) {
      const speaker = speakersForARole[j];

      if (!checkForDuplicates[speaker.id]) {
        speakersToUpdate.push({
          speakerId: speaker.id,
          speakerPostId: speaker.speakerPostId,
          speakerLink: speaker.speakerLink,
        });
        checkForDuplicates[speaker.id] = true;
      }
    }
  }

  // Add topic speakers into speakersToUpdate
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    for (let j = 0; j < topic.speakers.length; j++) {
      const speaker = topic.speakers[j];

      if (!checkForDuplicates[speaker.id]) {
        speakersToUpdate.push({
          speakerId: speaker.id,
          speakerPostId: speaker.speakerPostId,
          speakerLink: speaker.speakerLink,
        });
        checkForDuplicates[speaker.id] = true;
      }
    }
  }

  // console.log("speakersToUpdate in speakerToUpdate", speakersToUpdate);

  return speakersToUpdate;
}

function generateSpeakersForSession(speakers, topics) {
  const speakersForSession = [];

  // console.log("speakers", speakers);
  // console.log("topics", topics);

  // Used to check if speaker already exist in speakersToUpdate array
  const checkForDuplicates = {};

  // Add moderators into speakersForSession
  for (let i = 0; i < speakers.length; i++) {
    const speaker = speakers[i];
    if (!checkForDuplicates[speaker.id]) {
      speakersForSession.push({
        speakerId: speaker.id,
        speakerPostId: speaker.Conferences[0].ConferenceSpeaker.speakerPostId,
        speakerLink: speaker.Conferences[0].ConferenceSpeaker.speakerLink,
      });
      checkForDuplicates[speaker.id] = true;
    }
  }

  // Add topic speakers into speakersForSession
  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    for (let j = 0; j < topic.Speakers.length; j++) {
      const speaker = topic.Speakers[j];

      if (!checkForDuplicates[speaker.id]) {
        speakersForSession.push({
          speakerId: speaker.id,
          speakerPostId: speaker.Conferences[0].ConferenceSpeaker.speakerPostId,
          speakerLink: speaker.Conferences[0].ConferenceSpeaker.speakerLink,
        });
        checkForDuplicates[speaker.id] = true;
      }
    }
  }

  return speakersForSession;
}

function removeDuplicates(speakers) {
  const speakerIds = speakers.map(({ speakerId }) => speakerId);
  console.log("speaker Ids", speakerIds);

  const uniqueSpeakers = speakers.filter(
    ({ speakerId }, index) => !speakerIds.includes(speakerId, index + 1)
  );
  // console.log("Unique Speakers", uniqueSpeakers);
  return uniqueSpeakers;
}

module.exports = {
  getSpeakersToUpdate,
  generateSpeakersForSession,
  removeDuplicates,
};
