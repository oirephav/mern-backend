import mongoose from "mongoose";

import ClubReview from "../models/clubReview.js";
import Club from "../models/clubModal.js";

export const getClubReviews = async (req, res) => {
  const { clubId } = req.params;

  try {
    const clubReviews = await ClubReview.find({ clubId }).sort({
      createdAt: "asc",
    });
    res.status(200).json(clubReviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const createClubReview = async (req, res) => {
  const { clubId } = req.params;
  const clubReview = req.body;

  const newClubReview = new ClubReview({
    ...clubReview,
    userId: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newClubReview.save();
    console.log(newClubReview);

    const updatedClub = await updateClubRating(clubId);

    res.status(201).json({ newClubReview, updatedClub });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateClubReview = async (req, res) => {
  const { clubId, reviewId } = req.params;
  const { title, description, rating } = req.body;

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    return res.status(404).send(`No club review with id: ${reviewId}`);

  const updatedClubReview = await ClubReview.findByIdAndUpdate(
    reviewId,
    { title, description, rating },
    { new: true }
  );

  const updatedClub = await updateClubRating(clubId);

  res.json({ updatedClubReview, updatedClub });
};

export const deleteClubReview = async (req, res) => {
  const { clubId, clubReviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(clubReviewId))
    return res.status(404).send(`No club review with id: ${clubReviewId}`);

  await ClubReview.findByIdAndDelete(clubReviewId);

  const updatedClub = await updateClubRating(clubId);

  res.json({ message: "Club review deleted successfully.", updatedClub });
};

const updateClubRating = async (clubId) => {
  const result = await ClubReview.aggregate([
    { $match: { clubId } },
    { $group: { _id: null, average: { $avg: "$rating" } } },
  ]);

  console.log(result);

  let avgRating = result[0].average;
  avgRating = Math.round(avgRating * 10) / 10;

  console.log(avgRating);

  const updatedClub = await Club.findByIdAndUpdate(
    clubId,
    { avgRating },
    { new: true }
  );

  return updatedClub;
};
