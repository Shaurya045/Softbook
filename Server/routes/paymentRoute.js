import express from "express";
import auth from "../middleware/auth.js";
import { getPayments } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/getpayments", auth, getPayments);

export default router;
