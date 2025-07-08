import studentModel from "../models/student.model.js";
import studentAuthModel from "../models/studentAuth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// In a multi-library scenario, you should check both phone and libraryId to ensure the student is being registered for the correct library.
// This assumes that the client sends libraryId in the request body.

const register = async (req, res) => {
  try {
    const { phone, password, libraryId } = req.body;

    // 1. Check if student exists in student model for the given library
    const student = await studentModel.findOne({ phone, libraryId });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "You are not admitted in this study center.",
      });
    }

    // 2. Check if already registered (by student._id, not just phone, to avoid cross-library issues)
    const existingAuth = await studentAuthModel.findOne({
      student: student._id,
    });
    if (existingAuth) {
      return res
        .status(400)
        .json({ success: false, message: "Already registered. Please login." });
    }

    // 3. Register
    const hashedPassword = await bcrypt.hash(password, 10);
    await studentAuthModel.create({
      student: student._id,
      phone,
      password: hashedPassword,
    });
    res.status(201).json({
      success: true,
      message: "Registration successful. Please login.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// For login, you SHOULD also check for libraryId to avoid cross-library login issues.
// This ensures that a student can only log in to the correct library account.
const login = async (req, res) => {
  try {
    const { phone, password, libraryId } = req.body;

    // 1. Find the student for the given phone and libraryId
    const student = await studentModel.findOne({ phone, libraryId });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "You are not admitted in this study center.",
      });
    }

    // 2. Find the auth record for this student._id
    const studentAuth = await studentAuthModel.findOne({
      student: student._id,
    });
    if (!studentAuth) {
      return res.status(400).json({
        success: false,
        message: "Not registered. Please register first.",
      });
    }
    const isMatch = await bcrypt.compare(password, studentAuth.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }
    // Send the studentModel id as token, not the studentAuth id
    const token = jwt.sign({ id: student._id }, process.env.JWT_KEY);
    res
      .status(200)
      .json({ success: true, message: "Login successful.", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to get student data for the frontend
// Yes, this controller should require studentAuth middleware to ensure only authenticated students can access their data.
// The studentAuth middleware sets req.studentId from the JWT token.
const getStudentData = async (req, res) => {
  try {
    // Get student id from token (set by studentAuth middleware)
    const studentId = req.studentId;
    if (!studentId) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Please login again." });
    }

    // Find the student by id
    const student = await studentModel.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    // Optionally, you can filter out sensitive fields if needed
    res.status(200).json({ success: true, student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { register, login, getStudentData };
