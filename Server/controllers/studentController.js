import attendanceModel from "../models/attendance.model.js";
import seatModel from "../models/seat.model.js";
import studentModel from "../models/student.model.js";
import { v2 as cloudinary } from "cloudinary";
import studentAuthModel from "../models/studentAuth.model.js";
import paymentModel from "../models/payment.model.js";

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
    // --- OVERLAP LOGIC START ---
    // Find all seats for the same room and seatNo (any status)
    const allSeats = await seatModel.find({
      room,
      seatNo,
      libraryId
    });

    // Parse requested shift's startTime and endTime from shift string
    let reqStartTime = null, reqEndTime = null;
    const match = shift.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
    if (match) {
      reqStartTime = match[1];
      reqEndTime = match[2];
    } else {
      return res.status(400).json({ status: "error", error: "Shift format invalid. Must include time range in format (HH:MM - HH:MM)" });
    }

    function timeToMinutes(timeStr) {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    }
    function isOverlap(aStart, aEnd, bStart, bEnd) {
      return timeToMinutes(aStart) < timeToMinutes(bEnd) && timeToMinutes(bStart) < timeToMinutes(aEnd);
    }

    // Check for overlap and set status
    let foundSeat = null;
    for (const s of allSeats) {
      // If this is the seat for the requested shift, remember it
      if (s.shift === shift) {
        foundSeat = s;
      }
      // If seat has no start/end time, skip overlap logic for it
      if (!s.startTime || !s.endTime) continue;
      // If seat is already booked, check for overlap
      if (s.status === "booked") {
        if (isOverlap(reqStartTime, reqEndTime, s.startTime, s.endTime)) {
          return res.status(400).json({ status: "error", error: `Seat already booked for overlapping shift (${s.shift})` });
        }
      }
    }
    if (!foundSeat) {
      return res.status(400).json({ status: "error", error: "Seat does not exist for this shift" });
    }
    if (foundSeat.status === "booked") {
      return res.status(400).json({ status: "error", error: "Seat already booked" });
    }
    // --- OVERLAP LOGIC END ---

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

    // Create payment record for admission
    await paymentModel.create({
      studentId: student._id,
      libraryId,
      amount,
      paymentDate: new Date(),
      paymentMode,
      type: "admission",
      createdBy: req.adminId || null, // If you track which admin did the admission
    });

    // Only after student is created, update seat status and save
    foundSeat.status = "booked";
    foundSeat.studentId = student._id;
    await foundSeat.save();

    // Set all other overlapping seats to unavailable
    for (const s of allSeats) {
      if (s._id.equals(foundSeat._id)) continue;
      if (!s.startTime || !s.endTime) continue;
      if (isOverlap(reqStartTime, reqEndTime, s.startTime, s.endTime)) {
        if (s.status !== "booked") {
          s.status = "unavailable";
          s.studentId = null;
          await s.save();
        }
      }
    }

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
    const { id, room, shift, seatNo, duration, amount, paymentMode, dueDate } = req.body;
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
    let isRenewal = false;

    // Handle room, shift, seatNo updates
    if (room !== undefined) updates.room = room;
    if (shift !== undefined) updates.shift = shift;
    if (seatNo !== undefined) updates.seatNo = seatNo;

    // If duration is sent, treat as renewal and update dueDate accordingly
    if (duration !== undefined) {
      updates.duration = duration;
      let due = student.dueDate ? new Date(student.dueDate) : new Date();
      due.setMonth(due.getMonth() + Number(duration));
      updates.dueDate = due;
      isRenewal = true;
    }

    // If amount is sent, treat as renewal
    if (amount !== undefined) {
      updates.amount = amount;
      isRenewal = true;
    }

    // If dueDate is sent (and duration is not), allow direct dueDate update
    if (dueDate !== undefined && duration === undefined) {
      updates.dueDate = new Date(dueDate);
      // Do not set isRenewal, do not create payment, do not update seat
    }

    // Only update seat if seat data is provided and is actually being changed
    if (
      room !== undefined &&
      shift !== undefined &&
      seatNo !== undefined &&
      !(dueDate !== undefined && duration === undefined) // If only dueDate is being updated, skip seat logic
    ) {
      const isSeatChanged =
        student.room !== room ||
        student.shift !== shift ||
        String(student.seatNo) !== String(seatNo);

      if (isSeatChanged) {
        // --- OVERLAP LOGIC START ---

        // Parse requested shift's startTime and endTime from shift string
        let reqStartTime = null, reqEndTime = null;
        const match = shift.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
        if (match) {
          reqStartTime = match[1];
          reqEndTime = match[2];
        } else {
          return res.status(400).json({ success: false, message: "Shift format invalid. Must include time range in format (HH:MM - HH:MM)" });
        }
        function timeToMinutes(timeStr) {
          const [h, m] = timeStr.split(":").map(Number);
          return h * 60 + m;
        }
        function isOverlap(aStart, aEnd, bStart, bEnd) {
          return timeToMinutes(aStart) < timeToMinutes(bEnd) && timeToMinutes(bStart) < timeToMinutes(aEnd);
        }

        // 1. Free previous seat for the current student for the current shift and all overlapped shifts
        if (student.room && student.seatNo && student.shift) {
          // Find all seats for the previous room/seatNo in this library
          const prevAllSeats = await seatModel.find({
            room: student.room,
            seatNo: student.seatNo,
            libraryId: student.libraryId
          });

          // Parse previous shift's startTime and endTime
          let prevStartTime = null, prevEndTime = null;
          const prevMatch = student.shift.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
          if (prevMatch) {
            prevStartTime = prevMatch[1];
            prevEndTime = prevMatch[2];
          }

          for (const s of prevAllSeats) {
            // Free the seat for the current student for the previous shift and all overlapped shifts
            if (!s.startTime || !s.endTime) continue;
            if (
              (s.shift === student.shift) ||
              (prevStartTime && prevEndTime && isOverlap(prevStartTime, prevEndTime, s.startTime, s.endTime))
            ) {
              if (String(s.studentId) === String(id)) {
                s.status = "available";
                s.studentId = null;
                await s.save();
              }
              // If seat was previously unavailable due to overlap, make it available now
              if (s.status === "unavailable" && (!s.studentId || String(s.studentId) === String(id))) {
                s.status = "available";
                s.studentId = null;
                await s.save();
              }
            }
          }
        }

        // 2. Check for overlap and assign new seat
        // Find all seats for the new room/seatNo in this library
        const allSeats = await seatModel.find({
          room,
          seatNo,
          libraryId: student.libraryId
        });

        let foundSeat = null;
        for (const s of allSeats) {
          if (s.shift === shift) {
            foundSeat = s;
          }
          if (!s.startTime || !s.endTime) continue;
          if (s.status === "booked" && String(s.studentId) !== String(id)) {
            if (isOverlap(reqStartTime, reqEndTime, s.startTime, s.endTime)) {
              return res.status(400).json({ success: false, message: `Seat already booked for overlapping shift (${s.shift})` });
            }
          }
        }
        if (!foundSeat) {
          return res.status(400).json({ success: false, message: "Seat does not exist for this shift" });
        }
        if (foundSeat.status === "booked" && String(foundSeat.studentId) !== String(id)) {
          return res.status(400).json({ success: false, message: "Seat already booked" });
        }

        // Assign the seat to the student
        foundSeat.status = "booked";
        foundSeat.studentId = id;
        await foundSeat.save();

        // 3. Set all other overlapping seats to unavailable (except the one just booked)
        for (const s of allSeats) {
          if (s._id.equals(foundSeat._id)) continue;
          if (!s.startTime || !s.endTime) continue;
          if (isOverlap(reqStartTime, reqEndTime, s.startTime, s.endTime)) {
            if (s.status !== "booked") {
              s.status = "unavailable";
              s.studentId = null;
              await s.save();
            }
          }
        }

        isRenewal = true;
        // --- OVERLAP LOGIC END ---
      }
      // If seat is not changed, do nothing regarding seat assignment
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    // Create payment record for renewal if relevant fields were updated
    if (isRenewal && amount !== undefined && paymentMode !== undefined) {
      await paymentModel.create({
        studentId: updatedStudent._id,
        libraryId: updatedStudent.libraryId,
        amount,
        paymentDate: new Date(),
        paymentMode,
        type: "renewal",
        createdBy: req.adminId || null,
      });
    }

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
      if (imagePublicId) {
        try {
          await cloudinary.uploader.destroy(imagePublicId);
        } catch (err) {
          console.log("Error deleting student image from Cloudinary:", err);
        }
      }
    }

    // Delete student idUpload from Cloudinary
    if (student.idUpload) {
      const idUploadPublicId = getCloudinaryPublicId(student.idUpload);
      if (idUploadPublicId) {
        try {
          await cloudinary.uploader.destroy(idUploadPublicId);
        } catch (err) {
          console.log("Error deleting student idUpload from Cloudinary:", err);
        }
      }
    }

    // --- Overlapping seat logic for deletion ---

    // Find the seat that was booked by this student
    const bookedSeat = await seatModel.findOne({ studentId: id, status: "booked" });

    if (bookedSeat) {
      // Set the booked seat to available
      bookedSeat.status = "available";
      bookedSeat.studentId = null;
      await bookedSeat.save();

      // Now, set all overlapping seats (with same seatNo, room, library, but different shift) that are unavailable to available
      // We need to find all seats with the same seatNo, room, libraryId, but different shift, and overlapping time
      // For this, we need to check for time overlap

      // Helper function to check overlap
      function isOverlap(startA, endA, startB, endB) {
        if (!startA || !endA || !startB || !endB) return false;
        return (
          (startA <= endB && endA >= startB)
        );
      }

      // Get all seats with same seatNo, room, libraryId, but not the one just made available
      const allSeats = await seatModel.find({
        seatNo: bookedSeat.seatNo,
        room: bookedSeat.room,
        libraryId: bookedSeat.libraryId,
        _id: { $ne: bookedSeat._id }
      });

      // Use the time range of the seat that was just made available
      const refStart = bookedSeat.startTime;
      const refEnd = bookedSeat.endTime;

      for (const s of allSeats) {
        if (!s.startTime || !s.endTime) continue;
        if (isOverlap(refStart, refEnd, s.startTime, s.endTime)) {
          if (s.status === "unavailable") {
            s.status = "available";
            s.studentId = null;
            await s.save();
          }
        }
      }
    } else {
      // If no booked seat found, still try to set any unavailable seats for this student to available
      await seatModel.updateMany(
        { studentId: id, status: "unavailable" },
        { status: "available", studentId: null }
      );
    }

    // --- End overlapping seat logic ---

    await studentModel.findByIdAndDelete(id);

    await attendanceModel.deleteMany({ student: id });

    await studentAuthModel.findOneAndDelete({ student: id });

    // Delete all payment records for this student
    await paymentModel.deleteMany({ studentId: id });

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
