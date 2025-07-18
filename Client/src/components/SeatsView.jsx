import React, { useEffect, useState, useContext } from "react";
import { Context } from "../context/Context";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function SeatsView() {
  const { rooms, shifts, seatData } = useContext(Context);

  const [room, setRoom] = useState(rooms[0] || "");
  const [shift, setShift] = useState(capitalize(shifts[0]) || "");
  const [filterSeats, setFilterSeats] = useState([]);

  useEffect(() => {
    if (rooms.length > 0) {
      setRoom((prev) => (rooms.includes(prev) ? prev : rooms[0]));
    }
    if (shifts.length > 0) {
      setShift((prev) =>
        shifts.map(capitalize).includes(prev) ? prev : capitalize(shifts[0])
      );
    }
  }, [rooms, shifts]);

  useEffect(() => {
    // console.log(seatData);
    const filter = seatData.filter(
      (item) => item.room === room && item.shift === shift
    );
    setFilterSeats(filter);
  }, [room, shift, seatData]);

  const totalSeats = filterSeats.length;
  const occupiedSeats = filterSeats.filter(
    (item) => item.status === "booked"
  ).length;
  const availableSeats = filterSeats.filter(
    (item) => item.status === "available"
  ).length;

  // Get counts for all rooms and all shifts
  // const roomCounts = useMemo(() => {
  //   const counts = {};
  //   rooms.forEach((r) => {
  //     counts[r] = seatData.filter((item) => item.room === r).length;
  //   });
  //   return counts;
  // }, [rooms]);

  // const shiftCounts = useMemo(() => {
  //   const counts = {};
  //   shifts.forEach((s) => {
  //     counts[capitalize(s)] = seatData.filter(
  //       (item) => item.shift === s
  //     ).length;
  //   });
  //   return counts;
  // }, [shifts]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-5 md:gap-2">
        {/* Room Selection */}
        <div className="flex items-center justify-between bg-[#374151] w-full md:w-[340px] px-3 py-2 rounded-lg ">
          <label
            className="text-[14px] font-medium text-[#BBD3EE] "
            htmlFor="room-select"
          >
            Select Room
          </label>
          <select
            id="room-select"
            className="bg-[#374151] text-white px-6  rounded-lg focus:outline-none "
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            {rooms.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        {/* Shift Selection */}
        <div className="flex items-center justify-between bg-[#374151] w-full md:w-[340px] px-3 py-2 rounded-lg ">
          <label
            className="text-[14px] font-medium text-[#BBD3EE] "
            htmlFor="shift-select"
          >
            Select Shift
          </label>
          <select
            id="shift-select"
            className="bg-[#374151] text-white px-6 rounded-lg focus:outline-none "
            value={shift}
            onChange={(e) => setShift(e.target.value)}
          >
            {shifts.map((s) => (
              <option key={s} value={capitalize(s)}>
                {capitalize(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#1F2937] flex items-center justify-center sm:justify-start flex-wrap gap-7 sm:gap-9 p-6 sm:p-8 rounded-lg ">
        {filterSeats.map((item, index) => (
          <div
            key={index}
            className={`${
              item.status === "booked" ? "bg-[#EF4444]" : ""
            } w-12 h-12 p-4 border-[1px] border-white flex items-center justify-center rounded-lg `}
          >
            {item.seatNo}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1F2937] border-[1px] border-[#83ABDB] rounded-lg px-8 py-2 min-w-[140px] w-full">
          <p className="text-[16px] sm:text-[18px] font-medium text-[#989FAB] text-center">
            Total Seats
          </p>
          <h2 className="text-[32px] sm:text-[40px] font-normal text-center">
            {totalSeats}
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1F2937] border-[1px] border-[#83ABDB] rounded-lg px-8 py-2 min-w-[140px] w-full">
          <p className="text-[16px] sm:text-[18px] font-medium text-[#989FAB] text-center">
            Seats Occupied
          </p>
          <h2 className="text-[32px] sm:text-[40px] font-normal text-[#EF4444] text-center">
            {occupiedSeats}
          </h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center bg-[#1F2937] border-[1px] border-[#83ABDB] rounded-lg px-8 py-2 min-w-[140px] w-full">
          <p className="text-[16px] sm:text-[18px] font-medium text-[#989FAB] text-center">
            Seats Available
          </p>
          <h2 className="text-[32px] sm:text-[40px] font-normal text-[#4BDE80] text-center">
            {availableSeats}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default SeatsView;
