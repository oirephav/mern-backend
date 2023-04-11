import express from "express";
import { addCourse, getGpa } from "../controllers/gpa.js";

const router = express.Router();

router.get("/", getGpa);
router.post("/", addCourse);

export default router;
