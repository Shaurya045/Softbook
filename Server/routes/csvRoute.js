import express from "express";
import auth from "../middleware/auth.js";
import { csvExportStudentData } from "../controllers/csvController.js";
const router = express.Router();

router.get("/csvstudentdata", auth, csvExportStudentData);

export default router;
