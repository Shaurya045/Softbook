import express from "express";
import {
  register,
  login,
  getStudentData,
  updateEmail,
  forgotPassword,
  resetPassword,
  verifyOTP,
} from "../controllers/studentAuthController.js";
import studentAuth from "../middleware/studentAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getstudent", studentAuth, getStudentData);
router.put("/update-email", studentAuth, updateEmail);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
