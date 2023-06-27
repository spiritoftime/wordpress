const express = require("express");
const {
  addConference,
  getConferences,
  EditConference,
  DeleteConference,
  getConference,
} = require("../controllers/Conferences");
const router = express.Router();
router.route("/").get(getConferences).post(addConference);
router
  .route("/:conferenceId")
  .get(getConference)
  .patch(EditConference)
  .delete(DeleteConference);
module.exports = router;
