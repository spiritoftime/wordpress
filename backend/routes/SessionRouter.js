const express = require("express");
const {
  addSession,
  getSessions,
  EditSession,
  deleteSession,
  getSession,
  updateProgramOverview,
  getTotalSymposia,
  getTotalMasterclass,
} = require("../controllers/Sessions");
const router = express.Router();

router.route("/conference/:conferenceId").get(getSessions).post(addSession);

router
  .route("/conference/:sessionId/:conferenceId")
  .get(getSession)
  .patch(EditSession)
  .delete(deleteSession);

router.route("/program-overview").post(updateProgramOverview);

router.route("/symposia-count/:conferenceId").get(getTotalSymposia);
router.route("/masterclass-count/:conferenceId").get(getTotalMasterclass);

module.exports = router;
