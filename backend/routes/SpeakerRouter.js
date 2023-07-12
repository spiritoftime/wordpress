const express = require("express");
const {
  getSpeaker,
  getSpeakers,
  getSpeakerForConference,
  getSpeakersForConference,
  getContactsForAdding,
  addSpeaker,
  addSpeakersToConference,
  deleteSpeaker,
  updateSpeaker,
} = require("../controllers/Speakers");

const router = express.Router();

router.route("/").get(getSpeakers).post(addSpeaker);
router
  .route("/:speakerId")
  .delete(deleteSpeaker)
  .get(getSpeaker)
  .put(updateSpeaker);

router.route("/add-to-conference/:conferenceId").post(addSpeakersToConference);
router.route("/conference/:conferenceId").get(getSpeakersForConference);
router.route("/input/:conferenceId").get(getContactsForAdding);
router
  .route("/conference/:speakerId/:conferenceId/")
  .get(getSpeakerForConference);

module.exports = router;
