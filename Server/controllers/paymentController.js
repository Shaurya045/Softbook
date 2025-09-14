import paymentModel from "../models/payment.model.js";
import studentModel from "../models/student.model.js";

// admin use
const getPayments = async (req, res) => {
  try {
    const libraryId = req.libraryId;
    const payments = await paymentModel.find({ libraryId });
    res.status(200).json({
      success: true,
      message: "Payments retrieved successfully",
      payments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const income = async (req, res) => {
  try {
    const libraryId = req.libraryId;
    const payments = await paymentModel
      .find({ libraryId })
      .populate("studentId", "duration dueDate");

    let totalIncome = 0;
    let last30DaysIncome = 0;

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 30);
    startDate.setHours(0, 0, 0, 0);

    payments.forEach((payment) => {
      const student = payment.studentId;
      totalIncome += Number(payment.amount) || 0;

      let actualPaymentDate;

      // Use the new payment model fields for accurate calculation
      if (payment.validFrom) {
        // Use validFrom from the payment record (most accurate)
        actualPaymentDate = new Date(payment.validFrom);
      } else if (payment.type === "admission") {
        // Fallback for admission: use payment date
        actualPaymentDate = new Date(payment.paymentDate);
      } else if (payment.type === "renewal" && student?.duration) {
        // Fallback for renewal: calculate from dueDate - duration
        const dueDate = new Date(student.dueDate);
        actualPaymentDate = new Date(dueDate);
        actualPaymentDate.setMonth(
          actualPaymentDate.getMonth() - student.duration
        );
      } else {
        // Final fallback: use paymentDate
        actualPaymentDate = new Date(payment.paymentDate);
      }

      // Check if payment falls within last 30 days
      const isInLast30Days =
        actualPaymentDate >= startDate && actualPaymentDate <= today;

      if (isInLast30Days) {
        last30DaysIncome += Number(payment.amount) || 0;
      }
    });

    res.json({
      success: true,
      totalIncome,
      last30DaysIncome,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { getPayments, income };
