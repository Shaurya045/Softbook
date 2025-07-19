import mongoose from "mongoose";

const bookedSeatSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ["available", "booked", "unavailable"],
    default: "available",
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    default: null,
  },
  // bookedSeats: {
  //   type: Array,
  //   default: [],
  // },
});

const seatModel =
  mongoose.models.seat || mongoose.model("seat", bookedSeatSchema);

export default seatModel;
