import attendanceModel from "../models/attendance.model.js";
import seatModel from "../models/seat.model.js";
import shiftModel from "../models/shift.model.js";
import bookingModel from "../models/booking.model.js";
import studentModel from "../models/student.model.js";
import { v2 as cloudinary } from "cloudinary";
import studentAuthModel from "../models/studentAuth.model.js";
import paymentModel from "../models/payment.model.js";

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}
function isOverlap(aStart, aEnd, bStart, bEnd) {
  return (
    timeToMinutes(aStart) < timeToMinutes(bEnd) &&
    timeToMinutes(bStart) < timeToMinutes(aEnd)
  );
}

const admission = async (req, res) => {
  try {
    const {
      studentName,
      fatherName,
      phone,
      localAdd,
      permanentAdd,
      room,
      shiftId,
      seatNo,
      amount,
      paymentMode,
      duration,
      dueDate,
      idProof,
    } = req.body;
    const libraryId = req.libraryId;
    if (!libraryId) {
      return res
        .status(400)
        .json({ success: false, message: "libraryId is required." });
    }
    // Check if student already exists in this library
    const existingStudent = await studentModel.findOne({ phone, libraryId });
    if (existingStudent) {
      return res
        .status(400)
        .json({ success: false, message: "Student already exists." });
    }
    // Find seat and shift
    const seat = await seatModel.findOne({ room, seatNo, libraryId });
    const shift = await shiftModel.findById(shiftId);
    if (!seat || !shift) {
      return res
        .status(400)
        .json({ success: false, message: "Seat or shift not found" });
    }
    // Check for overlap with existing bookings for this seat
    const bookings = await bookingModel.find({
      seatId: seat._id,
      status: "booked",
    });
    for (const b of bookings) {
      const bookedShift = await shiftModel.findById(b.shiftId);
      if (!bookedShift) continue;
      if (
        isOverlap(
          shift.startTime,
          shift.endTime,
          bookedShift.startTime,
          bookedShift.endTime
        )
      ) {
        return res.status(400).json({
          success: false,
          message: `Seat already booked for (${bookedShift.name}) shift, so cannot book.`,
        });
      }
    }
    // Upload files to Cloudinary after all checks pass
    let idUploadUrl = "";
    let imageUrl = "";
    if (req.files && req.files.idUpload && req.files.idUpload[0]) {
      const idUploadResult = await cloudinary.uploader.upload(
        req.files.idUpload[0].path,
        { folder: "students/idUpload" }
      );
      idUploadUrl = idUploadResult.secure_url;
    }
    if (req.files && req.files.image && req.files.image[0]) {
      const imageResult = await cloudinary.uploader.upload(
        req.files.image[0].path,
        { folder: "students/image" }
      );
      imageUrl = imageResult.secure_url;
    }
    let due = dueDate ? new Date(dueDate) : new Date();
    if (!dueDate) {
      due.setMonth(due.getMonth() + Number(duration || 1));
    }

    // Create student after all checks and uploads
    const student = await studentModel.create({
      studentName,
      fatherName,
      phone,
      localAdd,
      permanentAdd,
      room,
      shift: shift.name,
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
    const paymentDate = new Date();
    const validFrom = new Date(paymentDate);
    const validTill = new Date(paymentDate);
    validTill.setMonth(validTill.getMonth() + Number(duration || 1));
    await paymentModel.create({
      studentId: student._id,
      libraryId,
      amount,
      paymentDate,
      paymentMode,
      type: "admission",
      createdBy: libraryId || "admin",
      paidForDuration: duration,
      validFrom,
      validTill,
    });
    // 1. Create the booked booking
    await bookingModel.create({
      seatId: seat._id,
      shiftId: shift._id,
      status: "booked",
      studentId: student._id,
      libraryId,
    });
    // 2. Create unavailable bookings for all overlapping shifts
    const allShifts = await shiftModel.find({ libraryId });
    for (const s of allShifts) {
      if (s._id.equals(shift._id)) continue;
      if (isOverlap(shift.startTime, shift.endTime, s.startTime, s.endTime)) {
        // Only create if not already booked/unavailable
        const existing = await bookingModel.findOne({
          seatId: seat._id,
          shiftId: s._id,
        });
        if (!existing) {
          await bookingModel.create({
            seatId: seat._id,
            shiftId: s._id,
            status: "unavailable",
            studentId: null,
            libraryId,
          });
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
    const students = await studentModel
      .find({ libraryId })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, students });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getStudentbyId = async (req, res) => {
  try {
    const { id } = req.body;
    const student = await studentModel.findById(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateStudent = async (req, res) => {
  try {
    const {
      id,
      room,
      shiftId,
      seatNo,
      duration,
      amount,
      paymentMode,
      dueDate,
    } = req.body;
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Student id is required" });
    const student = await studentModel.findById(id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });

    const updates = {};
    let isRenewal = false;
    if (room !== undefined) updates.room = room;
    if (shiftId !== undefined) {
      const shift = await shiftModel.findById(shiftId);
      if (!shift)
        return res
          .status(400)
          .json({ success: false, message: "Shift not found" });
      updates.shift = shift.name;
    }
    if (seatNo !== undefined) updates.seatNo = seatNo;
    if (duration !== undefined) {
      updates.duration = duration;
      let due = student.dueDate ? new Date(student.dueDate) : new Date();
      due.setMonth(due.getMonth() + Number(duration));
      updates.dueDate = due;
      isRenewal = true;
    }
    if (amount !== undefined) {
      updates.amount = amount;
      isRenewal = true;
    }
    if (dueDate !== undefined && duration === undefined) {
      updates.dueDate = new Date(dueDate);

      const payments = await paymentModel
        .find({ studentId: id })
        .sort({ paymentDate: 1 });
      if (payments.length === 1) {
        const duration = student.duration || 1;
        const paymentDate = new Date(dueDate);
        paymentDate.setMonth(paymentDate.getMonth() - duration);

        const validFrom = new Date(paymentDate);
        const validTill = new Date(validFrom);
        validTill.setMonth(validTill.getMonth() + duration);

        await paymentModel.findOneAndUpdate(
          { studentId: id, type: "admission" },
          { paymentDate, validFrom, validTill }
        );
      }
    }

    // Only update booking if seat/shift is being changed
    if (
      room !== undefined &&
      shiftId !== undefined &&
      seatNo !== undefined &&
      !(dueDate !== undefined && duration === undefined)
    ) {
      // 1. Prepare new seat/shift
      const seat = await seatModel.findOne({
        room,
        seatNo,
        libraryId: student.libraryId,
      });
      const shift = await shiftModel.findById(shiftId);
      if (!seat || !shift)
        return res
          .status(400)
          .json({ success: false, message: "Seat or shift not found" });

      // 2. Check for overlap with other bookings (excluding this student's own bookings)
      const bookings = await bookingModel.find({
        seatId: seat._id,
        status: "booked",
        studentId: { $ne: id },
      });
      for (const b of bookings) {
        const bookedShift = await shiftModel.findById(b.shiftId);
        if (!bookedShift) continue;
        if (
          isOverlap(
            shift.startTime,
            shift.endTime,
            bookedShift.startTime,
            bookedShift.endTime
          )
        ) {
          return res.status(400).json({
            success: false,
            message: `Seat already booked for overlapping shift (${bookedShift.name})`,
          });
        }
      }

      // 3. If available, now delete all previous bookings for this student
      const previousBookings = await bookingModel.find({ studentId: id });
      for (const prevBooking of previousBookings) {
        const prevSeatId = prevBooking.seatId;
        const prevShift = await shiftModel.findById(prevBooking.shiftId);
        const allShifts = await shiftModel.find({
          libraryId: student.libraryId,
        });
        for (const s of allShifts) {
          if (s._id.equals(prevShift._id)) continue;
          if (
            isOverlap(
              prevShift.startTime,
              prevShift.endTime,
              s.startTime,
              s.endTime
            )
          ) {
            // If no other booked booking overlaps, remove unavailable
            const stillBooked = await bookingModel.findOne({
              seatId: prevSeatId,
              shiftId: s._id,
              status: "booked",
              studentId: { $ne: id },
            });
            if (!stillBooked) {
              await bookingModel.deleteMany({
                seatId: prevSeatId,
                shiftId: s._id,
                status: "unavailable",
              });
            }
          }
        }
      }
      await bookingModel.deleteMany({ studentId: id });

      // 4. Create new booked booking
      await bookingModel.create({
        seatId: seat._id,
        shiftId: shift._id,
        status: "booked",
        studentId: id,
        libraryId: student.libraryId,
      });

      // 5. Create unavailable bookings for all overlapping shifts
      const allShifts = await shiftModel.find({ libraryId: student.libraryId });
      for (const s of allShifts) {
        if (s._id.equals(shift._id)) continue;
        if (isOverlap(shift.startTime, shift.endTime, s.startTime, s.endTime)) {
          const existing = await bookingModel.findOne({
            seatId: seat._id,
            shiftId: s._id,
          });
          if (!existing) {
            await bookingModel.create({
              seatId: seat._id,
              shiftId: s._id,
              status: "unavailable",
              studentId: null,
              libraryId: student.libraryId,
            });
          }
        }
      }
      isRenewal = true;
    }

    const updatedStudent = await studentModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (isRenewal && amount !== undefined && paymentMode !== undefined) {
      const paymentDate = new Date();
      const validFrom = new Date(paymentDate);
      const validTill = new Date(paymentDate);
      validTill.setMonth(validTill.getMonth() + Number(duration || 1));
      await paymentModel.create({
        studentId: updatedStudent._id,
        libraryId: updatedStudent.libraryId,
        amount,
        paymentDate,
        paymentMode,
        type: "renewal",
        createdBy: updatedStudent.libraryId || null,
        paidForDuration: duration,
        validFrom,
        validTill,
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
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Student id is required" });
    const student = await studentModel.findById(id);
    if (!student)
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    // 1. Find all booked bookings for this student
    const bookings = await bookingModel.find({
      studentId: id,
      status: "booked",
    });
    for (const b of bookings) {
      const seatId = b.seatId;
      const shift = await shiftModel.findById(b.shiftId);
      if (!shift) continue;
      const allShifts = await shiftModel.find({ libraryId: student.libraryId });
      for (const s of allShifts) {
        if (s._id.equals(shift._id)) continue;
        if (isOverlap(shift.startTime, shift.endTime, s.startTime, s.endTime)) {
          // Check if any other booked booking for this seat overlaps with this shift
          const otherBookings = await bookingModel.find({
            seatId,
            status: "booked",
            studentId: { $ne: id },
          });
          let stillOverlaps = false;
          for (const ob of otherBookings) {
            const otherShift = await shiftModel.findById(ob.shiftId);
            if (
              otherShift &&
              isOverlap(
                otherShift.startTime,
                otherShift.endTime,
                s.startTime,
                s.endTime
              )
            ) {
              stillOverlaps = true;
              break;
            }
          }
          if (!stillOverlaps) {
            await bookingModel.deleteMany({
              seatId,
              shiftId: s._id,
              status: "unavailable",
            });
          }
        }
      }
    }
    await bookingModel.deleteMany({ studentId: id });

    // Helper to extract Cloudinary public id from a URL
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
    await studentModel.findByIdAndDelete(id);
    await attendanceModel.deleteMany({ student: id });
    await studentAuthModel.findOneAndDelete({ student: id });
    await paymentModel.deleteMany({ studentId: id });
    res.status(200).json({ success: true, message: "Student Deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteAllStudent = async (req, res) => {
  try {
    const libraryId = req.libraryId;
    if (!libraryId) {
      return res
        .status(400)
        .json({ success: false, message: "Library ID is required" });
    }

    // Find all students in this library
    const students = await studentModel.find({ libraryId });
    const studentIds = students.map((s) => s._id);
    if (studentIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No students found" });
    }

    // Delete all bookings for this library
    // For new data (with libraryId in booking), delete by libraryId
    // For old data (without libraryId in booking), delete by studentId
    if (studentIds.length > 0) {
      // Check if there are any bookings with this libraryId
      const bookingsWithLibraryId = await bookingModel.countDocuments({
        libraryId,
      });
      if (bookingsWithLibraryId > 0) {
        // New data: delete by libraryId
        await bookingModel.deleteMany({ libraryId });
      } else {
        // Old data: delete by studentId
        await bookingModel.deleteMany({ studentId: { $in: studentIds } });
      }
    }

    // Delete all student auths for these students
    if (studentIds.length > 0) {
      await studentAuthModel.deleteMany({ student: { $in: studentIds } });
    }

    // Delete all payments for this library
    await paymentModel.deleteMany({ libraryId });

    // Helper to extract Cloudinary public id from a URL
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

    // Delete student images and idUpload files from Cloudinary
    for (const student of students) {
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

    // Delete all students for this library
    await studentModel.deleteMany({ libraryId });

    // Delete all attendance records for this library
    await attendanceModel.deleteMany({ libraryId });

    res
      .status(200)
      .json({ success: true, message: "All Students Data Deleted" });
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
  deleteAllStudent,
};
