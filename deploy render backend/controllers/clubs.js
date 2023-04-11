import express from "express";
import mongoose from "mongoose";

import ClubMessage from "../models/clubModal.js";
import ClubReview from "../models/clubReview.js";

const router = express.Router();

export const getClubList = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    const total = await ClubMessage.countDocuments({});
    const clubs = await ClubMessage.find()
      .sort({ _id: 1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: clubs,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getClubTable = async (req, res) => {
  const { user } = req.params;
  try {
    const clubTable = await ClubMessage.find();
    res.status(200).json(clubTable);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getClub = async (req, res) => {
  const { id } = req.params;
  try {
    const club = await ClubMessage.findById(id);

    res.status(200).json(club);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getClubsBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const clubs = await ClubMessage.find({ title });

    res.json(clubs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addClub = async (req, res) => {
  const {
    title,
    about,
    event,
    contact,
    website,
    insta,
    email,
    fb,
    utube,
    linkedin,
    img,
    clublink,
    avgRating,
  } = req.body;
  const existingClub = await ClubMessage.findOne({ title });

  if (existingClub) {
    return res.status(400).send("Club is already exist.");
  }
  const newClub = new ClubMessage({
    title,
    about,
    event,
    contact,
    website,
    insta,
    email,
    fb,
    utube,
    linkedin,
    img,
    clublink,
    avgRating,
  });

  try {
    await newClub.save();
    res.status(201).json(newClub);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateClub = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    about,
    event,
    contact,
    website,
    insta,
    email,
    fb,
    utube,
    linkedin,
    img,
    clublink,
    avgRating,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No club with id: ${id}`);
  const updateClub = {
    title,
    about,
    event,
    contact,
    website,
    insta,
    email,
    fb,
    utube,
    linkedin,
    img,
    clublink,
    avgRating,
    _id: id,
  };
  await ClubMessage.findByIdAndUpdate(id, updateClub, { new: true });
  res.json(updateClub);
};

export const deleteClub = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No club with id: ${id}`);
  await ClubMessage.findByIdAndRemove(id);
  await ClubReview.deleteMany({ clubId: id });
  res.json({ message: "Deleted successfully." });
};

export default router;
