import mongoose from "mongoose";

import Food from "../models/food.js";

export const getAllFood = async (req, res) => {
  try {
    const food = await Food.find();
    
    res.status(200).json(food);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getFood = async (res, req) => {
  const { id } = req.params;
  try {
    const food = await Food.findById(id);
    res.status(200).json(food);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createFood = async (req, res) => {
  const food = req.body;

  const newFood = new Food({
    ...food,
  });

  try {
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateFood = async (req, res) => {
  const { id } = req.params;
  const { foodName, description, image, votes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No food with id: ${id}`);
  }

  const updatedFood = await Food.findByIdAndUpdate(
    id,
    { foodName, description, image, votes },
    { new: true }
  );
  res.json(updatedFood);
};

export const deleteFood = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No food with id: ${id}`);
  }

  await Food.findByIdAndRemove(id);
  res.json({ message: "Food deleted successfully." });
};

export const voteFood = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
      return res.json({ message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No food with id: ${id}`);

  const food = await Food.findById(id);

    const index = food.votes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      food.votes.push(req.userId);
    } else {
      food.votes = food.votes.filter((id) => id !== String(req.userId));
    }
    const updatedFood = await Food.findByIdAndUpdate(id, food, {
      new: true,
    });
    res.status(200).json(updatedFood);
};