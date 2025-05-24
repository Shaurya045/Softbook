import React, { useState } from "react";
import { images } from "../assets/assets";
import PDF from "../components/PDF";
import PDF2 from "../components/PDF2";
// import { PDF2 } from "../components/PDF2";

function NewAdmission() {
  const [showPDf, setShowPDF] = useState(false);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    studentName: "",
    fatherName: "",
    localAddress: "",
    permanentAddress: "",
    shift: "Morning",
    seat: "",
    phone: "",
    amount: "",
    idProof: "Aadhar Card",
    dueDate: "",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setShowPDF(true);
  };

  return (
    <>
      {showPDf ? (
        <PDF2 data={data} image={image} setShowPDF={setShowPDF} />
      ) : (
        <div className="flex flex-col w-full justify-center items-center">
          <div className="bg-white w-[80%] px-[15px] sm:px-[40px] rounded-[10px] flex flex-col gap-[35px] py-[40px] shadow-lg ">
            <h1 className="text-center text-2xl font-semibold  ">
              Fill the Form With the New Admission
            </h1>

            <form
              className="flex flex-col gap-[25px]"
              onSubmit={onSubmitHandler}
            >
              <div className="flex flex-col lg:flex-row gap-[40px]">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Name of Student
                  </p>
                  <input
                    value={data.studentName}
                    onChange={onChangeHandler}
                    name="studentName"
                    className="outline-none p-2 border-2 border-gray-300 rounded-[10px]"
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
                    className="outline-none p-2 border-2 border-gray-300 rounded-[10px]"
                    type="text"
                    placeholder="Sanjay Kumar Singh"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Local Address
                  </p>
                  <textarea
                    value={data.localAddress}
                    onChange={onChangeHandler}
                    name="localAddress"
                    className="outline-none p-2 border-2 border-gray-300 rounded-[10px]"
                    placeholder="address..."
                    rows={3}
                    required
                  ></textarea>
                </div>
              </div>

              <div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Permanent Address
                  </p>
                  <textarea
                    value={data.permanentAddress}
                    onChange={onChangeHandler}
                    name="permanentAddress"
                    className="outline-none p-2 border-2 border-gray-300 rounded-[10px]"
                    placeholder="address..."
                    rows={4}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-[40px]">
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
              </div>

              <div className="flex flex-col lg:flex-row gap-[40px]">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Student Phone No.
                  </p>
                  <input
                    value={data.phone}
                    onChange={onChangeHandler}
                    name="phone"
                    className="outline-none p-2 border-2 border-gray-300 rounded-[10px]"
                    type="text"
                    placeholder="7667261255"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">Amount</p>
                  <input
                    value={data.amount}
                    onChange={onChangeHandler}
                    name="amount"
                    className="outline-none p-2 border-2 border-gray-300 rounded-[10px]"
                    type="text"
                    placeholder="Rs. 500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-[40px]">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    ID Proof
                  </p>
                  <select
                    onChange={onChangeHandler}
                    className=" outline-none p-2 border-2 border-gray-300 rounded-[10px] "
                    name="idProof"
                    required
                  >
                    <option value="Aadhar Card">Aadhar Card</option>
                    <option value="Pancard">Pancard</option>
                    <option value="Student ID">Student ID</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Driving Licence">Driving Licence</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-[16px] font-semibold pl-[3px] ">
                    Due Date
                  </p>
                  <input
                    value={data.dueDate}
                    onChange={onChangeHandler}
                    name="dueDate"
                    className="outline-none p-2 border-2 border-gray-300 rounded-[10px]"
                    type="date"
                    // required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 ">
                <p className="text-[16px] font-semibold pl-[3px] ">
                  Student Photo
                </p>
                <label htmlFor="image">
                  <img
                    className="w-[120px] cursor-pointer"
                    src={image ? URL.createObjectURL(image) : images.upload}
                    alt="upload_icon"
                  />
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
                className="bg-gradient-to-bl from-[#589e8b] to-[#0b4d3b] p-[10px] text-white rounded-[10px] w-[120px] cursor-pointer "
              >
                Generate PDF
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NewAdmission;
