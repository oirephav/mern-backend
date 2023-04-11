import mongoose from "mongoose";

import Post from "../models/post.js";

export const getPosts = async (req, res) => {
  const { topicId } = req.params;

    // console.log(topicId);

  try {
    // const posts = await Post.find({ topicId }).sort({ createdAt: "asc" });

    const posts = await Post.aggregate([
      {
        $match: {
          topicId,
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
    ]).sort({
      createdAt: "asc",
    });

    // console.log(posts[0].userData[0].name);

    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const { topicId } = req.params;
  const post = req.body;

  const newPost = new Post({
    ...post,
    userId: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();

    const newPostId = newPost._id;

    const combinedPost = await Post.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(newPostId),
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

    const combinedNewPost = combinedPost[0];

    // res.status(201).json(newPost);
    res.status(201).json(combinedNewPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { topicId, postId } = req.params;
  const { message } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(404).send(`No post with id: ${postId}`);

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { message },
    { new: true }
  );

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { topicId, postId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(postId))
    return res.status(404).send(`No post with id: ${postId}`);

  await Post.findByIdAndDelete(postId);

  res.json({ message: "Post deleted successfully." });
};
