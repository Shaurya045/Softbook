import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose.connect(`${process.env.MONGO_URI}/pratap-library`).then(() => {
    console.log("Database connected.");
  });
};
