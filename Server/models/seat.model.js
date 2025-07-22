import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  seatNo: {
    type: Number,
    required: true,
  },
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
});

const seatModel = mongoose.models.seat || mongoose.model("seat", seatSchema);

export default seatModel;
