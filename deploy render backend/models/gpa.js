import mongoose from "mongoose";

const gpaSchema = mongoose.Schema({
  name: String,
  credithr: Number,
});

const Gpa = mongoose.model("Gpa", gpaSchema);

export default Gpa;
