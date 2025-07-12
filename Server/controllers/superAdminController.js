import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";
import studentModel from "../models/student.model.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.SUPER_ADMIN_EMAIL &&
      password === process.env.SUPER_ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_KEY);
      res
        .status(201)
        .json({ success: true, message: "Super Admin Activated", token });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAdminbyId = async (req, res) => {
  try {
    const { libraryId } = req.body;
    if (!libraryId)
      return res
        .status(401)
        .json({ success: false, message: "Library Not Found" });
    const admin = await adminModel.findById(libraryId).select("-password");
    res.status(200).json({ success: true, admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Sever Error." });
  }
};

const getAllStudentbgAdminId = async (req, res) => {
  try {
    const { libraryId } = req.body;
    const students = await studentModel.find({ libraryId });
    res.status(201).json({ success: "true", students });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: "false", message: "Internal Server Error" });
  }
};

export { login, getAdminbyId, getAllStudentbgAdminId };
