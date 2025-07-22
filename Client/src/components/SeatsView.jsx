import React, { useEffect, useState, useContext } from "react";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import axios from "axios";

function SeatsView() {
  const {
    rooms,
    shiftData,
    seatData,
    bookingData,
    token,
    backendURL,
    loadSeatData,
    loadShiftData,
  } = useContext(Context);

  const [room, setRoom] = useState(rooms[0] || "");
  const [shiftId, setShiftId] = useState(shiftData[0]?._id || "");
  const [filterSeats, setFilterSeats] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [deleteType, setDeleteType] = useState(""); // "seat" or "shift"

  // Keep room and shiftId in sync with context data
  useEffect(() => {
    if (rooms.length > 0) {
      setRoom((prev) => (rooms.includes(prev) ? prev : rooms[0]));
    }
    if (shiftData.length > 0) {
      setShiftId((prev) =>
        shiftData.some((s) => s._id === prev) ? prev : shiftData[0]._id
      );
    }
  }, [rooms, shiftData]);

  // When entering edit mode, set shiftId to "" so "Select Shift" is selected by default
  useEffect(() => {
    if (isEdit) {
      setShiftId("");
    } else if (shiftData.length > 0) {
      setShiftId(shiftData[0]._id);
    }
    // eslint-disable-next-line
  }, [isEdit, shiftData]);

  // Helper to get seat status for a given seatId and shiftId
  const getSeatStatus = (seatId, shiftId) => {
    // Find booking for this seat and shift
    const booking = bookingData.find(
      (b) => b.seatId === seatId && b.shiftId === shiftId
    );
    if (booking) {
      if (booking.status === "booked") return "booked";
      if (booking.status === "unavailable") return "unavailable";
    }
    return "available";
  };

  // Filter seats by selected room
  useEffect(() => {
    const filtered = seatData.filter((item) => item.room === room);
    setFilterSeats(filtered);
  }, [room, seatData]);

  // Calculate seat counts for selected shift
  const totalSeats = filterSeats.length;
  const occupiedSeats = filterSeats.filter(
    (item) => getSeatStatus(item._id, shiftId) === "booked"
  ).length;
  const unavailableSeats = filterSeats.filter(
    (item) => getSeatStatus(item._id, shiftId) === "unavailable"
  ).length;
  const availableSeats = filterSeats.filter(
    (item) => getSeatStatus(item._id, shiftId) === "available"
  ).length;

  // Delete handler for both seat and shift
  const handleDelete = async () => {
    if (deleteType === "seat") {
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
        setDeleteType("");
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
        setDeleteType("");
        await loadSeatData();
      }
    } else if (deleteType === "shift") {
      try {
        const response = await axios.delete(`${backendURL}seat/deleteshift`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { id: deleteID },
        });
        await loadSeatData();
        // Optionally, you may want to reload shiftData from context if you have a loader for it
        await loadShiftData();

        if (response.data.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
        setDeleteID("");
        setDeleteShow(false);
        setDeleteType("");
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
        setDeleteType("");
        await loadSeatData();
      }
    }
  };

  // Only trigger shift delete popup when user selects a different shift in edit mode,
  // or if the user selects the same shift again (by clicking the dropdown and selecting the same value).
  // The default shift should NOT trigger delete popup on entering edit mode, only on user action.
  const handleShiftChange = (e) => {
    const newShiftId = e.target.value;
    if (isEdit) {
      if (newShiftId) {
        setDeleteID(newShiftId);
        setDeleteType("shift");
        setDeleteShow(true);
      }
      // If user selects the default "Select Shift" option (""), do nothing
    } else {
      setShiftId(newShiftId);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {deleteShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] w-full h-full overflow-y-auto px-6 pt-10 pb-10">
          <div className="bg-[#374151] p-4 sm:p-6 w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl h-auto flex flex-col items-center justify-center gap-6 rounded-xl mx-2">
            <p className="text-[18px] sm:text-[20px] font-semibold text-center break-words">
              {deleteType === "seat" ? (
                <>
                  Do You Want to Delete SeatNo.
                  {filterSeats.find((item) => item._id === deleteID)?.seatNo ||
                    ""}{" "}
                  of room{" "}
                  {filterSeats.find((item) => item._id === deleteID)?.room ||
                    ""}
                  ?
                </>
              ) : deleteType === "shift" ? (
                <>
                  Do You Want to Delete Shift "
                  {shiftData.find((s) => s._id === deleteID)?.name || ""}"?
                </>
              ) : null}
            </p>
            <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-4 sm:gap-5">
              <button
                onClick={() => {
                  setDeleteShow(false);
                  setDeleteID("");
                  setDeleteType("");
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
            className={`bg-[#374151] text-white px-6 rounded-lg focus:outline-none ${
              isEdit ? "cursor-pointer border-2 border-[#EF4444]" : ""
            }`}
            value={shiftId}
            onChange={handleShiftChange}
            disabled={shiftData.length === 0}
          >
            {isEdit && <option value="">Select Shift</option>}
            {shiftData.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          {isEdit && (
            <span className="ml-2 text-[#EF4444] text-xs font-semibold">
              Select to delete
            </span>
          )}
        </div>
      </div>

      <div className="bg-[#1F2937] rounded-lg w-full flex flex-col p-6 sm:p-7 gap-5 ">
        <div
          onClick={() => setIsEdit((prev) => !prev)}
          className={`${
            isEdit ? "bg-[#477CBF]" : "bg-[#374151]"
          } self-end px-6 py-1 text-[18px] cursor-pointer rounded-2xl `}
          title="For Deleting seats and shifts"
        >
          Edit
        </div>
        <div
          className={`${isEdit ? "border-2 border-[#EF4444] p-2 rounded-lg":""} flex items-center justify-center sm:justify-start flex-wrap gap-7 sm:gap-9  `}
        >
          {filterSeats.map((item) => {
            const status = getSeatStatus(item._id, shiftId);
            return (
              <div
                key={item._id}
                onClick={() => {
                  if (isEdit) {
                    setDeleteID(item._id);
                    setDeleteType("seat");
                    setDeleteShow(true);
                  }
                }}
                className={`${
                  status === "booked" || status === "unavailable"
                    ? "bg-[#EF4444] text-white"
                    : "bg-transparent"
                } w-12 h-12 p-4 border-[1px] border-white flex items-center justify-center rounded-lg cursor-pointer`}
                title={
                  status === "booked"
                    ? "Booked"
                    : status === "unavailable"
                    ? "Unavailable"
                    : "Available"
                }
              >
                {item.seatNo}
              </div>
            );
          })}
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
            Seats Occupied/Unavailable
          </p>
          <h2 className="text-[32px] sm:text-[40px] font-normal text-[#EF4444] text-center">
            {occupiedSeats + unavailableSeats}
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
