import attendanceModel from "../models/attendance.model.js";
import seatModel from "../models/seat.model.js";
import studentModel from "../models/student.model.js";
import { v2 as cloudinary } from "cloudinary";
import studentAuthModel from "../models/studentAuth.model.js";

const admission = async (req, res) => {
  try {
    const {
      studentName,
      fatherName,
      phone,
      localAdd,
      permanentAdd,
      room,
      shift,
      seatNo,
      amount,
      paymentMode,
      duration,
      dueDate,
      idProof,
    } = req.body;

    const libraryId = req.libraryId;

    // Upload files to Cloudinary
    let idUploadUrl = "";
    let imageUrl = "";

    if (req.files.idUpload && req.files.idUpload[0]) {
      const idUploadResult = await cloudinary.uploader.upload(
        req.files.idUpload[0].path,
        { folder: "students/idUpload" }
      );
      idUploadUrl = idUploadResult.secure_url;
    }

    if (req.files.image && req.files.image[0]) {
      const imageResult = await cloudinary.uploader.upload(
        req.files.image[0].path,
        { folder: "students/image" }
      );
      imageUrl = imageResult.secure_url;
    }

    if (!libraryId) {
      return res
        .status(400)
        .json({ success: false, message: "libraryId is required." });
    }

    const existingStudent = await studentModel.findOne({ phone });
    if (existingStudent) {
      return res
        .status(400)
        .json({ success: "false", message: "Student already exists." });
    }

    let due;
    if (dueDate) {
      due = dueDate;
    } else {
      const now = new Date();
      due = new Date(now.setMonth(now.getMonth() + Number(duration || 1)));
    }

    const student = await studentModel.create({
      studentName,
      fatherName,
      phone,
      localAdd,
      permanentAdd,
      room,
      shift,
      seatNo,
      amount,
      paymentMode,
      duration,
      dueDate: due,
      idProof,
      idUpload: idUploadUrl,
      image: imageUrl,
      libraryId,
    });

    // let shiftLower = shift.toLowerCase();

    // Seat booking logic according to seat model
    const seat = await seatModel.findOne({
      room,
      shift,
      seatNo,
      libraryId,
    });
    if (!seat) {
      await studentModel.findByIdAndDelete(student._id);
      return res
        .status(400)
        .json({ status: "error", error: "Seat does not exist" });
    }
    if (seat.status === "booked") {
      await studentModel.findByIdAndDelete(student._id);
      return res
        .status(400)
        .json({ status: "error", error: "Seat already booked" });
    }
    seat.status = "booked";
    seat.studentId = student._id;
    await seat.save();

    res
      .status(201)
      .json({ success: true, message: "Admission Done.", student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllStudent = async (req, res) => {
  try {
    const students = await studentModel.find({});
    res.status(201).json({ success: "true", students });
  } catch (error) {
    console.log(error);
    res
      .starus(500)
      .json({ success: "false", message: "Internal Server Error" });
  }
};

const getStudentbyId = async (req, res) => {
  try {
    const { id } = req.body;
    const student = await studentModel.findById(id);
    res.status(201).json({ success: "true", student });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: "false", message: "Internal Server Error" });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id, room, shift, seatNo, duration } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Student id is required" });
    }

    const student = await studentModel.findById(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const updates = {};
    if (room !== undefined) updates.room = room;
    if (shift !== undefined) updates.shift = shift;
    if (seatNo !== undefined) updates.seatNo = seatNo;
    if (duration !== undefined) {
      updates.duration = duration;
      let due = student.dueDate ? new Date(student.dueDate) : new Date();
      due.setMonth(due.getMonth() + Number(duration));
      updates.dueDate = due;
    }

    // Only update seat if seat data is provided
    if (room && shift && seatNo) {
      // Free previous seat
      await seatModel.findOneAndUpdate(
        { studentId: id },
        { status: "available", studentId: null }
      );
      // Book new seat
      let shiftLower = shift.toLowerCase();
      const seat = await seatModel.findOne({ room, shift: shiftLower, seatNo });
      if (!seat) {
        return res
          .status(400)
          .json({ success: false, message: "Seat does not exist" });
      }
      if (seat.status === "booked" && String(seat.studentId) !== String(id)) {
        return res
          .status(400)
          .json({ success: false, message: "Seat already booked" });
      }
      seat.status = "booked";
      seat.studentId = id;
      await seat.save();
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    res.status(200).json({ success: true, student: updatedStudent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const id = req.body.id || req.query.id || req.params.id;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Student id is required" });
    }

    const student = await studentModel.findById(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    await studentModel.findByIdAndDelete(id);

    await seatModel.findOneAndUpdate(
      { studentId: id },
      { status: "available", studentId: null }
    );

    await attendanceModel.deleteMany({ student: id });

    await studentAuthModel.findOneAndDelete({ student: id });

    res.status(200).json({ success: true, message: "Student Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  admission,
  getAllStudent,
  getStudentbyId,
  updateStudent,
  deleteStudent,
};
