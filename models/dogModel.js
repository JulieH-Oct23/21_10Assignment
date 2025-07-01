// models/dogModel.js
import mongoose from "mongoose";

const dogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adoptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    thankYouMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

const Dog = mongoose.model("Dog", dogSchema);

export default Dog;
