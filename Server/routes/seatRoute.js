import express from "express";
import {
  addSeat,
  addShift,
  allSeats,
  allShifts,
  deleteSeat,
  deleteShift,
} from "../controllers/seatController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Seats
router.post("/add", auth, addSeat);
router.get("/allseats", auth, allSeats);
router.delete("/deleteseat", auth, deleteSeat);

// Shifts
router.post("/addshift", auth, addShift);
router.get("/allshifts", auth, allShifts);
router.delete("/deleteshift", auth, deleteShift);

export default router;
