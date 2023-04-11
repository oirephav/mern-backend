import mongoose from "mongoose";

const forumReportSchema = mongoose.Schema({
  authorId: { type: String },
  contentType: { type: String },
  reportedContentId: { type: String },
  reportedContent: { type: String },
  reportedContentUrl: { type: String },
  reportRemark: { type: String },
  reporterList: { type: [String], default: [] },
  createdAt: { type: Date, default: new Date() },
  reviewStatus: { type: String, default: "pending" },
  reviewRemark: { type: String, default: "" },
  reviewDate: { type: Date, default: undefined },
});

export default mongoose.model("ForumReport", forumReportSchema);
