import attendanceModel from "../models/attendance.model.js";
import studentModel from "../models/student.model.js";
import adminModel from "../models/admin.model.js";

// Helper: Haversine formula
// Helper: Haversine formula (lat/lng order clarification)
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of the earth in meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
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
    if (typeof lat !== "number" || typeof lng !== "number") {
      return res
        .status(400)
        .json({ success: false, message: "Location required." });
    }
    // Get student and their study center (admin)
    const student = await studentModel.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }
    const admin = await adminModel.findById(student.libraryId);
    if (
      !admin ||
      !admin.location ||
      !Array.isArray(admin.location.coordinates)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Study center location not set." });
    }
    // GeoJSON: [lng, lat]
    const [centerLng, centerLat] = admin.location.coordinates;

    // The frontend sends lat/lng as numbers (lat, lng)
    // The database stores [lng, lat]
    // So, compare: (lat, lng) from frontend with (centerLat, centerLng) from DB

    // Fix: Ensure all values are numbers and not strings
    const userLat = Number(lat);
    const userLng = Number(lng);
    const dbLat = Number(centerLat);
    const dbLng = Number(centerLng);

    // Debug: Log values to help diagnose
    console.log("Student location (from frontend):", userLat, userLng);
    console.log("Center location (from DB):", dbLat, dbLng);

    // Calculate distance (correct order: lat, lng)
    const distance = getDistanceFromLatLonInMeters(
      userLat,
      userLng,
      dbLat,
      dbLng
    );

    // Debug: Log distance
    console.log("Distance (meters):", distance);

    const allowedRadius = 50; // meters

    if (distance > allowedRadius) {
      return res.status(400).json({
        success: false,
        message: `You are not at the study center location. Distance: ${distance.toFixed(
          2
        )} meters (allowed: ${allowedRadius}m)`,
      });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayISTMidnightUTC = today;

    // Check if already marked
    const alreadyMarked = await attendanceModel.findOne({
      student: studentId,
      date: todayISTMidnightUTC,
    });
    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for today.",
      });
    }

    await attendanceModel.create({
      student: studentId,
      date: todayISTMidnightUTC,
      status: "present",
      markedBy: "student",
      libraryId: student.libraryId, // Add libraryId to the attendance record
    });

    res
      .status(201)
      .json({ success: true, message: "Attendance marked successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Student views their own attendance
const getStudentAttendance = async (req, res) => {
  try {
    // If attendance model now requires libraryId, get it from req or token
    const studentId = req.body.studentId;
    const libraryId = req.body.libraryId || req.libraryId; // adjust as per your middleware

    // Build filter according to new model
    let filter = { student: studentId };
    if (libraryId) filter.libraryId = libraryId;

    const attendance = await attendanceModel.find(filter).sort({ date: -1 });

    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Admin views attendance for a student or all students
const getAdminAttendance = async (req, res) => {
  try {
    const libraryId = req.libraryId;
    const { studentId, date } = req.query;
    let filter = { libraryId };
    if (studentId) filter.student = studentId;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      filter.date = d;
    }
    const attendance = await attendanceModel
      .find(filter)
      .populate("student")
      .sort({ date: -1 });
    res.status(200).json({ success: true, attendance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { markAttendance, getStudentAttendance, getAdminAttendance };
