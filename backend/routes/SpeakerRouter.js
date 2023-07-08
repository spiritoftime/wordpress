const express = require("express");
const {
  getSpeaker,
  getSpeakers,
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

module.exports = router;
