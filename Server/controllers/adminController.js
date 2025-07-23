import adminModel from "../models/admin.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const { name, email, password, phone, libraryName, address, location } =
      req.body;
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let geoLocation = undefined;
    if (location && location.lat && location.lng) {
      geoLocation = {
        type: "Point",
        coordinates: [location.lng, location.lat],
      };
    }
    const newAdmin = new adminModel({
      name,
      email,
      password: hashedPassword,
      phone,
      libraryName,
      address,
      location: geoLocation,
    });
    await newAdmin.save();
    res
      .status(201)
      .json({ success: true, message: "Admin created successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin not Registered." });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials." });
    }
    if (!admin.subscription || !admin.subscription.active) {
      return res.status(403).json({
        success: false,
        message: "You are not subscribed. Please contact SuperAdmin.",
      });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_KEY);
    res
      .status(200)
      .json({ success: true, message: "Admin logged in successfully.", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const profile = async (req, res) => {
  try {
    const libraryId = req.libraryId;
    if (!libraryId)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    const admin = await adminModel.findById(libraryId).select("-password");
    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Sever Error." });
  }
};

const updateLocation = async (req, res) => {
  try {
    const libraryId = req.body.libraryId;
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res
        .status(400)
        .json({ success: false, message: "lat and lng required" });
    }
    const updated = await adminModel.findByIdAndUpdate(
      libraryId,
      { location: { type: "Point", coordinates: [lng, lat] } },
      { new: true }
    );
    res.status(200).json({ success: true, admin: updated });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const { adminId, plan } = req.body;
    if (!adminId) {
      return res
        .status(400)
        .json({ success: false, message: "adminId is required." });
    }
    if (!plan) {
      return res
        .status(400)
        .json({ success: false, message: "plan is required." });
    }

    const updateFields = {};
    const planLower = plan.toLowerCase();

    if (planLower === "free") {
      updateFields["subscription.plan"] = "free";
      updateFields["subscription.active"] = true;
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(now.getDate() + 15);
      updateFields["subscription.expiresAt"] = expiresAt;
    } else if (planLower === "basic") {
      updateFields["subscription.plan"] = "basic";
      updateFields["subscription.active"] = true;
      const now = new Date();
      const expiresAt = new Date(now);
      expiresAt.setDate(now.getDate() + 30);
      updateFields["subscription.expiresAt"] = expiresAt;
    } else if (planLower === "expired") {
      updateFields["subscription.plan"] = "expired";
      updateFields["subscription.active"] = false;
      updateFields["subscription.expiresAt"] = null;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan value." });
    }

    const updatedAdmin = await adminModel.findByIdAndUpdate(
      adminId,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedAdmin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }
    res.status(200).json({
      success: true,
      message: "Subscription updated.",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const allAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find({});
    res.status(201).json({ success: "true", admins });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  register,
  login,
  profile,
  updateLocation,
  updateSubscription,
  allAdmins,
};
