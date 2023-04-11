import mongoose from "mongoose";

const foodSchema = mongoose.Schema({
  foodName: { type: String },
  image: { type: String, default: "" },
  description: { type: String },
  votes: { type: [String], default: [] },
});

export default mongoose.model("Food", foodSchema);
