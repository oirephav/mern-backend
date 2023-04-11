import mongoose from "mongoose";

const cafeReviewSchema = mongoose.Schema({
  cafeId: { type: String },
  title: { type: String },
  description: { type: String },
  userId: { type: String },
  username: { type: String },
  createdAt: { type: Date, default: new Date() },
  rating: { type: Number, default: 0 },
});

export default mongoose.model("CafeReview", cafeReviewSchema);
