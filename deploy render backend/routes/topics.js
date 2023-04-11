import express from "express";

import { getTopics, getTags, getTopic, getTopicsBySearch, createTopic, updateTopic, deleteTopic } from './../controllers/topics.js';
import { getPosts, createPost, updatePost, deletePost } from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/search", getTopicsBySearch);
router.get("/tags", getTags);
router.get("/", getTopics);
router.get("/:id", getTopic);
router.post("/", auth, createTopic);
router.patch("/:id", auth, updateTopic);
router.delete("/:id", auth, deleteTopic);
router.get("/topic/:topicId", getPosts);
router.post("/topic/:topicId", auth, createPost);
router.patch("/topic/:topicId/post/:postId", auth, updatePost);
router.delete("/topic/:topicId/post/:postId", auth, deletePost);


export default router;
