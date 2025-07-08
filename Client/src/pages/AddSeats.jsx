import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

function AddSeats() {
  const { token, backendURL } = useContext(Context);
  const [data, setData] = useState({
    room: "",
    shift: "",
    seatNo: "",
  });
  const [selectShift, setSelectShift] = useState("Morning");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const onChangeHandler = (e) => {
    const name = e.target.name;
    let value = e.target.value;
    if (name === "seatNo") {
      value = value.replace(/\D/, "");
    }
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const shiftString = `${selectShift} (${startTime} - ${endTime})`;

    const payload = {
      ...data,
      shift: shiftString,
      seatNo: Number(data.seatNo),
    };

    try {
      const response = await axios.post(`${backendURL}seat/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData({ room: "", shift: "", seatNo: "" });
        setStartTime("");
        setEndTime("");
        setSelectShift("Morning");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding seat:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add seat. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-start gap-8 ">
      <h1 className="text-[30px] font-semibold ">Add Seats</h1>

      <form
        className="flex flex-col gap-[30px] w-full "
        onSubmit={onSubmitHandler}
      >
        <div className="flex flex-col lg:flex-row gap-[40px]">
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[16px] font-semibold pl-[3px] ">Add Room</p>
            <input
              value={data.room}
              onChange={onChangeHandler}
              name="room"
              className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
              type="text"
              placeholder="A"
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-full ">
            <p className="text-[16px] font-semibold pl-[3px] ">Add Shift</p>
            <select
              id="shift-select"
              className="bg-[#374151] text-white px-3 py-3 rounded-lg focus:outline-none "
              value={selectShift}
              onChange={(e) => {
                setSelectShift(e.target.value);
              }}
              required
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Full">Full</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-[40px]">
          <div className="flex gap-5 w-full">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[16px] font-semibold pl-[3px] ">
                Start Timing
              </p>
              <input
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                name="startTime"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                type="time"
                placeholder=""
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[16px] font-semibold pl-[3px] ">End Timing</p>
              <input
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                name="endTime"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                type="time"
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[16px] font-semibold pl-[3px] ">Add Seat</p>
            <input
              value={data.seatNo}
              onChange={onChangeHandler}
              name="seatNo"
              className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
              type="number"
              min="1"
              placeholder="01"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#4BDE80] p-[10px] text-[#101826] text-[20px] font-semibold rounded-[10px] w-[500px] cursor-pointer self-center "
        >
          Add Seat
        </button>
      </form>
    </div>
  );
}

export default AddSeats;
