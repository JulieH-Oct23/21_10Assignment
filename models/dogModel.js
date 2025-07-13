// models/dogModel.js
import mongoose from "mongoose";

const dogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    registrationStatus: {
      type: String,
      enum: ["Available", "Adopted"],
      default: "Available",
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    adoptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const Dog = mongoose.model("Dog", dogSchema);

export default Dog;
