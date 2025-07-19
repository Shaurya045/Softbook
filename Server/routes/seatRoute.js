import express from "express";
import {
  addSeat,
  allSeats,
  deleteSeat,
} from "../controllers/seatController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, addSeat);
router.get("/allseats", auth, allSeats);

router.delete("/deleteseat", auth, deleteSeat);

export default router;
