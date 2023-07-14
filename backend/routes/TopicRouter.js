const express = require("express");
const { addOrUpdateTopic } = require("../controllers/Topics");

const router = express.Router();

router.route("/update/:speakerId/:conferenceId").put(addOrUpdateTopic);

module.exports = router;
