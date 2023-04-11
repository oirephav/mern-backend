import express from "express";
import {
  getClubReviews,
  createClubReview,
  updateClubReview,
  deleteClubReview,
} from "../controllers/clubReviews.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/:clubId", getClubReviews);
router.post("/:clubId", auth, createClubReview);
router.patch("/:clubId/review/:reviewId", auth, updateClubReview);
router.delete("/:clubId/review/:clubReviewId", auth, deleteClubReview);

export default router;
