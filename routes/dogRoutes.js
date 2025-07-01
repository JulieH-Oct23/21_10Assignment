// routes/dogRoutes.js
import express from "express";
import {
  adoptDog,
  getAdoptedDogs,
  getRegisteredDogs,
  registerDog,
  removeDog,
} from "../controllers/dogController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, registerDog);
router.get("/registered", authenticateUser, getRegisteredDogs);
router.get("/adopted", authenticateUser, getAdoptedDogs);
router.post("/adopt/:id", authenticateUser, adoptDog);
router.delete("/remove/:id", authenticateUser, removeDog);

export default router;