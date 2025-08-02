import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../context/Context";
import Spinner from "../components/Spinner";

function AddShift() {
  const { token, backendURL, loadShiftData } = useContext(Context);
  const [selectShift, setSelectShift] = useState("Morning");
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("14:00");
  const [duration, setDuration] = useState("00:00");
  const [loading, setLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [durationError, setDurationError] = useState("");

  // Helper to get duration in minutes (no 24-hour wrap)
  const getDurationMinutes = (start, end) => {
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    // Convert to minutes
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return endTotalMinutes - startTotalMinutes;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Check duration is at least 2 hours (120 minutes) and endTime > startTime
    const diff = getDurationMinutes(startTime, endTime);
    if (diff < 120) {
      setDurationError(
        "Shift duration must be at least 2 hours and End Time must be after Start Time."
      );
      return;
    } else {
      setDurationError("");
    }

    let shiftName = selectShift;
    if (selectShift === "Other") {
      shiftName = label;
      shiftName = shiftName.charAt(0).toUpperCase() + shiftName.slice(1);
    }

    const payload = {
      name: shiftName,
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
        await loadShiftData();
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

  useEffect(() => {
    const diff = getDurationMinutes(startTime, endTime);
    let durationStr = "00:00";
    if (diff >= 0) {
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      durationStr = `${String(hours).padStart(2, "0")}:${String(
        minutes
      ).padStart(2, "0")}`;
    }
    setDuration(durationStr);

    // Live validation for duration
    if (diff < 120) {
      setDurationError(
        "Shift duration must be at least 2 hours and End Time must be after Start Time."
      );
    } else {
      setDurationError("");
    }
  }, [startTime, endTime]);

  return (
    <div className="flex flex-col w-full justify-center items-start gap-6 sm:gap-8 ">
      {loading && <Spinner />}
      <h1 className="text-[22px] sm:text-[30px] font-semibold ">Add Shifts</h1>

      <form
        className="flex flex-col gap-[30px] w-full "
        onSubmit={onSubmitHandler}
      >
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
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
              <option value="Night">Night</option>
              <option value="Full">Full</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {selectShift === "Other" && (
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[16px] font-semibold pl-[3px] ">Label</p>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                name="label"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                type="text"
                style={{ colorScheme: "dark" }}
                placeholder="Enter Label"
                required
              />
            </div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-[40px]">
          <div className="flex flex-col w-full gap-3">
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
                  max={endTime}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <p className="text-[16px] font-semibold pl-[3px] ">
                  End Timing
                </p>
                <input
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  name="endTime"
                  className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                  type="time"
                  style={{ colorScheme: "dark" }}
                  required
                  min={startTime}
                />
              </div>
            </div>
            {durationError && (
              <div className="text-red-500 text-sm mt-1">{durationError}</div>
            )}
          </div>
          <div className="flex flex-col gap-1 w-30">
            <p className="text-[16px] font-semibold pl-[3px] ">Duration</p>
            <div className="p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]">
              {duration} hrs
            </div>
          </div>
        </div>
        <button
          type="submit"
          className={`${
            durationError ? "cursor-not-allowed" : "cursor-pointer"
          } bg-[#303A96] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full lg:w-[500px]  self-center `}
          disabled={!!durationError}
        >
          Add Shift
        </button>
      </form>
    </div>
  );
}

export default AddShift;
