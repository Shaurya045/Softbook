import jwt from "jsonwebtoken";
import adminModel from "../models/admin.model.js";
import studentModel from "../models/student.model.js";
import seatModel from "../models/seat.model.js";
import attendanceModel from "../models/attendance.model.js";
import studentAuthModel from "../models/studentAuth.model.js";
import { v2 as cloudinary } from "cloudinary";

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

const getAllStudentbyAdminId = async (req, res) => {
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

const deleteAdmin = async (req, res) => {
  try {
    const { libraryId } = req.body;
    if (!libraryId) {
      return res
        .status(400)
        .json({ success: false, message: "Library ID is required" });
    }

    const adminDeleted = await adminModel.findByIdAndDelete(libraryId);

    await seatModel.deleteMany({ libraryId });

    // Find all students to delete their images and auths
    const students = await studentModel.find({ libraryId });

    // Collect all student IDs
    const studentIds = students.map((s) => s._id);

    // Delete all studentauths for these students BEFORE deleting students
    if (studentIds.length > 0) {
      await studentAuthModel.deleteMany({ student: { $in: studentIds } });
    }

    // Helper function to extract Cloudinary public_id from URL
    function getCloudinaryPublicId(url) {
      if (!url) return null;
      const parts = url.split("/upload/");
      if (parts.length < 2) return null;

      const publicPathWithExtension = parts[1];
      const segments = publicPathWithExtension.split("/");

      if (/^v\d+$/.test(segments[0])) {
        segments.shift();
      }

      const pathWithoutExtension = segments.join("/").split(".")[0];
      return pathWithoutExtension;
    }

    // Delete student images and idUploads from Cloudinary
    for (const student of students) {
      // Delete student image
      if (student.image) {
        const imagePublicId = getCloudinaryPublicId(student.image);
        if (imagePublicId) {
          try {
            await cloudinary.uploader.destroy(imagePublicId);
          } catch (err) {
            console.log(
              `Error deleting student image from Cloudinary for student ${student._id}:`,
              err
            );
          }
        }
      }
      // Delete student idUpload
      if (student.idUpload) {
        const idUploadPublicId = getCloudinaryPublicId(student.idUpload);
        if (idUploadPublicId) {
          try {
            await cloudinary.uploader.destroy(idUploadPublicId);
          } catch (err) {
            console.log(
              `Error deleting student idUpload from Cloudinary for student ${student._id}:`,
              err
            );
          }
        }
      }
    }

    // Now delete all students
    await studentModel.deleteMany({ libraryId });

    await attendanceModel.deleteMany({ libraryId });

    if (!adminDeleted) {
      return res
        .status(404)
        .json({ success: false, message: "Library not found" });
    }

    res.status(200).json({
      success: true,
      message: "All data related to the library has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { login, getAdminbyId, getAllStudentbyAdminId, deleteAdmin };
