import express from "express";
import {
  getAdminbyId,
  getAllStudentbgAdminId,
  login,
} from "../controllers/superAdminController.js";
import superAdminAuth from "../middleware/superAdminAuth.js";

const router = express.Router();

router.post("/login", login);
router.post("/allstudent", superAdminAuth, getAllStudentbgAdminId);
router.post("/getadmin", superAdminAuth, getAdminbyId);

export default router;
