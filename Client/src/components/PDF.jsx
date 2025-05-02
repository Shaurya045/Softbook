import React, { useRef } from "react";
import { images } from "../assets/assets";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FaWhatsapp } from "react-icons/fa6";

function PDF({ data, image }) {
  const studentName = data.studentName;
  const phone = 91 + data.phone;
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${day}/${month}/${year}`;

  // Calculate due date (1 month from now)
  const dueDate = new Date(today);
  dueDate.setMonth(dueDate.getMonth() + 1);
  const dueDateFormatted = `${String(dueDate.getDate()).padStart(
    2,
    "0"
  )}/${String(dueDate.getMonth() + 1).padStart(
    2,
    "0"
  )}/${dueDate.getFullYear()}`;

  //   reference of what to print
  const printRef = useRef(null);

  //   function for making specfic region as pdf
  const handleDownloadPDF = async () => {
    const element = printRef.current;
    // console.log(element)
    if (!element) {
      return;
    }

    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();

    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Create filename with studentName and today's date
    const fileName = `${studentName}_${formattedDate.replace(/\//g, "-")}.pdf`;
    pdf.save(fileName);
  };

  return (
    <div className=" flex flex-col w-full justify-center items-center">
      <p className="text-red-600 font-bold md:text-3xl lg:hidden block sm:text-2xl text-base">Cannot Print PDF in Mobile View</p>
      <div
        ref={printRef}
        className="bg-white px-[40px] max-w-[900px] min-w-[900px] rounded-[10px] hidden lg:flex flex-col items-center gap-[25px] pt-[20px] pb-[50px] shadow-lg print:shadow-none "
      >
        {/* header */}
        <div>
          <div className="flex items-center">
            <img className="w-[150px]" src={images.logo} alt="logo" />
            <div>
              <p className="font-bold text-3xl text-[#539486] ">
                PRATAP LIBRARY
              </p>
              <p className="font-bold text-xl text-[#539486] ">
                A SELF STUDY CENTER
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center mt-[-30px] ">
            <div className="flex items-center justify-center gap-1 text-[#539486]">
              <img src={images.map} alt="" />
              <p className="text-sm font-medium">
                H. No.-34-A, Singh Villa, Road No.- 19, (Near Noble Public
                School),
              </p>
            </div>
            <p className="text-[14px] text-[#539486] font-medium">
              Bank Colony, Baba Chowk, Keshri Nagar, Patna-800024
            </p>
            <div className="flex items-center justify-center gap-1 text-[#539486]">
              <img src={images.phone} alt="" />
              <p className="text-sm font-medium">9304161888, 9835491795</p>
            </div>
          </div>
        </div>

        <div className="h-[2px] w-full bg-[#539486] mt-[-10px] "></div>

        {/* Date */}
        <div className="flex gap-[10px] items-center self-start pl-[10px] ">
          <p className="text-md font-medium text-[#539486]">Date : </p>
          <p className="text-lg font-semibold">{formattedDate}</p>
        </div>

        {/* student info */}
        <div className="self-start flex flex-col gap-[15px] w-full mb-[15px]">
          <div className="flex justify-between gap-[30px] ">
            <div className="flex flex-col gap-[10px] bg-[#539486]/5 p-4 rounded-lg w-full">
              <div className="flex gap-[10px] items-center ">
                <p className="text-md font-medium text-[#539486]">
                  Student's Name :{" "}
                </p>
                <p className="text-lg font-normal">{data.studentName}</p>
              </div>
              <div className="flex gap-[10px] items-center  ">
                <p className="text-md font-medium text-[#539486]">
                  Father's Name :{" "}
                </p>
                <p className="text-lg font-normal">{data.fatherName}</p>
              </div>
              <div className="flex gap-[10px] items-center  ">
                <p className="text-md font-medium text-[#539486]">
                  Phone No. :{" "}
                </p>
                <p className="text-lg font-normal">{data.phone}</p>
              </div>
              <div className="flex gap-[10px] items-center  ">
                <p className="text-md font-medium text-[#539486]">Shift : </p>
                <p className="text-lg font-normal">{data.shift}</p>
              </div>
              <div className="flex gap-[10px] items-center  ">
                <p className="text-md font-medium text-[#539486]">
                  Seat No. :{" "}
                </p>
                <p className="text-lg font-normal">{data.seat}</p>
              </div>
              <div className="flex gap-[10px] items-center  ">
                <p className="text-md font-medium text-[#539486]">
                  ID Proof :{" "}
                </p>
                <p className="text-lg font-normal">{data.idProof}</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-40 bg-[#539486]/10 rounded-lg overflow-hidden border-2 border-[#539486] mb-2">
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Student Photo"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="text-xs text-[#539486] font-medium">
                Student Photo
              </span>
            </div>
          </div>
          <div className="flex gap-[10px] items-center bg-[#539486]/5 p-4 rounded-lg ">
            <p className="text-md font-medium text-[#539486]">
              Local Address :{" "}
            </p>
            <p className="text-base">{data.localAddress}</p>
          </div>
          <div className="flex gap-[10px] items-center bg-[#539486]/5 p-4 rounded-lg ">
            <p className="text-md font-medium text-[#539486]">
              Permanent Address :{" "}
            </p>
            <p className="text-base">{data.permanentAddress}</p>
          </div>
          <div className="flex gap-[40px] w-full">
            <div className="bg-[#539486]/10 p-4 rounded-lg border-l-4 border-[#539486] flex gap-[10px] items-center ">
              <p className="text-md font-medium text-[#539486]">Due Date : </p>
              <p className="text-lg font-bold">{dueDateFormatted}</p>
            </div>
            <div className="bg-[#539486]/10 p-4 rounded-lg border-l-4 border-[#539486] flex gap-[10px] items-center ">
              <p className="text-md font-medium text-[#539486]">Amount : </p>
              <p className="text-lg font-bold">Rs. {data.amount}</p>
            </div>
          </div>
        </div>
        <div className="h-[2px] w-full bg-[#539486] "></div>

        {/* Rules */}
        <div className="self-start w-full">
          <h1 className="text-lg font-bold text-center text-[#539486] mb-4">
            Rules & Regulations
          </h1>
          <div className="bg-[#539486]/5 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <img
                className="w-5 h-5 shrink-0"
                src={images.check}
                alt="check"
              />
              <p>Please maintain silence in the library.</p>
            </div>
            <div className="flex items-center gap-2">
              <img
                className="w-5 h-5 shrink-0"
                src={images.check}
                alt="check"
              />
              <p>Mark your attendance daily in the register.</p>
            </div>
            <div className="flex items-center gap-2">
              <img
                className="w-5 h-5 shrink-0"
                src={images.check}
                alt="check"
              />
              <p>Always flush after using washroom.</p>
            </div>
            <div className="flex items-center gap-2">
              <img
                className="w-5 h-5 shrink-0"
                src={images.check}
                alt="check"
              />
              <p>
                For any complaints/suggestions contact on this no.
                9304161888/9835491795.
              </p>
            </div>
          </div>
        </div>
        <div className="h-[2px] w-full bg-[#539486] "></div>

        {/* Don'ts */}
        <div className="self-start w-full">
          <h2 className="text-lg font-bold text-center text-[#539486] mb-4">
            Don'ts
          </h2>
          <div className="bg-[#539486]/5 p-4 rounded-lg space-y-2">
            <div className="flex gap-2 items-center">
              <img
                className="w-5 h-5 shrink-0"
                src={images.cancel}
                alt="cancel"
              />
              <p>No discussions/murmurning inside the library.</p>
            </div>
            <div className="flex gap-2 items-center">
              <img
                className="w-5 h-5 shrink-0"
                src={images.cancel}
                alt="cancel"
              />
              <p>No food items are allowed to have on the seat.</p>
            </div>
            <div className="flex gap-2 items-center">
              <img
                className="w-5 h-5 shrink-0"
                src={images.cancel}
                alt="cancel"
              />
              <p>
                Don't gather in groups outside the library. (Strictly
                Prohibited)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[30px] flex flex-col sm:flex-row items-center justify-center gap-[20px]">
        <button
          onClick={handleDownloadPDF}
          className=" w-[150px] bg-white text-[#539486] p-[10px] rounded-[10px] text-[21px] font-semibold cursor-pointer hover:scale-[1.1] transition duration-300 "
        >
          Print PDF
        </button>

        <a
          href={`https://wa.me/${phone}?text=Here is your receipt `}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex bg-white p-[10px] rounded-[10px] gap-[10px] hover:scale-[1.1] transition duration-300 ">
            <div className=" w-[30px] h-[30px] bg-green-400 rounded-[50%] flex flex-row justify-center items-center text-[45px] text-white ">
              <FaWhatsapp />
            </div>
            <p className="text-[18px] font-semibold text-[#539486] ">
              Send on Whatsapp
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default PDF;
