import express from "express";

import { getCourses, getCoursesByPage, getCoursesBySearch, getCourse, createCourse, updateCourse, deleteCourse } from './../controllers/courses.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/search", getCoursesBySearch);
router.get("/admin", getCourses);
router.get("/", getCoursesByPage);
router.get("/:id", getCourse);
router.post("/", auth, createCourse);
router.patch("/:id", auth, updateCourse);
router.delete("/:id", auth, deleteCourse);

export default router;
