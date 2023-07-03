const express = require("express");
const {
  getSpeaker,
  getSpeakers,
  addSpeaker,
  deleteSpeaker,
} = require("../controllers/Speakers");

const router = express.Router();

router.route("/").get(getSpeakers).post(addSpeaker);
router.route("/:speakerId").delete(deleteSpeaker);

// router.route("/:speakerId").get(getSpeaker);

module.exports = router;
