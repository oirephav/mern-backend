import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  matricNumber: { type: String },
  email: { type: String },
  password: { type: String, required: true },
  image: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "student",
  },
});

export default mongoose.model("User", userSchema);
