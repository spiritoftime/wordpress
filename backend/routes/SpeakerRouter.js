const express = require("express");
const {
  getSpeaker,
  getSpeakers,
  addSpeaker,
} = require("../controllers/Speakers");

const router = express.Router();

router.route("/").post(addSpeaker);

// router.route("/").get(getSpeakers).post(addSpeaker);

// router.route("/:speakerId").get(getSpeaker);

module.exports = router;
