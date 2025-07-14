import express from "express";
import {
  deleteAdmin,
  getAdminbyId,
  getAllStudentbyAdminId,
  login,
} from "../controllers/superAdminController.js";
import superAdminAuth from "../middleware/superAdminAuth.js";

const router = express.Router();

router.post("/login", login);
router.post("/allstudent", superAdminAuth, getAllStudentbyAdminId);
router.post("/getadmin", superAdminAuth, getAdminbyId);
router.delete("/deleteadmin", superAdminAuth, deleteAdmin);

export default router;
