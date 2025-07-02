import express from "express";
import { markAttendance, getStudentAttendance, getAdminAttendance } from "../controllers/attendanceController.js";
import studentAuth from "../middleware/studentAuth.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Student routes
router.post("/mark", studentAuth, markAttendance);
router.get("/student", studentAuth, getStudentAttendance);

// Admin route
router.get("/admin", auth, getAdminAttendance);

export default router; 