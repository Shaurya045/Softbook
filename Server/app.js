import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import StudentRouter from "./routes/studentRoute.js";
import AdminRouter from "./routes/adminRoute.js";
import SeatRouter from "./routes/seatRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import StudentAuthRouter from "./routes/studentAuthRoute.js";
import AttendanceRouter from "./routes/attendanceRoute.js";
import SuperAdminRouter from "./routes/superAdminRoute.js";

// config
config();
connectCloudinary();
const app = express();
const port = process.env.PORT || 4000;
connectDB();

// middleware
app.use(cors());
app.use(express.json());

// API Endpoints
app.use("/api/v1/students", StudentRouter);
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/seat", SeatRouter);
app.use("/api/v1/studentauth", StudentAuthRouter);
app.use("/api/v1/attendance", AttendanceRouter);
app.use("/api/v1/superadmin", SuperAdminRouter);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, "0.0.0.0", () => {
  console.log("Server is running on port: ", port);
});
