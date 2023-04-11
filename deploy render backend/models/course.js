import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
    courseCode: { type: String },
    title: { type: String },
    description: { type: String },
    faculty: { type: String, default: "" },
    image: { type: String, default: "" },
    avgOverallRating: {type: Number},
    avgDeliveryRating: {type: Number},
    avgDifficultyRating: {type: Number},
    avgEnjoymentRating: {type: Number},
});

export default mongoose.model("Course", courseSchema);