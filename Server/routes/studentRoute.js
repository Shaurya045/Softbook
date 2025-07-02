import express from "express";
import {
  admission,
  getAllStudent,
  getStudentbyId,
  // seatcount,
  updateStudent,
} from "../controllers/studentController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/admission",
  auth,
  upload.fields([
    { name: "idUpload", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  admission
);
router.get("/allstudents", auth, getAllStudent);
router.post("/getstudent", auth, getStudentbyId);
router.put("/updatestudent", auth, updateStudent);

export default router;
