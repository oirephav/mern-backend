import express from "express";

import GpaMessage from "../models/gpa.js";

const router = express.Router();

export const getGpa = async (req, res) => {
  try {
    const gpas = await GpaMessage.find();
    res.status(200).json(gpas);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addCourse = async (req, res) => {
  const { name, credithr } = req.body;

  const newCourse = new GpaMessage({
    name,
    credithr,
  });

  try {
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export default router;
