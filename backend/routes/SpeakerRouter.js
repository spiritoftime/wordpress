const express = require("express");
const {
  getSpeaker,
  getSpeakers,
  addSpeaker,
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

module.exports = router;
