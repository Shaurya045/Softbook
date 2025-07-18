import React from "react";
import PDF2 from "./PDF2";

function Confirmation({ studentData, setShowPDF }) {
  return (
    <div className="flex flex-col w-full justify-center items-start gap-9 ">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col ">
          <h1 className="text-[30px] font-semibold ">Confirmation Page</h1>
          <h1 className="text-[25px] text-[#757C89] font-semibold mt-[-5px] ">
            Download your receipt
          </h1>
        </div>
        {/* <div
          onClick={() => setShowPDF(false)}
          className="flex w-[150px] bg-[#4BDE80] text-[#101826] p-[10px] rounded-[10px] items-center gap-[10px] cursor-pointer hover:scale-[1.1] transition duration-300 "
        >
          <IoArrowBack size={16} />
          <p className="text-[16px] font-semibold">Back to Form</p>
        </div> */}
      </div>
      <PDF2 studentData={studentData} setShowPDF={setShowPDF} />
    </div>
  );
}

export default Confirmation;
