import React, { useEffect, useState, useContext } from "react";
import PDF2 from "./PDF2";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios"; // You need to import axios
import { Context } from "../context/Context";
import { toast } from "react-toastify";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

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
  const { rooms, shifts, seatData, token, backendURL } = useContext(Context);

  const [room, setRoom] = useState(rooms[0] || "");
  const [shift, setShift] = useState(capitalize(shifts[0]) || "");
  const [seat, setSeat] = useState();
  const [filterSeats, setFilterSeats] = useState([]);
  const [studentData, setStudentData] = useState({});

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      room: room,
      shift: shift,
      seatNo: seat,
    }));
  }, [room, shift, seat, setData]);

  useEffect(() => {
    const filter = seatData.filter(
      (item) => item.room === room && item.shift === shift
    );
    setFilterSeats(filter);
  }, [room, shift]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (seat && room && shift) {
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

        // console.log(data);

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

        // Check if the response indicates success (both string and boolean values)
        if (
          response.data.success === "true" ||
          response.data.success === true
        ) {
          toast.success(response.data.message);
          // console.log(response.data.student);
          setStudentData(response.data.student);
          setShowPDF(true);
          // Reset form data after successful submission
          setData({
            studentName: "",
            fatherName: "",
            localAdd: "",
            permanentAdd: "",
            room: "",
            shift: "",
            seatNo: "",
            phone: "",
            duration: "",
            amount: "",
            paymentMode: "Online",
            idProof: "Aadhar Card",
          });
          setImage(false);
          setIdUpload(false);
        } else {
          toast.error(response.data.message || "Admission failed");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          // Check for specific error messages from the backend
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
      }
    } else {
      toast.error("You missed to select seat/room/shift");
    }
  };

  return (
    <>
      {showPDf ? (
        <PDF2 studentData={studentData} setShowPDF={setShowPDF} />
      ) : (
        <div className="flex flex-col w-full justify-center items-start gap-9 ">
          <div className="flex justify-between items-center w-full">
            <div className="flex flex-col ">
              <h1 className="text-[30px] font-semibold ">Seat Selection</h1>
              <h1 className="text-[25px] text-[#757C89] font-semibold mt-[-5px] ">
                Select a room, shift and seat
              </h1>
            </div>
            <div
              onClick={() => setShowSeats(false)}
              className="flex w-[150px] bg-[#4BDE80] text-[#101826] p-[10px] rounded-[10px] items-center gap-[10px] cursor-pointer hover:scale-[1.1] transition duration-300 "
            >
              <IoArrowBack size={16} />
              <p className="text-[16px] font-semibold">Back to Form</p>
            </div>
          </div>
          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={onSubmitHandler}
          >
            <div className="flex items-center justify-between w-full">
              {/* Room Selection */}
              <div className="flex items-center justify-between bg-[#374151] w-[340px] px-3 py-2 rounded-lg ">
                <label
                  className="text-[14px] font-medium text-[#4BDE80] "
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
              <div className="flex items-center justify-between bg-[#374151] w-[340px] px-3 py-2 rounded-lg ">
                <label
                  className="text-[14px] font-medium text-[#4BDE80] "
                  htmlFor="shift-select"
                >
                  Select Shift
                </label>
                <select
                  id="shift-select"
                  className="bg-[#374151] text-white px-6 rounded-lg focus:outline-none "
                  value={shift}
                  onChange={(e) => {
                    setShift(e.target.value);
                  }}
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
            <div className="bg-[#1F2937] flex items-center justify-start flex-wrap gap-9 p-8 rounded-lg ">
              {filterSeats.map((item) => (
                <div
                  key={item._id || item.seatNo}
                  className={`w-12 h-12 p-4 border-[1px] border-white flex items-center justify-center rounded-lg cursor-pointer
                    ${
                      item.status === "booked"
                        ? "bg-[#EF4444] cursor-not-allowed"
                        : item.seatNo === seat
                        ? "bg-[#4BDE80]"
                        : "bg-[#374151] hover:bg-[#4BDE80]/70"
                    }
                  `}
                  onClick={() => {
                    if (item.status === "available") {
                      setSeat(item.seatNo);
                    } else {
                      alert("Seat is already booked");
                      setSeat();
                    }
                  }}
                  aria-disabled={item.status === "booked"}
                >
                  {item.seatNo}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-[#4BDE80] p-[10px] text-[#101826] text-[20px] font-semibold rounded-[10px] w-[500px] cursor-pointer self-center "
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
