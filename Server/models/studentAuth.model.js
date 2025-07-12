import mongoose from "mongoose";

const studentAuthSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "student",
      required: true,
      unique: true,
    },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const studentAuthModel = mongoose.model("studentAuth", studentAuthSchema);
export default studentAuthModel;
