const express = require("express");
const {
  addSession,
  getSessions,
  EditSession,
  DeleteSession,
  getSession,
  updateProgramOverview,
} = require("../controllers/Sessions");
const router = express.Router();

router.route("/conference/:conferenceId").get(getSessions).post(addSession);

router
  .route("/conference/:sessionId/:conferenceId")
  .get(getSession)
  .patch(EditSession)
  .delete(DeleteSession);

router.route("/program-overview").post(updateProgramOverview);

module.exports = router;
