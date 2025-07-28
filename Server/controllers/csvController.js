import { Parser } from "@json2csv/plainjs";
import studentModel from "../models/student.model.js";

const csvExportStudentData = async (req, res) => {
  try {
    const libraryId = req.libraryId;
    const students = await studentModel
      .find({ libraryId })
      .sort({ createdAt: -1 });

    // Prepare student data for CSV
    const studentData = students.map((student) => {
      return {
        StudentName: student.studentName || "",
        FatherName: student.fatherName || "",
        Phone: student.phone || "",
        LocalAdd: student.localAdd || "",
        PermanentAdd: student.permanentAdd || "",
        Room: student.room || "",
        Shift: student.shift || "",
        SeatNo: student.seatNo || "",
        Amount: student.amount || "",
        DueDate: student.dueDate
          ? new Date(student.dueDate).toLocaleDateString("en-GB")
          : "",
      };
    });

    // CSV Heading
    const fields = [
      "StudentName",
      "FatherName",
      "Phone",
      "LocalAdd",
      "PermanentAdd",
      "Room",
      "Shift",
      "SeatNo",
      "Amount",
      "DueDate",
    ];

    const parser = new Parser({ fields });
    const csvData = parser.parse(studentData);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment: filename=studentData.csv"
    );
    res.status(200);
    res.end(csvData);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ success: false, message: "Failed to download CSV data." });
    }
  }
};

export { csvExportStudentData };
