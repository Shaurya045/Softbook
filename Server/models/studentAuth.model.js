import mongoose from "mongoose";

const studentAuthSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
      unique: true,
    },
    phone: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Add compound unique index for phone and student
studentAuthSchema.index({ phone: 1, student: 1 }, { unique: true });

const studentAuthModel = mongoose.model("studentAuth", studentAuthSchema);
export default studentAuthModel;
