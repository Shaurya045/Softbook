import React, { useEffect, useState, useContext } from "react";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import Confirmation from "./Confirmation";
import Spinner from "./Spinner";

function BookSeat({
  data,
  setData,
  image,
  setShowSeats,
  setShowPDF,
  idUpload,
  showPDf,
  setIdUpload,
  setImage,
}) {
  const {
    rooms,
    shiftData,
    seatData,
    bookingData,
    token,
    backendURL,
    loadStudentData,
    loadBookingData,
    loadPayments,
  } = useContext(Context);

  const [room, setRoom] = useState(rooms[0] || "");
  const [shiftId, setShiftId] = useState(shiftData[0]?._id || "");
  const [seat, setSeat] = useState();
  const [filterSeats, setFilterSeats] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      room: room,
      shiftId: shiftId,
      seatNo: seat,
    }));
  }, [room, shiftId, seat, setData]);

  useEffect(() => {
    const filtered = seatData.filter((item) => item.room === room);
    setFilterSeats(filtered);
  }, [room, seatData]);

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

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (seat && room && shiftId) {
      setLoading(true);
      try {
        const formData = new FormData();
        if (data && typeof data === "object") {
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, value);
            }
          });
        }
        if (image) {
          formData.append("image", image);
        }
        if (idUpload) {
          formData.append("idUpload", idUpload);
        }

        const response = await axios.post(
          `${backendURL}students/admission`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (
          response.data.success === "true" ||
          response.data.success === true
        ) {
          toast.success(response.data.message);
          setStudentData(response.data.student);
          setShowPDF(true);
          setData({
            studentName: "",
            fatherName: "",
            localAdd: "",
            permanentAdd: "",
            room: "",
            shiftId: "",
            seatNo: "",
            phone: "",
            duration: "",
            amount: "",
            paymentMode: "Online",
            idProof: "None",
          });
          setImage(false);
          setIdUpload(false);
          await loadStudentData();
          await loadBookingData();
          await loadPayments();
        } else {
          toast.error(response.data.message || "Admission failed");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          if (error.response.data.error) {
            toast.error(error.response.data.error);
          } else if (error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("An error occurred while submitting the form.");
          }
        } else {
          toast.error("An error occurred while submitting the form.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("You missed to select seat/room/shift");
    }
  };

  return (
    <>
      {loading && <Spinner />}
      {showPDf ? (
        <Confirmation studentData={studentData} setShowPDF={setShowPDF} />
      ) : (
        <div className="flex flex-col w-full justify-center items-start gap-6 sm:gap-9 ">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-2 w-full">
            <div
              onClick={() => setShowSeats(false)}
              className="sm:hidden flex w-[150px] bg-[#477CBF] text-white p-[10px] rounded-[10px] items-center gap-[10px] cursor-pointer hover:scale-[1.1] transition duration-300 "
            >
              <IoArrowBack size={16} />
              <p className="text-[16px] font-semibold">Back to Form</p>
            </div>
            <div className="flex flex-col ">
              <h1 className="text-[22px] sm:text-[30px] font-semibold ">
                Seat Selection
              </h1>
              <h1 className="text-[18px] sm:text-[25px] text-[#757C89] font-semibold mt-[-5px] ">
                Select a room, shift and seat
              </h1>
            </div>
            <div
              onClick={() => setShowSeats(false)}
              className="hidden sm:flex w-[150px] bg-[#477CBF] text-white p-[10px] rounded-[10px] items-center gap-[10px] cursor-pointer hover:scale-[1.1] transition duration-300 "
            >
              <IoArrowBack size={16} />
              <p className="text-[16px] font-semibold">Back to Form</p>
            </div>
          </div>

          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={onSubmitHandler}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-5 md:gap-2">
              {/* Room Selection */}
              <div className="flex items-center justify-between bg-[#374151] w-full md:w-[340px] px-3 py-2 rounded-lg ">
                <label
                  className="text-[14px] font-medium text-[#83ABDB] "
                  htmlFor="room-select"
                >
                  Select Room
                </label>
                <select
                  id="room-select"
                  className="bg-[#374151] text-white px-6  rounded-lg focus:outline-none "
                  value={room}
                  onChange={(e) => {
                    setRoom(e.target.value);
                  }}
                  required
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
                  className="text-[14px] font-medium text-[#83ABDB] "
                  htmlFor="shift-select"
                >
                  Select Shift
                </label>
                <select
                  id="shift-select"
                  className="bg-[#374151] text-white px-6 rounded-lg focus:outline-none "
                  value={shiftId}
                  onChange={(e) => {
                    setShiftId(e.target.value);
                  }}
                  required
                >
                  {shiftData.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-[#1F2937] flex items-center justify-center sm:justify-start flex-wrap gap-7 sm:gap-9 p-6 sm:8 rounded-lg ">
              {filterSeats.map((item) => {
                const status = getSeatStatus(item._id, shiftId);
                return (
                  <div
                    key={item._id}
                    className={`${
                      status === "booked" || status === "unavailable"
                        ? "bg-[#EF4444] cursor-not-allowed"
                        : item.seatNo === seat
                        ? "bg-[#4BDE80]"
                        : "bg-[#374151] hover:bg-[#4BDE80]/70"
                    } w-12 h-12 p-4 border-[1px] border-white flex items-center justify-center rounded-lg cursor-pointer`}
                    title={
                      status === "booked"
                        ? "Booked"
                        : status === "unavailable"
                        ? "Unavailable"
                        : "Available"
                    }
                    onClick={() => {
                      if (status === "available") {
                        setSeat(item.seatNo);
                      } else if (status === "unavailable") {
                        alert("Seat is unavailable");
                        setSeat();
                      } else {
                        alert("Seat is already booked");
                        setSeat();
                      }
                    }}
                    aria-disabled={status === "booked"}
                  >
                    {item.seatNo}
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              className="p-[10px] bg-[#303A96] text-white text-[20px] font-semibold rounded-[10px] w-full md:w-[500px] cursor-pointer self-center "
            >
              {" "}
              Confirm Seat
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default BookSeat;
