import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    localAdd: {
      type: String,
      required: true,
    },
    permanentAdd: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    shift: {
      type: String,
      required: true,
    },
    seatNo: {
      type: Number,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    idProof: {
      type: String,
      required: true,
    },
    idUpload: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    libraryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
  },
  { minimize: false }
);

const studentModel =
  mongoose.models.student || mongoose.model("student", studentSchema);
export default studentModel;
