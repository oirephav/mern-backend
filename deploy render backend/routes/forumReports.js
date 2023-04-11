import express from "express";

import {
  getPendingForumReports,
  getReviewedForumReports,
  submitForumContentReport,
  removeReportedTopic,
  removeReportedPost,
  ignoreReportedContent,
  deleteForumReport,
} from "../controllers/forumReports.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/pending", getPendingForumReports);
router.get("/reviewed", getReviewedForumReports);
router.post("/:reportedContentId", auth, submitForumContentReport);
router.patch("/:id/removeTopic", auth, removeReportedTopic);
router.patch("/:id/removePost", auth, removeReportedPost);
router.patch("/:id/ignore", auth, ignoreReportedContent);
router.delete("/:id", auth, deleteForumReport);

export default router;
