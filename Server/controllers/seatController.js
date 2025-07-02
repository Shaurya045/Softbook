import seatModel from "../models/seat.model.js";

const addSeat = async (req, res) => {
  try {
    const { room, shift, seatNo, libraryId } = req.body;
    const seatExists = await seatModel.findOne({
      room,
      shift,
      seatNo,
      libraryId,
    });
    if (seatExists) {
      return res
        .status(400)
        .json({ success: false, message: "Seat already exists" });
    }
    const newSeat = new seatModel({
      room,
      shift,
      seatNo,
      libraryId,
    });
    await newSeat.save();
    res.status(201).json({ success: true, message: "Seat added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const allSeats = async (req, res) => {
  try {
    const seats = await seatModel.find().populate("libraryId");
    res.status(200).json({ success: true, seats });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { addSeat, allSeats };
