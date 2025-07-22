import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  libraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "admin",
    required: true,
  },
});

const shiftModel = mongoose.models.shift || mongoose.model("shift", shiftSchema);

export default shiftModel; 