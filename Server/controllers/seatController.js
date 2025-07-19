import seatModel from "../models/seat.model.js";

const addSeat = async (req, res) => {
  try {
    const { room, shift, seatNo, libraryId } = req.body;

    // Parse startTime and endTime from shift string
    // Example shift: 'Morning (06:00 - 14:00)'
    let startTime = null, endTime = null;
    const match = shift.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
    if (match) {
      startTime = match[1];
      endTime = match[2];
    } else {
      return res.status(400).json({ success: false, message: 'Shift format invalid. Must include time range in format (HH:MM - HH:MM)' });
    }

    // Find the highest seatNo for this room, shift, and libraryId combination
    const highestSeat = await seatModel
      .findOne({
        room,
        shift,
        libraryId,
      })
      .sort({ seatNo: -1 });

    // Calculate the starting seatNo for new seats
    const startingSeatNo = highestSeat ? highestSeat.seatNo + 1 : 1;

    // Create multiple seats based on the seatNo value from frontend
    const seatsToCreate = [];
    for (let i = 0; i < seatNo; i++) {
      const newSeatNo = startingSeatNo + i;

      // Check if this seat already exists
      const seatExists = await seatModel.findOne({
        room,
        shift,
        seatNo: newSeatNo,
        libraryId,
      });

      if (!seatExists) {
        seatsToCreate.push({
          room,
          shift,
          seatNo: newSeatNo,
          libraryId,
          status: "available",
          startTime,
          endTime
        });
      }
    }

    if (seatsToCreate.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "All seats already exist" });
    }

    // Insert all new seats
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
    // Sort by seatNo ascending
    const seats = await seatModel
      .find({ libraryId })
      .sort({ seatNo: 1 })
      .populate("libraryId");
    res.status(200).json({ success: true, seats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Controller for deleting seats
const deleteSeat = async (req, res) => {
  try {
    // Accept seat id(s) via body, query, or params
    const { id, ids, room, shift, seatNo, libraryId } = req.body;

    // Helper to check if seat is booked
    const isSeatBooked = (seat) => {
      // status: "booked" means seat is booked
      return seat && seat.status === "booked";
    };

    // Delete by seat id(s)
    if (id) {
      const seat = await seatModel.findById(id);
      if (!seat) {
        return res
          .status(404)
          .json({ success: false, message: "Seat not found" });
      }
      if (isSeatBooked(seat)) {
        return res.status(400).json({
          success: false,
          message: "Seat is booked and cannot be deleted.",
        });
      }
      await seatModel.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ success: true, message: "Seat deleted successfully" });
    }

    // Delete multiple by array of ids
    if (Array.isArray(ids) && ids.length > 0) {
      // Find all seats
      const seats = await seatModel.find({ _id: { $in: ids } });
      let bookedSeats = [];
      let unbookedIds = [];
      for (const seat of seats) {
        if (isSeatBooked(seat)) {
          bookedSeats.push(seat._id);
        } else {
          unbookedIds.push(seat._id);
        }
      }
      if (bookedSeats.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete booked seats.`,
          bookedSeats: bookedSeats,
        });
      }
      // Delete all unbooked seats
      const result = await seatModel.deleteMany({ _id: { $in: unbookedIds } });
      return res.status(200).json({
        success: true,
        message: `${result.deletedCount} seat(s) deleted successfully`,
      });
    }

    // Delete by room, shift, seatNo, libraryId (for more granular deletion)
    if (room && shift && seatNo && libraryId) {
      const seat = await seatModel.findOne({
        room,
        shift,
        seatNo,
        libraryId,
      });
      if (!seat) {
        return res
          .status(404)
          .json({ success: false, message: "Seat not found" });
      }
      if (isSeatBooked(seat)) {
        return res.status(400).json({
          success: false,
          message: "Seat is booked and cannot be deleted.",
        });
      }
      await seatModel.findOneAndDelete({
        room,
        shift,
        seatNo,
        libraryId,
      });
      return res
        .status(200)
        .json({ success: true, message: "Seat deleted successfully" });
    }

    // If not enough info provided
    return res.status(400).json({
      success: false,
      message:
        "Please provide seat id, ids, or room/shift/seatNo/libraryId to delete.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { addSeat, allSeats, deleteSeat };
