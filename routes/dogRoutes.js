import express from "express";
import {
  adoptDog,
  getRegisteredDogs,
  registerDog,
  removeDog,
} from "../controllers/dogController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, registerDog);
router.get("/registered", protect, getRegisteredDogs);
router.post("/:id/adopt", protect, adoptDog);
router.delete("/:id", protect, removeDog); // ✅ New route

export default router;
