import mongoose from "mongoose";

const courseReviewSchema = mongoose.Schema({
  courseId: { type: String },
  semester: { type: String },
  year: { type: String },
  title: { type: String },
  description: { type: String },
  userId: { type: String },
  username: { type: String },
  createdAt: { type: Date, default: new Date() },
  overallRating: { type: Number, default: 0 },
  deliveryRating: { type: Number, default: 0 },
  difficultyRating: { type: Number, default: 0 },
  enjoymentRating: { type: Number, default: 0 },
});

export default mongoose.model("CourseReview", courseReviewSchema);
