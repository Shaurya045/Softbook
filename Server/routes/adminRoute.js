import express from "express";
import { login, profile, register, updateLocation } from "../controllers/adminController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, profile);
router.put("/location", auth, updateLocation);

export default router;
