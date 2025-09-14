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

      if (student?.dueDate && student?.duration) {
        // reconstruct actual payment date
        const dueDate = new Date(student.dueDate);
        const actualPaymentDate = new Date(dueDate);
        actualPaymentDate.setMonth(
          actualPaymentDate.getMonth() - student.duration
        );

        if (actualPaymentDate >= startDate && actualPaymentDate <= today) {
          last30DaysIncome += Number(payment.amount) || 0;
        }
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
