import express from "express";
import auth from "../middleware/auth.js";
import { getPayments, income } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/getpayments", auth, getPayments);
router.get("/income", auth, income);

export default router;
