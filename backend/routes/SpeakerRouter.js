const express = require("express");
const {
  getSpeaker,
  getSpeakers,
  getSpeakerForConference,
  getSpeakersForConference,
  getContactsForAdding,
  getTotalSpeakers,
  getSchedule,
  addSpeaker,
  addSpeakersToConference,
  deleteSpeaker,
  updateSpeaker,
  removeSpeakerFromConference,
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
router.route("/speakers-count/:conferenceId").get(getTotalSpeakers);
router.route("/input/:conferenceId").get(getContactsForAdding);
router
  .route("/conference/:speakerId/:conferenceId/")
  .get(getSchedule)
  .delete(removeSpeakerFromConference);
// router
//   .route("/conference/:speakerId/:conferenceId/")
//   .get(getSpeakerForConference)
//   .delete(removeSpeakerFromConference);

// router.route("/schedule/:speakerId/:conferenceId/").get(getSchedule);

module.exports = router;
