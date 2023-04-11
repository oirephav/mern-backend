import express from "express";
import {
  getCourseReviews,
  createCourseReview,
  updateCourseReview,
  deleteCourseReview,
} from "../controllers/courseReviews.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:courseId", getCourseReviews);
router.post("/:courseId", auth, createCourseReview);
router.patch("/:courseId/review/:reviewId", auth, updateCourseReview);
router.delete("/:courseId/review/:reviewId", auth, deleteCourseReview);

export default router;