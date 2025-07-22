import express from "express";
import { getAllBookings } from "../controllers/bookingController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/all", auth, getAllBookings);

export default router; 