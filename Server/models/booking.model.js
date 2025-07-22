import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  seatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seat",
    required: true,
  },
  shiftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "shift",
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "booked", "unavailable"],
    default: "available",
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    default: null,
  },
  date: {
    type: Date,
    default: null, // Optional: for per-day bookings
  },
});

const bookingModel = mongoose.models.booking || mongoose.model("booking", bookingSchema);

export default bookingModel; 