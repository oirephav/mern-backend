import mongoose from "mongoose";

const topicSchema = mongoose.Schema({
  title: { type: String },
  message: { type: String },
  username: { type: String },
  userId: { type: String },
  createdAt: { type: Date, default: new Date() },
  reporterList: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  category: { type: String, default: "" },
});

export default mongoose.model("Topic", topicSchema);