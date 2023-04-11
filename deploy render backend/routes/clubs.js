import express from "express";
import {
  getClubList,
  getClub,
  addClub,
  updateClub,
  deleteClub,
  getClubsBySearch,
  getClubTable,
} from "../controllers/clubs.js";

const router = express.Router();

router.get("/", getClubList);
router.get("/:user", getClubTable);
router.get("/detail/:id", getClub);
router.get("/name/search", getClubsBySearch);
router.post("/", addClub);
router.patch("/:id", updateClub);
router.delete("/:id", deleteClub);

export default router;
