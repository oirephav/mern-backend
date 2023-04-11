import mongoose from "mongoose";

const clubSchema = mongoose.Schema({
  title: String,
  about: String,
  event: String,
  contact: String,
  website: String,
  insta: String,
  email: String,
  fb: String,
  utube: String,
  linkedin: String,
  img: String,
  clublink: String,
  avgRating: Number,
});

const Club = mongoose.model("Club", clubSchema);

export default Club;
