import mongoose from "mongoose";

import CafeReview from "../models/cafeReview.js";
import Cafe from "../models/cafe.js";
import User from "../models/user.js";


export const getCafeReviews = async (req, res) => {
  const { cafeId } = req.params;

  try {
    // const cafeReviews = await CafeReview.find({ cafeId }).sort({
    //   createdAt: "asc",
    // });

    const cafeReviews = await CafeReview.aggregate([
      {
        $match: { cafeId },
      },
      {
        $lookup: {
          from: "users",
          let: {
            user: "$userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$_id",
                    {
                      $toObjectId: "$$user",
                    },
                  ],
                },
              },
            },
            {
              $project: {
                temp: {
                  name: "$name",
                  image: "$image",
                },
              },
            },
            {
              $replaceRoot: {
                newRoot: "$temp",
              },
            },
          ],
          as: "userData",
        },
      },
    ]).sort({
      createdAt: "asc",
    });

    // console.log(cafeReviews[0].userData);

    res.status(200).json(cafeReviews);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const createCafeReview = async (req, res) => {
  const { cafeId } = req.params;
  const cafeReview = req.body;

  const newCafeReview = new CafeReview({
    ...cafeReview,
    userId: req.userId,
    createdAt: new Date().toISOString(),
  });


  try {
    await newCafeReview.save();
    // console.log(newCafeReview);

    const cafeReviewId = newCafeReview._id;

    const combinedCafeReview = await CafeReview.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(cafeReviewId),
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            user: "$userId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    "$_id",
                    {
                      $toObjectId: "$$user",
                    },
                  ],
                },
              },
            },
            {
              $project: {
                temp: {
                  name: "$name",
                  image: "$image",
                },
              },
            },
            {
              $replaceRoot: {
                newRoot: "$temp",
              },
            },
          ],
          as: "userData",
        },
      },
    ]);

    // console.log(combinedCafeReview);
    const combinedNewCafeReview = combinedCafeReview[0];

    const updatedCafe = await updateCafeRating(cafeId);

    // res.status(201).json({ newCafeReview, updatedCafe });
    res.status(201).json({ newCafeReview: combinedNewCafeReview, updatedCafe });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateCafeReview = async (req, res) => {
  const { cafeId, reviewId } = req.params;
  const { title, description, rating } = req.body;

  if (!mongoose.Types.ObjectId.isValid(reviewId))
    return res.status(404).send(`No cafe review with id: ${reviewId}`);

  const updatedCafeReview = await CafeReview.findByIdAndUpdate(
    reviewId,
    { title, description, rating },
    { new: true }
  );

  // console.log(updatedCafeReview);

  const updatedCafe = await updateCafeRating(cafeId);

  res.json({ updatedCafeReview, updatedCafe });
};

export const deleteCafeReview = async (req, res) => {
  const { cafeId, cafeReviewId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(cafeReviewId))
    return res.status(404).send(`No cafe review with id: ${cafeReviewId}`);

  await CafeReview.findByIdAndDelete(cafeReviewId);

  const updatedCafe = await updateCafeRating(cafeId);

  res.json({ message: "Cafe review deleted successfully.", updatedCafe });
};

const updateCafeRating = async (cafeId) => {
  const result = await CafeReview.aggregate([
    { $match: { cafeId } },
    { $group: { _id: null, average: { $avg: "$rating" } } },
  ]);

  // console.log(result);

  let avgRating = result[0].average;
  avgRating = Math.round(avgRating * 10) / 10;

  // console.log(avgRating);

  const updatedCafe = await Cafe.findByIdAndUpdate(
    cafeId,
    { avgRating },
    { new: true }
  );

  return updatedCafe;
};
