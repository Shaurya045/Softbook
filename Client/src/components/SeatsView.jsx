import React, { useEffect, useState, useContext } from "react";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import axios from "axios";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function SeatsView() {
  const { rooms, shifts, seatData, token, backendURL, loadSeatData } =
    useContext(Context);

  const [room, setRoom] = useState(rooms[0] || "");
  const [shift, setShift] = useState(capitalize(shifts[0]) || "");
  const [filterSeats, setFilterSeats] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteID, setDeleteID] = useState("");

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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${backendURL}seat/deleteseat`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: deleteID },
      });
      await loadSeatData();

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      setDeleteID("");
      setDeleteShow(false);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
      setDeleteID("");
      setDeleteShow(false);
      await loadSeatData();
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {deleteShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] w-full h-full overflow-y-auto px-6 pt-10 pb-10">
          <div className="bg-[#374151] p-4 sm:p-6 w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl h-auto flex flex-col items-center justify-center gap-6 rounded-xl mx-2">
            <p className="text-[18px] sm:text-[20px] font-semibold text-center break-words">
              Do You Want to Delete SeatNo.
              {filterSeats.find((item) => item._id === deleteID)?.seatNo ||
                ""}{" "}
              of room{" "}
              {filterSeats.find((item) => item._id === deleteID)?.room || ""}{" "}
              and shift{" "}
              {filterSeats.find((item) => item._id === deleteID)?.shift || ""}?
            </p>
            <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-4 sm:gap-5">
              <button
                onClick={() => {
                  setDeleteShow(false);
                  setDeleteID("");
                }}
                className="bg-[#EF4444] p-2 sm:p-[10px] text-white text-[18px] sm:text-[20px] font-semibold rounded-[10px] w-full sm:w-1/2 cursor-pointer self-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-[#477CBF] p-2 sm:p-[10px] text-white text-[18px] sm:text-[20px] font-semibold rounded-[10px] w-full sm:w-1/2 cursor-pointer self-center"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div className="bg-[#1F2937] rounded-lg w-full flex flex-col p-6 sm:p-7 gap-5 ">
        <div
          onClick={() => setIsEdit((prev) => !prev)}
          className={`${
            isEdit ? "bg-[#477CBF]" : "bg-[#374151]"
          } self-end px-6 py-1 text-[18px] cursor-pointer rounded-2xl `}
        >
          Edit
        </div>
        <div className="flex items-center justify-center sm:justify-start flex-wrap gap-7 sm:gap-9  ">
          {filterSeats.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (isEdit) {
                  setDeleteID(item._id);
                  setDeleteShow(true);
                }
              }}
              className={`${
                item.status === "booked" ? "bg-[#EF4444]" : ""
              } w-12 h-12 p-4 border-[1px] border-white flex items-center justify-center rounded-lg `}
            >
              {item.seatNo}
            </div>
          ))}
        </div>
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
