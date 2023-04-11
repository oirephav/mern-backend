import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  topicId: { type: String },
  message: { type: String },
  username: { type: String },
  userId: { type: String },
  reporterList: { type: [String], default: [] },
  createdAt: { type: Date, default: new Date() },
});

export default mongoose.model("Post", postSchema);
