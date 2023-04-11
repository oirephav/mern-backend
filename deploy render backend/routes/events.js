import express from "express";
import {
  getEventList,
  getEvent,
  addEvent,
  updateEvent,
  deleteEvent,
  getEventsBySearch,
  getEventTable,
  favEvent,
  getFavEventList,
  getEventsByTag,
  getThisMonthEvents,
  getEventsByDateRange,
} from "../controllers/events.js";
import auth from "../middleware/auth.js";
//create a new router obj for request handling
const router = express.Router();

//specify a callback fx when received a request to the specific endpoints
router.get("/range", getEventsByDateRange);
router.get("/month", getThisMonthEvents);
router.get("/", getEventList);
router.get("/:user", getEventTable);
router.get("/detail/:id", getEvent);
router.get("/info/search", getEventsBySearch);
router.get("/tag/search", getEventsByTag);
router.post("/", addEvent);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/fav/events", auth, getFavEventList);
router.patch("/addFav/:id", auth, favEvent);

export default router;
