import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "student", required: true },
  libraryId: { type: mongoose.Schema.Types.ObjectId, ref: "admin", required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMode: { type: String, required: true },
  type: { type: String, enum: ["admission", "renewal"], required: true },
  remarks: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" }
}, { timestamps: true });

export default mongoose.model("payment", paymentSchema); 