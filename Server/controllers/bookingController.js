import bookingModel from "../models/booking.model.js";
import seatModel from "../models/seat.model.js";
import shiftModel from "../models/shift.model.js";

// GET /api/bookings/all?room=A&seatNo=1&shiftId=...&libraryId=...
const getAllBookings = async (req, res) => {
  try {
    const { room, seatNo, shiftId, libraryId } = req.query;
    let seatFilter = {};
    if (room) seatFilter.room = room;
    if (seatNo) seatFilter.seatNo = Number(seatNo);
    if (libraryId) seatFilter.libraryId = libraryId;
    let seatIds = [];
    if (Object.keys(seatFilter).length > 0) {
      const seats = await seatModel.find(seatFilter);
      seatIds = seats.map(s => s._id);
    }
    let filter = {};
    if (seatIds.length > 0) filter.seatId = { $in: seatIds };
    if (shiftId) filter.shiftId = shiftId;
    // If no filters, return all bookings
    const bookings = await bookingModel.find(filter);
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { getAllBookings }; 