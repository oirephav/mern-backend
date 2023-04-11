import mongoose from "mongoose";

import ForumReport from "../models/forumReport.js";
import Topic from "../models/topic.js";
import Post from "../models/post.js";

export const getPendingForumReports = async (req, res) => {
  try {
    const forumReports = await ForumReport.find({ reviewStatus: "pending" });
    res.status(200).json(forumReports);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getReviewedForumReports = async (req, res) => {
  try {
    const reviewedForumReports = await ForumReport.find({ reviewStatus: "solved" });
    res.status(200).json(reviewedForumReports);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const submitForumContentReport = async (req, res) => {
  const { reportedContentId } = req.params;
  const forumReport = req.body;
  // const { authorId, contentType, reportedContent, reportCategory } = req.body;

  //find got existing pending report with same reportedContentId, if yes increment report count
  const existingForumReports = await ForumReport.find({
    reportedContentId,
    reviewStatus: "pending",
  });
  
  if (existingForumReports.length) {
    const existingForumReport = existingForumReports[0];
    // console.log(existingForumReport);

    //check whether the user has reported before
    const index = existingForumReport.reporterList.findIndex(
      (id) => id === String(req.userId)
    );

    if (index === -1) {
      const id = existingForumReport._id;
      const currentReporterList = existingForumReport.reporterList;
      currentReporterList.push(req.userId);

      const newForumReport = await ForumReport.findByIdAndUpdate(
        id,
        { reporterList: currentReporterList },
        {
          new: true,
        }
      );

      const updatedContent = await updateReporterList(
        existingForumReport.contentType,
        existingForumReport.reportedContentId,
        currentReporterList,
      );

      res.status(200).json({ newForumReport, updatedContent });
    }
  }
  else {
    const currentReporterList = [req.userId];

    const newForumReport = new ForumReport({
      ...forumReport,
      reportedContentId,
      reporterList: currentReporterList,
      createdAt: new Date().toISOString(),
    });

    try {
      await newForumReport.save();

      const updatedContent = await updateReporterList(
        forumReport.contentType,
        reportedContentId,
        currentReporterList,
      );

      // console.log("submit report controller");
      // console.log(updatedContent);

      res.status(201).json({ newForumReport, updatedContent });
    } catch (error) {
      res.status(409).json({ message: error.message });
    }
  }
};

const updateReporterList = async (contentType, reportedContentId, currentReporterList) => {
  if (contentType === "post") {
    const updatedPost = await Post.findByIdAndUpdate(
      reportedContentId,
      { reporterList: currentReporterList },
      { new: true }
    );

    // console.log(reportedContentId);
    // console.log(currentReporterList);
    // console.log(updatedPost);

    return updatedPost;
  } else if (contentType === "topic") {
    const updatedTopic = await Topic.findByIdAndUpdate(
      reportedContentId,
      { reporterList: currentReporterList },
      { new: true }
    );

    return updatedTopic;
  }
};

export const removeReportedTopic = async (req, res) => {
  const { id } = req.params;
  const { reportedContentId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No forum report with id: ${id}`);
  }

  if (!mongoose.Types.ObjectId.isValid(reportedContentId))
    return res
      .status(404)
      .send(`No forum topic with id: ${reportedContentId}`);

  await Topic.findByIdAndDelete(reportedContentId);
  await Post.deleteMany({ topicId: reportedContentId });

  const reviewedForumReport = await ForumReport.findByIdAndUpdate(
    id,
    {
      reviewStatus: "solved",
      reviewRemark: "Removed from forum",
      reviewDate: new Date().toISOString(),
    },
    { new: true }
  );
  res.json(reviewedForumReport);
};

export const removeReportedPost = async (req, res) => {
  const { id } = req.params;
  const { reportedContentId } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(reportedContentId))
    return res
      .status(404)
      .send(`No forum post with id: ${reportedContentId}`);

  const post = await Post.findByIdAndDelete(reportedContentId);
  // console.log("post to be deleted forum report");
  // console.log(post);
  const topicId = post?.topicId;

  const reviewedForumReport = await ForumReport.findByIdAndUpdate(
    id,
    {
      reviewStatus: "solved",
      reviewRemark: "Removed from forum",
      reviewDate: new Date().toISOString(),
    },
    { new: true }
  );

  // console.log("forum report");
  // console.log(reviewedForumReport);
  // console.log("topic Id");
  // console.log(topicId);

  res.json({ reviewedForumReport, topicId });
};


export const ignoreReportedContent = async (req, res) => {
  const { id } = req.params;

  const reviewedForumReport = await ForumReport.findByIdAndUpdate(
    id,
    {
      reviewStatus: "solved",
      reviewRemark: "No inappropriate content found",
      reviewDate: new Date().toISOString(),
    },
    { new: true }
  );

  const updatedContent = await updateReporterList(
    reviewedForumReport.contentType,
    reviewedForumReport.reportedContentId,
    [],
  );

  res.json({ reviewedForumReport, updatedContent });
};

export const deleteForumReport = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No forum report with id: ${id}`);
  }

  await ForumReport.findByIdAndRemove(id);
  res.json({ message: "Forum report deleted successfully." });
};