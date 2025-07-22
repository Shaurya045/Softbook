import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

function AddSeats() {
  const { token, backendURL } = useContext(Context);
  const [data, setData] = useState({
    room: "",
    seatNo: "",
  });
  const [loading, setLoading] = useState(false);

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

    const payload = {
      ...data,
      seatNo: Number(data.seatNo),
    };
    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}seat/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setData({ room: "", seatNo: "" });
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
      <h1 className="text-[22px] sm:text-[30px] font-semibold ">Add Seats</h1>

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
        </div>
        <div className="flex flex-col lg:flex-row gap-[40px]">
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
          className="bg-[#303A96] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full lg:w-[500px] cursor-pointer self-center "
        >
          Add Seat
        </button>
      </form>
    </div>
  );
}

export default AddSeats;
