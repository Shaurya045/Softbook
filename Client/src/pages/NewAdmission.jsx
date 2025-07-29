import React, { useState } from "react";
import { IoMdCloudUpload } from "react-icons/io";
import BookSeat from "../components/BookSeat";

function NewAdmission() {
  const [showPDf, setShowPDF] = useState(false);
  const [showSeats, setShowSeats] = useState(false);
  const [image, setImage] = useState(false);
  const [idUpload, setIdUpload] = useState(false);
  const [data, setData] = useState({
    studentName: "",
    fatherName: "",
    phone: "",
    localAdd: "",
    permanentAdd: "",
    room: "",
    seatNo: "",
    shiftId: "",
    duration: "",
    amount: "",
    paymentMode: "Online",
    idProof: "None",
  });
  const [phoneError, setPhoneError] = useState("");

  const onChangeHandler = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    // Phone validation: only allow digits, max 10 digits
    if (name === "phone") {
      // Remove non-digit characters
      value = value.replace(/\D/g, "");
      // Limit to 10 digits
      if (value.length > 10) value = value.slice(0, 10);
      setData((prev) => ({ ...prev, [name]: value }));

      // Set error if not 10 digits and not empty
      if (value.length === 0 || value.length === 10) {
        setPhoneError("");
      } else {
        setPhoneError("Phone number must be exactly 10 digits");
      }
      return;
    }

    // For duration and amount, only allow numbers (no validation required)
    if (name === "duration" || name === "amount") {
      // Remove non-digit characters
      value = value.replace(/\D/g, "");
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // Validate phone before proceeding
    if (data.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits");
      return;
    }
    setShowSeats(true);
  };

  return (
    <>
      {showSeats ? (
        <BookSeat
          data={data}
          setData={setData}
          image={image}
          idUpload={idUpload}
          setShowSeats={setShowSeats}
          setShowPDF={setShowPDF}
          showPDf={showPDf}
          setIdUpload={setIdUpload}
          setImage={setImage}
        />
      ) : (
        <div className="flex flex-col w-full justify-center items-start gap-6 sm:gap-8 ">
          <h1 className="text-[22px] sm:text-[30px] font-semibold ">
            New Admission
          </h1>
          <div className=" w-full sm:w-[80% rounded-[10px] flex flex-col gap-6 ">
            <h1 className="text-xl sm:text-2xl font-semibold  ">
              Student Credentials
            </h1>

            <form
              className="flex flex-col gap-[25px]"
              onSubmit={onSubmitHandler}
            >
              <div className="flex flex-col lg:flex-row gap-[40px]">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Full Name
                  </p>
                  <input
                    value={data.studentName}
                    onChange={onChangeHandler}
                    name="studentName"
                    className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                    type="text"
                    placeholder="Shaurya Pratap Singh"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Father's Name
                  </p>
                  <input
                    value={data.fatherName}
                    onChange={onChangeHandler}
                    name="fatherName"
                    className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                    type="text"
                    placeholder="Sanjay Kumar Singh"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-[40px]">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Local Address
                  </p>
                  <textarea
                    value={data.localAdd}
                    onChange={onChangeHandler}
                    name="localAdd"
                    className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] resize-none "
                    placeholder="Enter your address here..."
                    rows={4}
                    required
                  ></textarea>
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Permanent Address
                  </p>
                  <textarea
                    value={data.permanentAdd}
                    onChange={onChangeHandler}
                    name="permanentAdd"
                    className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] resize-none "
                    placeholder="Enter your address here..."
                    rows={4}
                    required
                  ></textarea>
                </div>
              </div>

              {/* <div className="flex flex-col lg:flex-row gap-[40px]">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">Shift</p>
                  <select
                    onChange={onChangeHandler}
                    className=" outline-none p-2 border-2 border-gray-300 rounded-[10px] "
                    name="shift"
                    required
                  >
                    <option value="Morning Shift (06:00AM - 02:00PM)">
                      Morning Shift (06:00AM - 02:00PM)
                    </option>
                    <option value="Evening Shift (02:00PM - 10:00PM)">
                      Evening Shift (02:00PM - 10:00PM)
                    </option>
                    <option value="Full Shift (06:00AM - 10:00PM)">
                      Full Shift (06:00AM - 10:00PM)
                    </option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Seat No.
                  </p>
                  <input
                    value={data.seat}
                    onChange={onChangeHandler}
                    name="seat"
                    className="outline-none p-2 border-2 border-gray-300 rounded-[10px]"
                    type="text"
                    placeholder="A-01"
                    required
                  />
                </div>
              </div> */}

              <div className="flex flex-col lg:flex-row gap-[40px]">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Student Phone No.
                  </p>
                  <input
                    value={data.phone}
                    onChange={onChangeHandler}
                    name="phone"
                    className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="9876543210"
                    required
                    maxLength={10}
                  />
                  {phoneError && (
                    <span className="text-red-500 text-xs mt-1">
                      {phoneError}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Duration (months)
                  </p>
                  <input
                    value={data.duration}
                    onChange={onChangeHandler}
                    name="duration"
                    className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="2"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-[40px]">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    ID Proof
                  </p>
                  <select
                    onChange={onChangeHandler}
                    className=" outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] "
                    name="idProof"
                  >
                    <option value="None">None</option>
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="Pancard">Pancard</option>
                    <option value="Student ID">Student ID</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Driving Licence">Driving Licence</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    ID Upload
                  </p>
                  {idUpload ? (
                    <div className="flex items-center gap-3">
                      <span className="text-[#83ABDB]">
                        {typeof idUpload === "string"
                          ? idUpload
                          : idUpload.name}
                      </span>
                      <button
                        type="button"
                        className="text-[#EF4444] underline text-sm cursor-pointer"
                        onClick={() => setIdUpload(false)}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <input
                      onChange={(e) => setIdUpload(e.target.files[0])}
                      className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                      type="file"
                      id="idUpload"
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-[40px]">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">Amount</p>
                  <input
                    value={data.amount}
                    onChange={onChangeHandler}
                    name="amount"
                    className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Rs. 500"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Payment Method
                  </p>
                  <select
                    onChange={onChangeHandler}
                    className=" outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] "
                    name="paymentMode"
                    required
                  >
                    <option value="Online">Online</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1 ">
                <p className="text-[16px] font-semibold pl-[3px] ">
                  Student Photo
                </p>
                <label htmlFor="image">
                  {image ? (
                    <img
                      className="w-[120px] rounded-[10px] cursor-pointer"
                      src={image ? URL.createObjectURL(image) : ""}
                      alt="upload_icon"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-[10px] cursor-pointer bg-[#1F2937] flex items-center justify-center ">
                      <IoMdCloudUpload size={35} />
                    </div>
                  )}
                </label>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                  // required
                />
              </div>

              <button
                type="submit"
                className="bg-[#303A96] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full lg:w-[500px] cursor-pointer self-center "
              >
                Proceed to Seat Selection
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NewAdmission;
