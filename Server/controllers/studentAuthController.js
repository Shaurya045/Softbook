import adminModel from "../models/admin.model.js";
import studentModel from "../models/student.model.js";
import studentAuthModel from "../models/studentAuth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { otpService } from "../config/redis.js";
import { sendOTPEmail } from "../config/nodemailer.js";

// In a multi-library scenario, you should check both phone and libraryId to ensure the student is being registered for the correct library.
// This assumes that the client sends libraryId in the request body.

const register = async (req, res) => {
  try {
    const { phone, email, password, libraryId } = req.body;

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
      email,
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
    // Check if the library (admin) is subscribed
    const admin = await adminModel.findById(libraryId);
    if (!admin || !admin.subscription || !admin.subscription.active) {
      return res.status(403).json({
        success: false,
        message:
          "Library subscription inactive. Please contact your library administrator.",
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
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again.",
      });
    }

    // Find the student by id
    const student = await studentModel.findById(studentId).lean();
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    const studentAuth = await studentAuthModel.findOne({ student: studentId });
    if (!studentAuth) {
      return res.status(404).json({
        success: false,
        message: "Student auth not found",
      });
    }

    // Fetch the library (admin) data, excluding sensitive fields
    let library = null;
    if (student.libraryId) {
      // Only select public fields from admin model
      library = await adminModel
        .findById(student.libraryId)
        .select("name email phone libraryName address location subscription")
        .lean();
    }

    res.status(200).json({ success: true, student, library, studentAuth });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update student email (for existing students)
const updateEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;
    const studentId = req.studentId;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login again.",
      });
    }

    // 1. Check if new email is already in use
    const existingStudent = await studentAuthModel.findOne({ email: newEmail });
    if (existingStudent && existingStudent._id.toString() !== studentId) {
      return res.status(400).json({
        success: false,
        message: "Email already in use by another student.",
      });
    }

    // 2. Update studentAuth email
    await studentAuthModel.findOneAndUpdate(
      { student: studentId },
      { email: newEmail }
    );

    res.status(200).json({
      success: true,
      message: "Email updated successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Forgot password - send OTP to email using Redis
const forgotPassword = async (req, res) => {
  try {
    const { email, libraryId, phone } = req.body;

    let student;

    // 1. Check if student has auth account
    if (phone) {
      student = await studentAuthModel.findOne({ phone });
      if (!student) {
        return res
          .status(400)
          .json({ success: false, message: "Your are not registered" });
      }
      await studentAuthModel.findByIdAndUpdate(student._id, {
        email,
      });
    } else {
      student = await studentAuthModel.findOne({ email });
      if (!student) {
        return res.status(400).json({
          success: false,
          message: "Email is missing. Please register your Email.",
          isPhone: true,
        });
      }
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store OTP in Redis with 10 minutes TTL
    const storeResult = await otpService.setOTP(student._id.toString(), otp);
    if (!storeResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to store OTP. Please try again.",
      });
    }

    // 4. Get library name for email
    const library = await adminModel.findById(libraryId);
    const libraryName = library?.libraryName;

    // 5. Send OTP via email
    const emailResult = await sendOTPEmail(email, otp, libraryName);
    if (!emailResult.success) {
      // If email fails, clean up the stored OTP
      await otpService.deleteOTP(student._id.toString());
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Please try again.",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to your email address.",
      studentId: student._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { otp, studentId } = req.body;
    const verifyResult = await otpService.verifyAndDeleteOTP(
      studentId.toString(),
      otp
    );
    if (!verifyResult.success) {
      return res.status(400).json({
        success: false,
        message: verifyResult.message || "Invalid or expired OTP.",
      });
    }
    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Verify OTP and reset password using Redis
const resetPassword = async (req, res) => {
  try {
    const { studentId, newPassword } = req.body;

    const student = await studentAuthModel.findById(studentId);
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Auth record not found.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await studentAuthModel.findByIdAndUpdate(studentId, {
      password: hashedPassword,
    });

    res.status(200).json({
      success: true,
      message:
        "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  register,
  login,
  getStudentData,
  updateEmail,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
