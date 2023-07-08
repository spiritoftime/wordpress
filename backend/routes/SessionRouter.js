const express = require("express");
const {
  addSession,
  getSessions,
  EditSession,
  DeleteSession,
  getSession,
} = require("../controllers/Sessions");
const router = express.Router();
router.route("/").get(getSessions).post(addSession);
router
  .route("/:sessionId")
  .get(getSession)
  .patch(EditSession)
  .delete(DeleteSession);
module.exports = router;
