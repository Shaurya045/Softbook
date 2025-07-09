import express from "express";
import {
  allAdmins,
  login,
  profile,
  register,
  updateLocation,
  updateSubscription,
} from "../controllers/adminController.js";
import auth from "../middleware/auth.js";
import superAdminAuth from "../middleware/superAdminAuth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, profile);
router.put("/location", auth, updateLocation);
router.patch("/updatesubscription", superAdminAuth, updateSubscription);
router.get("/alladmins", superAdminAuth, allAdmins);

export default router;
