import express from "express";
import { addSeat, allSeats } from "../controllers/seatController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/add", auth, addSeat);
router.get("/allseats", auth, allSeats);

export default router;
