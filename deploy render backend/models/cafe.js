import mongoose from "mongoose";

const cafeSchema = mongoose.Schema({
  title: String,
  description: { type: String },
  avgRating: { type: Number },
  image: { type: String, default: "" },
});

const Cafe = mongoose.model("Cafe", cafeSchema, "cafes");

export default Cafe;
