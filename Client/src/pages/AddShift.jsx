import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../context/Context";
import Spinner from "../components/Spinner";

function AddShift() {
  const { token, backendURL } = useContext(Context);
  const [selectShift, setSelectShift] = useState("Morning");
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("14:00");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      name: selectShift,
      startTime,
      endTime,
    };
    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}seat/addshift`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setStartTime("06:00");
        setEndTime("14:00");
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full justify-center items-start gap-6 sm:gap-8 ">
      {loading && <Spinner />}
      <h1 className="text-[22px] sm:text-[30px] font-semibold ">Add Shifts</h1>

      <form
        className="flex flex-col gap-[30px] w-full "
        onSubmit={onSubmitHandler}
      >
        <div className="flex flex-col lg:flex-row gap-[40px]">
          <div className="flex flex-col gap-1 w-full ">
            <p className="text-[16px] font-semibold pl-[3px] ">Shift Name</p>
            <select
              id="shift-select"
              className="bg-[#1F2937] text-white px-3 py-3 rounded-lg focus:outline-none "
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
          <div className="flex flex-col sm:flex-row gap-5 w-full">
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
                style={{ colorScheme: "dark" }}
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
                style={{ colorScheme: "dark" }}
                required
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#303A96] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full lg:w-[500px] cursor-pointer self-center "
        >
          Add Shift
        </button>
      </form>
    </div>
  );
}

export default AddShift;
