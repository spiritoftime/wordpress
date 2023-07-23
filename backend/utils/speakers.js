/**
 * Function to retrieve all speakers to update when creating a session
 * @param {array} speakers
 * @param {array} topics
 * @returns {array} an array of speakers to update
 */
function getSpeakersToUpdate(speakers, topics) {
  const speakersToUpdate = [];

  console.log("At getSpeakersToUpdate");

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

  return speakersToUpdate;
}

module.exports = {
  getSpeakersToUpdate,
};
