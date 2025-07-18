import paymentModel from "../models/payment.model.js";

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

export { getPayments };
