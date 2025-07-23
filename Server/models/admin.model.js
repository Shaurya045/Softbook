import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    libraryName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: false,
      },
    },
    subscription: {
      active: { type: Boolean, default: false },
      plan: { type: String, default: "expired" },
      expiresAt: { type: Date, default: null },
    },
  },
  { minimize: false, timestamps: true }
);

const adminModel =
  mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;
