import mongoose from "mongoose";

import Topic from "../models/topic.js";
import Post from "../models/post.js";

export const getTopics = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 10;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page

    const total = await Topic.countDocuments({});
    const topics = await Topic.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.json({
      data: topics,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTopicsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  // console.log(searchQuery);

  try {
    const title = new RegExp(searchQuery, "i");

    const topics = await Topic.find({
      $or: [{ title }, { tags: { $in: tags.split(",") } }],
    });
    // console.log(topics)
    // if (topics.length) {
    //   console.log(topics[0]._id)
    // }
    // else {
    //   console.log("search returns no results")
    // }

    res.status(200).json(topics);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await Topic.distinct("tags");
    // console.log(tags);

    res.status(200).json(tags);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
 };

export const getTopic = async (req, res) => {
  const { id } = req.params;

  const existingTopic = await Topic.findById(id);

  if (!existingTopic) {
    return res.status(404).send(`No topic with id: ${id}`);
  }

  try {
    const topic = await Topic.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(id),
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

    // console.log(topic[0].userData[0].name);

    //aggregate returns an array by default
    res.status(200).json(topic[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createTopic = async (req, res) => {
  const topic = req.body;

  const newTopic = new Topic({
    userId: req.userId,
    ...topic,
    createdAt: new Date().toISOString(),
  });

  try {
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateTopic = async (req, res) => {
  const { id } = req.params;
  const { title, message, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No topic with id: ${id}`);

  const updatedTopic = await Topic.findByIdAndUpdate(
    id,
    { title, message, tags },
    { new: true }
  );
  const tagList = await Topic.distinct("tags");

  res.json({ updatedTopic, tagList });
};

export const deleteTopic = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No topic with id: ${id}`);

  await Topic.findByIdAndRemove(id);
  await Post.deleteMany({ topicId: id });
  const tags = await Topic.distinct("tags");

  res.json({ tags, message: "Topic deleted successfully." });
};
