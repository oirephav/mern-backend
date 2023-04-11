import mongoose from "mongoose";

import FoodNomination from "../models/foodNomination.js";

export const getFoodNominations = async (req, res) => {
  try {
    const foodNominations = await FoodNomination.find();
    res.status(200).json(foodNominations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getApprovedFoodNominations = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await FoodNomination.countDocuments({});
    const foodNominations = await FoodNomination.find({status: "approved"})
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: foodNominations,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getFoodNomination = async (req, res) => {
  const { id } = req.params;
  try {
    const foodNomination = await FoodNomination.findById(id);
    
    res.status(200).json(foodNomination);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createFoodNomimation = async (req, res) => {
  const foodNomination = req.body;

  const newFoodNomination = new FoodNomination({
    ...foodNomination,
  });

  try {
    await newFoodNomination.save();
    res.status(201).json(newFoodNomination);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateFoodNomination = async (req, res) => {
  const { id } = req.params;
  const { foodName, description, image } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No food with id: ${id}`);
  }

  const updatedFoodNomination = await FoodNomination.findByIdAndUpdate(
    id,
    { foodName, description, image },
    { new: true }
  );
  res.json(updatedFoodNomination);
};

export const deleteFoodNomination = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No food nomination with id: ${id}`);
  }

  await FoodNomination.findByIdAndRemove(id);
  res.json({ message: "Food nomination deleted successfully." });
};

export const approveFoodNomination = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No food nomination with id: ${id}`);
  }

  const approvedNomination = await FoodNomination.findByIdAndUpdate(
    id,
    { status: "approved" },
    { new: true }
  );
  // console.log(approvedNomination);
  res.json(approvedNomination);
};

export const declineFoodNomination = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No food nomination with id: ${id}`);
  }

  const declinedNomination = await FoodNomination.findByIdAndUpdate(
    id,
    { status: "declined" },
    { new: true }
  );
  res.json(declinedNomination);
};

export const voteFood = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No food nomination with id: ${id}`);

  const foodNomination = await FoodNomination.findById(id);

  const index = foodNomination.votes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    foodNomination.votes.push(req.userId);
  } else {
    foodNomination.votes = foodNomination.votes.filter((id) => id !== String(req.userId));
  }
  const updatedFood = await FoodNomination.findByIdAndUpdate(
    id,
    foodNomination,
    {
      new: true,
    }
  );
  res.status(200).json(updatedFood);
};

