import express from "express";
import mongoose from "mongoose";

import EventMessage from "../models/eventModel.js";

const router = express.Router();

//retrieving data takes time so async
//if successful return status 200 and json
export const getEventList = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    const today = new Date().toISOString();
    const total = await EventMessage.countDocuments({
      endDate: { $gt: today },
    });

    const events = await EventMessage.find({
      endDate: { $gt: today },
    })
      .sort({ startDate: 1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: events,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getFavEventList = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT;
    const today = new Date().toISOString();
    const total = await EventMessage.countDocuments({
      endDate: { $gt: today },
      fav: req.userId,
    });

    const events = await EventMessage.find({
      endDate: { $gt: today },
      fav: req.userId,
    })
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    res.json({
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
      data: events,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

//for admin portal table
export const getEventTable = async (req, res) => {
  const { user } = req.params;
  try {
    const eventTable = await EventMessage.find();
    res.status(200).json(eventTable);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await EventMessage.findById(id);

    res.status(200).json(event);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getEventsBySearch = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const events = await EventMessage.find({
      title,
      endDate: { $gt: new Date().toISOString() },
    });

    res.json(events);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getEventsByTag = async (req, res) => {
  const { tag } = req.query;
  try {
    const eventTag = new RegExp(tag, "i");

    const events = await EventMessage.find({ tags: eventTag });

    res.json(events);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getThisMonthEvents = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT;
    const thismonth = (new Date().getMonth() + 1).toString();
    var month = "";
    if (thismonth <= 9) {
      month = "-0" + thismonth + "-";
    } else {
      month = "-" + thismonth + "-";
    }
    console.log(month);
    const total = await EventMessage.countDocuments({
      endDate: { $gt: new Date() },
    });

    const events = await EventMessage.find(
      {
        startDate: { $regex: month, $options: "i" },
      },
      function (err, docs) {}
    )
      .sort({ startDate: 1 })
      .limit(LIMIT)
      .skip(startIndex);
    console.log(events);
    res.json({
      data: events,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getEventsByDateRange = async (req, res) => {
  const { date, page } = req.query;
  console.log("Fdsfs");
  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT;
    const fromDate = date.slice(0, 10) + "T00:00";
    console.log(fromDate);
    const toDate = date.slice(11, 21) + "T24:00";
    const total = await EventMessage.countDocuments({
      endDate: { $gt: new Date().toISOString() },
      startDate: {
        $lte: fromDate,
        $lte: toDate,
      },
    });

    const events = await EventMessage.find({
      endDate: { $gt: new Date().toISOString() },
      startDate: {
        $lte: fromDate,
        $lte: toDate,
      },
    })
      .sort({ startDate: 1 })
      .limit(LIMIT)
      .skip(startIndex);
    console.log(events);
    res.json({
      data: events,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addEvent = async (req, res) => {
  const {
    title,
    tags,
    about,
    startDate,
    endDate,
    venue,
    contact,
    organizer,
    img,
    fav,
    audience,
    fee,
  } = req.body;
  const existingEvent = await EventMessage.findOne({ title });

  if (existingEvent) {
    return res.status(400).send("Event is already exist.");
  }
  const newEvent = new EventMessage({
    title,
    tags,
    about,
    startDate,
    endDate,
    venue,
    contact,
    organizer,
    img,
    fav,
    audience,
    fee,
  });

  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    tags,
    about,
    startDate,
    endDate,
    venue,
    contact,
    organizer,
    img,
    fav,
    audience,
    fee,
  } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);
  const updateEvent = {
    title,
    tags,
    about,
    startDate,
    endDate,
    venue,
    contact,
    organizer,
    img,
    fav,
    audience,
    fee,
    _id: id,
  };
  await EventMessage.findByIdAndUpdate(id, updateEvent, { new: true });
  res.json(updateEvent);
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No event with id: ${id}`);
  await EventMessage.findByIdAndRemove(id);
  res.json({ message: "Deleted successfully." });
};

export default router;

export const favEvent = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No event with id: ${id}`);

  const event = await EventMessage.findById(id);

  const index = event.fav.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    event.fav.push(req.userId);
  } else {
    event.fav = event.fav.filter((id) => id !== String(req.userId));
  }
  const updatedEvent = await EventMessage.findByIdAndUpdate(id, event, {
    new: true,
  });
  res.status(200).json(updatedEvent);
};
