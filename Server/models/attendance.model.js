import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "student", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["present", "absent"], default: "present" },
  markedBy: { type: String, enum: ["student", "admin"], default: "student" },
});

const attendanceModel = mongoose.model("attendance", attendanceSchema);
export default attendanceModel; 