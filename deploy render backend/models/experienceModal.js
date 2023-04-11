import mongoose from "mongoose";

const expSchema = mongoose.Schema({
  title: String,
  description: String,
  img: String,
  name: String,
  creator: String,
  likes: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    default: "pending",
  },
  location: String,
  charge: Number,
  duration: Number,
});

const Experience = mongoose.model("Experience", expSchema);

export default Experience;
