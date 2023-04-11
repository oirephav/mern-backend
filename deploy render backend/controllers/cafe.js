import mongoose from "mongoose";

import Cafe from "../models/cafe.js";
import CafeReview from "../models/cafeReview.js";

export const getAllCafes = async (req, res) => {
  try {
    const cafes = await Cafe.find();

    res.status(200).json(cafes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getAllCafesByPages = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await Cafe.countDocuments({});
    const cafes = await Cafe.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: cafes,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCafe = async (req, res) => {
  const { id } = req.params;

  try {
    const cafe = await Cafe.findById(id);

    if (!cafe) {
      return res.status(404).send(`No cafe with id: ${id}`);
    }

    res.status(200).json(cafe);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createCafe = async (req, res) => {
  const cafe = req.body;

  const newCafe = new Cafe({
    ...cafe,
  });

  try {
    await newCafe.save();
    res.status(201).json(newCafe);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const updateCafe = async (req, res) => {
  const { id } = req.params;
  const { title, description, image, lat, long } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No cafe with id: ${id}`);
  }

  const updatedCafe = await Cafe.findByIdAndUpdate(
    id,
    { title, description, image, lat, long },
    { new: true }
  );
  res.json(updatedCafe);
};

export const deleteCafe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No cafe with id: ${id}`);
  }

  await Cafe.findByIdAndRemove(id);
  await CafeReview.deleteMany({ cafeId: id });

  res.json({ message: "Cafe deleted successfully." });
};

