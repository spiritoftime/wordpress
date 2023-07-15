const express = require("express");
const { getConferenceRooms } = require("../controllers/Rooms");
const router = express.Router();
router.route("/:conferenceId").get(getConferenceRooms);

module.exports = router;
