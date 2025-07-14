import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
    },
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent"], default: "present" },
    markedBy: { type: String, enum: ["student", "admin"], default: "student" },
    libraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add unique compound index to prevent duplicate attendance for same student and date
attendanceSchema.index({ student: 1, date: 1 }, { unique: true });

const attendanceModel = mongoose.model("attendance", attendanceSchema);
export default attendanceModel;
