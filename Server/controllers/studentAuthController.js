import studentModel from "../models/student.model.js";
import studentAuthModel from "../models/studentAuth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  try {
    const { phone, password } = req.body;
    // 1. Check if student exists in student model
    const student = await studentModel.findOne({ phone });
    if (!student) {
      return res.status(400).json({ success: false, message: "You are not admitted in this study center." });
    }
    // 2. Check if already registered
    const existingAuth = await studentAuthModel.findOne({ phone });
    if (existingAuth) {
      return res.status(400).json({ success: false, message: "Already registered. Please login." });
    }
    // 3. Register
    const hashedPassword = await bcrypt.hash(password, 10);
    await studentAuthModel.create({
      student: student._id,
      phone,
      password: hashedPassword,
    });
    res.status(201).json({ success: true, message: "Registration successful. Please login." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const studentAuth = await studentAuthModel.findOne({ phone });
    if (!studentAuth) {
      return res.status(400).json({ success: false, message: "Not registered. Please register first." });
    }
    const isMatch = await bcrypt.compare(password, studentAuth.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }
    const token = jwt.sign({ id: studentAuth.student }, process.env.JWT_KEY, { expiresIn: "1d" });
    res.status(200).json({ success: true, message: "Login successful.", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { register, login }; 