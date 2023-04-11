import express from "express";

import { getAllFood, getFood, createFood, updateFood, deleteFood, voteFood } from './../controllers/food.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllFood);
router.get("/:id", getFood);
router.post("/", createFood);
router.patch("/:id", updateFood);
router.delete("/:id", deleteFood);
router.patch("/:id/voteFood", auth, voteFood);

export default router;