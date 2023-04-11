import express from "express";
import {
  getCafeReviews,
  createCafeReview,
  updateCafeReview,
  deleteCafeReview,
} from "../controllers/cafeReviews.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.get("/:cafeId", getCafeReviews);
router.post("/:cafeId", auth, createCafeReview);
router.patch("/:cafeId/review/:reviewId", auth, updateCafeReview);
router.delete("/:cafeId/review/:cafeReviewId", auth, deleteCafeReview);

export default router;