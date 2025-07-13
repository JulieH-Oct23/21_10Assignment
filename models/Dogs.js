// models/Dogs.js
import mongoose from "mongoose";

const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  registrationStatus: {
    type: String,
    enum: ["Available", "Adopted", "Removed"],
    default: "Available",
  },
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
}, {
  timestamps: true,
});

const Dog = mongoose.model("Dog", DogSchema);
export default Dog;
