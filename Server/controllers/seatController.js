import seatModel from "../models/seat.model.js";
import shiftModel from "../models/shift.model.js";
import bookingModel from "../models/booking.model.js";

// Add seats (no shift info)
const addSeat = async (req, res) => {
  try {
    const { room, seatNo, libraryId } = req.body;
    // Find the highest seatNo for this room and libraryId combination
    const highestSeat = await seatModel
      .findOne({ room, libraryId })
      .sort({ seatNo: -1 });
    const startingSeatNo = highestSeat ? highestSeat.seatNo + 1 : 1;
    const seatsToCreate = [];
    for (let i = 0; i < seatNo; i++) {
      const newSeatNo = startingSeatNo + i;
      const seatExists = await seatModel.findOne({
        room,
        seatNo: newSeatNo,
        libraryId,
      });
      if (!seatExists) {
        seatsToCreate.push({
          room,
          seatNo: newSeatNo,
          libraryId,
        });
      }
    }
    if (seatsToCreate.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "All seats already exist" });
    }
    await seatModel.insertMany(seatsToCreate);
    res.status(201).json({
      success: true,
      message: `${seatsToCreate.length} seats added successfully`,
      seatsAdded: seatsToCreate.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const allSeats = async (req, res) => {
  try {
    const libraryId = req.libraryId;
    const seats = await seatModel.find({ libraryId }).sort({ seatNo: 1 });
    res.status(200).json({ success: true, seats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteSeat = async (req, res) => {
  try {
    const { id, ids, room, seatNo, libraryId } = req.body;

    // Helper to get seat(s) by id or by room/seatNo/libraryId
    const getSeats = async () => {
      if (id) {
        const seat = await seatModel.findById(id);
        return seat ? [seat] : [];
      }
      if (Array.isArray(ids) && ids.length > 0) {
        return await seatModel.find({ _id: { $in: ids } });
      }
      if (room && seatNo && libraryId) {
        const seat = await seatModel.findOne({ room, seatNo, libraryId });
        return seat ? [seat] : [];
      }
      return [];
    };

    // Helper to check if seat is booked or unavailable in any shift
    const isSeatBookedOrUnavailable = async (seat) => {
      // Check for bookings
      const bookingExists = await bookingModel.exists({
        seatId: seat._id,
        status: { $in: ["active", "booked"] }, // adjust status as per your schema
      });
      if (bookingExists) return true;

      // Check for unavailable status in any shift
      // If seat.status is per shift, you may need to check seat.statuses or similar
      // Here, assuming seat.statuses is an array of { shiftId, status }
      if (Array.isArray(seat.statuses)) {
        if (
          seat.statuses.some(
            (s) => s.status === "booked" || s.status === "unavailable"
          )
        ) {
          return true;
        }
      } else if (seat.status === "booked" || seat.status === "unavailable") {
        // fallback if seat.status is global
        return true;
      }
      return false;
    };

    const seats = await getSeats();

    if (seats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Seat(s) not found for deletion.",
      });
    }

    // Check all seats for booking or unavailable status
    for (const seat of seats) {
      if (await isSeatBookedOrUnavailable(seat)) {
        return res.status(400).json({
          success: false,
          message: `Seat ${
            seat.seatNo || seat._id
          } cannot be deleted because it is booked or unavailable.`,
        });
      }
    }

    // Proceed to delete
    if (id) {
      await seatModel.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ success: true, message: "Seat deleted successfully" });
    }
    if (Array.isArray(ids) && ids.length > 0) {
      await seatModel.deleteMany({ _id: { $in: ids } });
      return res
        .status(200)
        .json({ success: true, message: `Seats deleted successfully` });
    }
    if (room && seatNo && libraryId) {
      await seatModel.findOneAndDelete({ room, seatNo, libraryId });
      return res
        .status(200)
        .json({ success: true, message: "Seat deleted successfully" });
    }
    return res.status(400).json({
      success: false,
      message:
        "Please provide seat id, ids, or room/seatNo/libraryId to delete.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// --- Shift Management ---
const addShift = async (req, res) => {
  try {
    const { name, startTime, endTime } = req.body;
    const libraryId = req.libraryId || req.body.libraryId;
    if (!name || !startTime || !endTime || !libraryId) {
      return res.status(400).json({
        success: false,
        message: "name, startTime, endTime, and libraryId are required",
      });
    }

    // Compose the display name as "Morning (06:00 - 14:00)"
    const displayName = `${name} (${startTime} - ${endTime})`;

    // Prevent duplicate shifts with same displayName and libraryId
    const exists = await shiftModel.findOne({
      name: displayName,
      libraryId,
    });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "Shift already exists" });
    }

    // Save the shift with the displayName as name
    const shift = await shiftModel.create({
      name: displayName,
      startTime,
      endTime,
      libraryId,
    });

    res.status(201).json({
      success: true,
      message: `${displayName} shift added successfully`,
      shift,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const allShifts = async (req, res) => {
  try {
    const libraryId = req.libraryId;
    const shifts = await shiftModel.find({ libraryId });
    res.status(200).json({ success: true, shifts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteShift = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Shift id is required" });
    }

    // Check for any bookings with this shiftId
    const hasBooking = await bookingModel.exists({ shiftId: id });
    if (hasBooking) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete shift: There are bookings for this shift.",
      });
    }

    // Check for any seat with this shiftId marked as unavailable
    // Assuming seatModel has a seatStatus array or similar structure
    // If seatStatus is an array of objects: [{shiftId, status}, ...]
    const hasUnavailable = await seatModel.exists({
      seatStatus: { $elemMatch: { shiftId: id, status: "unavailable" } },
    });

    if (hasUnavailable) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete shift: There are seats marked unavailable for this shift.",
      });
    }

    // If no bookings and no unavailable seats, delete the shift
    await shiftModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Shift deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { addSeat, allSeats, deleteSeat, addShift, allShifts, deleteShift };
