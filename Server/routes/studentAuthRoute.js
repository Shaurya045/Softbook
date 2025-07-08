import express from "express";
import {
  register,
  login,
  getStudentData,
} from "../controllers/studentAuthController.js";
import studentAuth from "../middleware/studentAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getstudent", studentAuth, getStudentData);

export default router;
