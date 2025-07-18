import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import axios from "axios";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function UpdateStudent({ setShowEdit, item }) {
  const { rooms, shifts, seatData, token, backendURL, loadStudentData } =
    useContext(Context);

  const [room, setRoom] = useState(item.room || rooms[0] || "");
  const [shift, setShift] = useState(capitalize(item.shift || shifts[0]) || "");
  const [seat, setSeat] = useState(item.seatNo);
  const [duration, setDuration] = useState(item.duration);
  const [amount, setAmount] = useState(item.amount);
  const [paymentMode, setPaymentMode] = useState(item.paymentMode);

  const [filterSeats, setFilterSeats] = useState([]);

  const data = {
    id: item._id,
    room,
    shift,
    seatNo: seat,
    duration,
    amount,
    paymentMode,
  };

  useEffect(() => {
    const filter = seatData.filter((s) => s.room === room && s.shift === shift);
    setFilterSeats(filter);
  }, [room, shift, seatData]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${backendURL}students/updatestudent`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        toast.success("Student updated successfully");
        await loadStudentData();
        setShowEdit(false);
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.log(error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "An error occurred");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start lg:items-center justify-center bg-[#000000cc] w-full h-full overflow-y-auto pt-10 pb-10">
      <div className=" flex flex-col justify-center gap-3 sm:gap-4 bg-[#374151] p-3 min-[440px]:p-6 sm:p-8 w-9/10 min-[440px]:w-4/5 sm:w-2/3 h-auto lg:h-4/ rounded-xl ">
        <h1 className="text-[22px] sm:text-[30px] font-semibold">Update Student Record</h1>
        <div className="flex flex-col gap-1 ">
          <div className="flex items-center gap-4 text-[18px] sm:text-[20px]">
            <h3>Student Name: </h3>
            <h4>{item.studentName}</h4>
          </div>
          <div className="flex items-center gap-4 text-[18px] sm:text-[20px]">
            <h3>Phone no.: </h3>
            <h4>{item.phone}</h4>
          </div>
        </div>
        <form onSubmit={onSubmitHandler} className="flex flex-col gap-[25px] ">
          <h2 className=" text-[20px] sm:text-[25px] font-semibold">Edit Record</h2>
          <div className="flex flex-col lg:flex-row items-center gap-5">
            <div className="flex items-center justify-between bg-[#1F2937] px-3 py-3 rounded-lg w-full lg:w-1/2 ">
              <label
                className="text-[14px] font-medium text-[#83ABDB] "
                htmlFor="room-select"
              >
                Select Room
              </label>
              <select
                id="room-select"
                className="bg-[#1F2937] text-white px-6  rounded-lg focus:outline-none "
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                required
              >
                {rooms.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between bg-[#1F2937] px-3 py-3 rounded-lg  w-full lg:w-1/2">
              <label
                className="text-[14px] font-medium text-[#83ABDB] "
                htmlFor="shift-select"
              >
                Select Shift
              </label>
              <select
                id="shift-select"
                className="bg-[#1F2937] text-white px-6 rounded-lg focus:outline-none "
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                required
              >
                {shifts.map((s) => (
                  <option key={s} value={capitalize(s)}>
                    {capitalize(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row  items-center gap-5">
            <div className="flex items-center justify-between bg-[#1F2937] px-3 py-3 rounded-lg w-full lg:w-1/2 ">
              <label
                className="text-[14px] font-medium text-[#83ABDB] "
                htmlFor="seat-select"
              >
                Available SeatNo
              </label>
              <select
                id="seat-select"
                className="bg-[#1F2937] text-white px-6 rounded-lg focus:outline-none "
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
                required
              >
                {filterSeats
                  .filter(
                    (s) => s.status === "available" || item.seatNo === s.seatNo
                  )
                  .map((s) => (
                    <option key={s.seatNo} value={s.seatNo}>
                      {s.seatNo}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center justify-between gap-1 w-full lg:w-1/2 rounded-lg bg-[#1F2937] p-3 ">
              <p className="text-[16px] font-semibold pl-[3px text-[#83ABDB] ">
                Duration
              </p>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                name="duration"
                className="outline-none bg-[#1F2937] rounded-[10px] text-white text-right placeholder-white"
                type="text"
                placeholder="2"
                required
                style={{ "::placeholder": { color: "white" } }}
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row  items-center gap-5">
            <div className="flex items-center justify-between gap-1 w-full lg:w-1/2  rounded-lg bg-[#1F2937] p-3 ">
              <p className="text-[16px] font-semibold pl-[3px text-[#83ABDB] ">
                Amount
              </p>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                name="amount"
                className="outline-none bg-[#1F2937] rounded-[10px] text-white text-right placeholder-white"
                type="text"
                placeholder="500"
                required
                style={{ "::placeholder": { color: "white" } }}
              />
            </div>
            <div className="flex items-center justify-between gap-1 w-full lg:w-1/2 rounded-lg bg-[#1F2937] p-3 ">
              <p className="text-[16px] font-semibold pl-[3px text-[#83ABDB] ">
                Payment Method
              </p>
              <select
                onChange={(e) => setPaymentMode(e.target.value)}
                className=" outline-none bg-[#1F2937] rounded-[10px] text-white text-right "
                name="paymentMode"
                value={paymentMode}
                required
              >
                <option value="Online">Online</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6 ">
            <button
              type="button"
              onClick={() => setShowEdit(false)}
              className="bg-[#EF4444] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full sm:w-1/2  cursor-pointer self-center "
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#477CBF] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full sm:w-1/2  cursor-pointer self-center "
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateStudent;
