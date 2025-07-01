// import express from "express";
// import {
//   adoptDog,
//   getRegisteredDogs,
//   registerDog,
//   removeDog,
// } from "../controllers/dogController.js";
// import { protect } from "../middlewares/auth.js";

// const router = express.Router();

// router.post("/", protect, registerDog);
// router.get("/registered", protect, getRegisteredDogs);
// router.post("/:id/adopt", protect, adoptDog);
// router.delete("/:id", protect, removeDog); // ✅ New route

// export default router;

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

// All routes here require authentication middleware
router.use(authenticateUser);

// POST /api/dogs/register
router.post("/register", registerDog);

// DELETE /api/dogs/remove/:id
router.delete("/remove/:id", removeDog);

// GET /api/dogs/registered?status=&page=&limit=
router.get("/registered", getRegisteredDogs);

// GET /api/dogs/adopted?page=&limit=
router.get("/adopted", getAdoptedDogs);

// POST /api/dogs/adopt/:id
router.post("/adopt/:id", adoptDog);

export default router;
