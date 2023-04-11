import mongoose from "mongoose";

const leisureSchema = mongoose.Schema({
  title: String,
  details: [String],
  category: String,
  img: String,
  location: String,
  fee: String,
  openTime: String,
  closeTime: String,
});

const Leisure = mongoose.model("Leisure", leisureSchema);

export default Leisure;
