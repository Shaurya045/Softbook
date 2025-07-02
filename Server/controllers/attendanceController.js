import attendanceModel from "../models/attendance.model.js";
import studentModel from "../models/student.model.js";
import adminModel from "../models/admin.model.js";

// Helper: Haversine formula
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of the earth in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

// Student marks attendance
const markAttendance = async (req, res) => {
  try {
    const studentId = req.body.studentId;
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "Location required." });
    }
    // Get student and their study center (admin)
    const student = await studentModel.findById(studentId);
    const admin = await adminModel.findById(student.libraryId);
    if (!admin.location || !admin.location.coordinates) {
      return res.status(400).json({ success: false, message: "Study center location not set." });
    }
    const [centerLng, centerLat] = admin.location.coordinates;
    const distance = getDistanceFromLatLonInMeters(lat, lng, centerLat, centerLng);
    if (distance > 100) { // 100 meters radius
      return res.status(400).json({ success: false, message: "You are not at the study center location." });
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Check if already marked
    const alreadyMarked = await attendanceModel.findOne({ student: studentId, date: today });
    if (alreadyMarked) {
      return res.status(400).json({ success: false, message: "Attendance already marked for today." });
    }
    await attendanceModel.create({
      student: studentId,
      date: today,
      status: "present",
      markedBy: "student",
    });
    res.status(201).json({ success: true, message: "Attendance marked successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Student views their own attendance
const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.body.studentId;
    const attendance = await attendanceModel.find({ student: studentId }).sort({ date: -1 });
    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Admin views attendance for a student or all students
const getAdminAttendance = async (req, res) => {
  try {
    const { studentId, date } = req.query;
    let filter = {};
    if (studentId) filter.student = studentId;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      filter.date = d;
    }
    const attendance = await attendanceModel.find(filter).populate("student").sort({ date: -1 });
    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { markAttendance, getStudentAttendance, getAdminAttendance }; 