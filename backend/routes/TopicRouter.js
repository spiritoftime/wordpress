const express = require("express");
const {
  addOrUpdateTopic,
  getTopicsForAddingToSession,
} = require("../controllers/Topics");

const router = express.Router();
router.route("/:conferenceId").get(getTopicsForAddingToSession);
router.route("/update/:speakerId/:conferenceId").put(addOrUpdateTopic);

module.exports = router;
