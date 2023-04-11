import mongoose from "mongoose";

import CourseReview from "../models/courseReview.js";
import Course from "../models/course.js";

export const getCourseReviews = async (req, res) => {
  const { courseId } = req.params;

  try {
    const courseReviews = await CourseReview.find({ courseId }).sort({
      createdAt: "asc",
    });
    res.status(200).json(courseReviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const createCourseReview = async (req, res) => {
  const { courseId } = req.params;
  const courseReview = req.body;

  const newCourseReview = new CourseReview({
    ...courseReview,
    userId: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newCourseReview.save();
    // console.log(newCourseReview);

    const updatedCourse = await updateCourseRating(courseId);

    res.status(201).json({ newCourseReview, updatedCourse });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateCourseReview = async (req, res) => {
  const { courseId, reviewId } = req.params;

  const {
    year,
    semester,
    title,
    description,
    overallRating,
    deliveryRating,
    difficultyRating,
    enjoymentRating,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    return res.status(404).send(`No review with id: ${reviewId}`);

  const updatedCourseReview = await CourseReview.findByIdAndUpdate(
    reviewId,
    {
      year,
      semester,
      title,
      description,
      overallRating,
      deliveryRating,
      difficultyRating,
      enjoymentRating,
    },
    { new: true }
  );

  const updatedCourse = await updateCourseRating(courseId);

  res.json({ updatedCourseReview, updatedCourse });
};

export const deleteCourseReview = async (req, res) => {
  const { courseId, reviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    return res.status(404).send(`No review with id: ${reviewId}`);

  await CourseReview.findByIdAndDelete(reviewId);

  const updatedCourse = await updateCourseRating(courseId);

  res.json({ message: "Course review deleted successfully.", updatedCourse });
};


const updateCourseRating = async (courseId) => {
  const result = await CourseReview.aggregate([
    { $match: { courseId } },
    {
      $group: {
        _id: null,
        avgOverallRating: { $avg: "$overallRating" },
        avgDeliveryRating: { $avg: "$deliveryRating" },
        avgDifficultyRating: { $avg: "$difficultyRating" },
        avgEnjoymentRating: { $avg: "$enjoymentRating" },
      },
    },
  ]);

  // console.log(result);

  const avgOverallRating = Math.round(result[0].avgOverallRating * 10) / 10;
  const avgDeliveryRating = Math.round(result[0].avgDeliveryRating * 10) / 10;
  const avgDifficultyRating =
    Math.round(result[0].avgDifficultyRating * 10) / 10;
  const avgEnjoymentRating = Math.round(result[0].avgEnjoymentRating * 10) / 10;

  // console.log(avgOverallRating);
  // console.log(avgDeliveryRating);
  // console.log(avgDifficultyRating);
  // console.log(avgEnjoymentRating);

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      avgOverallRating,
      avgDeliveryRating,
      avgDifficultyRating,
      avgEnjoymentRating,
    },
    { new: true }
  );

  return updatedCourse;
};
