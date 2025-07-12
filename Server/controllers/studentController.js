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

    // Check required conditions BEFORE uploading files or creating student
    if (!libraryId) {
      return res
        .status(400)
        .json({ success: false, message: "libraryId is required." });
    }

    const existingStudent = await studentModel.findOne({ phone, libraryId });
    if (existingStudent) {
      return res
        .status(400)
        .json({ success: "false", message: "Student already exists." });
    }

    // Check seat availability before proceeding
    const seat = await seatModel.findOne({
      room,
      shift,
      seatNo,
      libraryId,
    });
    if (!seat) {
      return res
        .status(400)
        .json({ status: "error", error: "Seat does not exist" });
    }
    if (seat.status === "booked") {
      return res
        .status(400)
        .json({ status: "error", error: "Seat already booked" });
    }

    // Now upload files to Cloudinary after all checks pass
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

    let due;
    if (dueDate) {
      due = dueDate;
    } else {
      const now = new Date();
      due = new Date(now.setMonth(now.getMonth() + Number(duration || 1)));
    }

    // Create student only after all checks and uploads
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

    // Only after student is created, update seat status and save
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
    const libraryId = req.libraryId;
    const students = await studentModel.find({ libraryId });
    res.status(201).json({ success: "true", students });
  } catch (error) {
    console.log(error);
    res
      .status(500)
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
    const { id, room, shift, seatNo, duration, amount } = req.body;
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
    if (amount !== undefined) updates.amount = amount;

    // Only update seat if seat data is provided
    // Only update seat assignment if the seat, room, or shift is actually being changed
    if (room && shift && seatNo) {
      // Check if the seat assignment is actually changing
      const isSeatChanged =
        student.room !== room ||
        student.shift !== shift ||
        String(student.seatNo) !== String(seatNo);

      if (isSeatChanged) {
        // Book new seat: check if seat exists and is available or already assigned to this student
        const seat = await seatModel.findOne({ room, shift, seatNo });
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

        // Free previous seat only after checks
        await seatModel.findOneAndUpdate(
          { studentId: id },
          { status: "available", studentId: null }
        );

        seat.status = "booked";
        seat.studentId = id;
        await seat.save();
      }
      // If seat is not changed, do nothing regarding seat assignment
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

    // Delete student image from Cloudinary
    if (student.image) {
      const imagePublicId = getCloudinaryPublicId(student.image);
      // console.log("image", imagePublicId);
      if (imagePublicId) {
        try {
          const result = await cloudinary.uploader.destroy(imagePublicId);
          // console.log("Cloudinary destroy image result:", result);
        } catch (err) {
          console.log("Error deleting student image from Cloudinary:", err);
        }
      }
    }

    // Delete student idUpload from Cloudinary
    if (student.idUpload) {
      const idUploadPublicId = getCloudinaryPublicId(student.idUpload);
      // console.log("id", idUploadPublicId);
      if (idUploadPublicId) {
        try {
          const result = await cloudinary.uploader.destroy(idUploadPublicId);
          // console.log("Cloudinary destroy idUpload result:", result);
        } catch (err) {
          console.log("Error deleting student idUpload from Cloudinary:", err);
        }
      }
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
