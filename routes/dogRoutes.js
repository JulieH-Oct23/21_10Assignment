// import express from "express";
// import {
//   adoptDog,
//   getAdoptedDogs,
//   getAvailableDogs,
//   getRegisteredDogs,
//   registerDog,
//   removeDog,
// } from "../controllers/dogController.js";
// import { authenticateUser } from "../middlewares/authMiddleware.js";
// import process from "process";

// const API_BASE = process.env.API_BASE || "http://localhost:4000/api";

// const router = express.Router();

// router.post("/register", authenticateUser, registerDog);
// router.get("/registered", authenticateUser, getRegisteredDogs);
// router.get("/adopted", authenticateUser, getAdoptedDogs);
// router.get("/available", authenticateUser, getAvailableDogs);
// router.post("/adopt/:id", authenticateUser, adoptDog);
// router.delete("/remove/:id", authenticateUser, removeDog);

// export default router;
import express from "express";
import {
  adoptDog,
  getAdoptedDogs,
  getAvailableDogs,
  getRegisteredDogs,
  registerDog,
  removeDog,
  getDogById
} from "../controllers/dogController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authenticateUser, registerDog);
router.get("/registered", authenticateUser, getRegisteredDogs);
router.get("/adopted", authenticateUser, getAdoptedDogs);
router.get("/available", authenticateUser, getAvailableDogs);
router.get("/:id", authenticateUser, getDogById); // <--- Must come before adopt/remove
router.post("/adopt/:id", authenticateUser, adoptDog);
router.delete("/remove/:id", authenticateUser, removeDog);

export default router;