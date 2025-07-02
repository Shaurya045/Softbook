import seatModel from "../models/seat.model.js";
import studentModel from "../models/student.model.js";
import { v2 as cloudinary } from "cloudinary";

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
      // dueDate,
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

    // const due = dueDate ? dueDate : new Date();

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
      // dueDate: due,
      idProof,
      idUpload: idUploadUrl,
      image: imageUrl,
      libraryId,
    });

    // Seat booking logic according to seat model
    const seat = await seatModel.findOne({
      room,
      shift,
      seatNo,
      libraryId,
    });
    if (!seat) {
      await studentModel.findByIdAndDelete(student._id); // Rollback student creation
      return res
        .status(400)
        .json({ status: "error", error: "Seat does not exist" });
    }
    if (seat.status === "booked") {
      await studentModel.findByIdAndDelete(student._id); // Rollback student creation
      return res
        .status(400)
        .json({ status: "error", error: "Seat already booked" });
    }
    seat.status = "booked";
    seat.studentId = student._id;
    await seat.save();

    res.status(201).json({ success: "true", message: "Admission Done." });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: "false", message: "Internal Server Error" });
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
    const { id } = req.body;
    const student = await studentModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json({ success: "true", student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.body;
    await studentModel.findByIdAndDelete(id);
    await seatModel.findOneAndUpdate(
      { studentId: id },
      { status: "available", studentId: null }
    );
    res.status(200).json({ success: true, message: "Student Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// const seatcount = async (req, res) => {
//   try {
//     const students = await studentModel.find({});
//     const totalSeats = 60;
//     const seats = {
//       roomA: { morning: [], evening: [], full: [], total: 14 },
//       roomB: { morning: [], evening: [], full: [], total: 14 },
//       roomC: { morning: [], evening: [], full: [], total: 12 },
//       roomD: { morning: [], evening: [], full: [], total: 14 },
//       roomE: { morning: [], evening: [], full: [], total: 6 },
//     };
//     students.map((student) => {
//       const shift = student.shift.split(" ")[0].toLowerCase();
//       const room = student.seatNo.split("-")[0];
//       const seat = student.seatNo.split("-")[1];
//       // console.log(shift, room, seat);
//       if (room == "A") {
//         seats.roomA[shift].push(seat);
//       } else if (room == "B") {
//         seats.roomB[shift].push(seat);
//       } else if (room == "C") {
//         seats.roomB[shift].push(seat);
//       } else if (room == "D") {
//         seats.roomB[shift].push(seat);
//       } else if (room == "E") {
//         seats.roomB[shift].push(seat);
//       }
//     });
//     res.json({ success: true, seats });
//   } catch (error) {
//     console.log(error);
//     res
//       .status(500)
//       .json({ success: "false", message: "Internal Server Error" });
//   }
// };

export {
  admission,
  getAllStudent,
  getStudentbyId,
  updateStudent,
  deleteStudent,
};
