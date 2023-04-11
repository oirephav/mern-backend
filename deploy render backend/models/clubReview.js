import mongoose from "mongoose";

const clubReviewSchema = mongoose.Schema({
  clubId: { type: String },
  description: { type: String },
  userId: { type: String },
  username: { type: String },
  createdAt: { type: Date, default: new Date() },
  rating: { type: Number, default: 0 },
});

export default mongoose.model("ClubReview", clubReviewSchema);
