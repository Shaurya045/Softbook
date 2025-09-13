import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import PDF from "../component/PDF";
import { MdOutlineFileDownload } from "react-icons/md";

const Profile = () => {
  const { studentData } = useContext(Context);
  const [showPDF, setShowPDF] = useState(false);
  return (
    <div className="flex flex-col gap-6 sm:gap-9 w-full">
      <h1 className="text-[22px] sm:text-[30px] font-semibold">Profile</h1>
      {showPDF ? (
        <button
          className=" w-[150px] bg-[#303A96] text-white p-[10px] rounded-xl cursor-pointer  "
          onClick={() => setShowPDF(false)}
        >
          Hide PDF
        </button>
      ) : (
        <button
          className="w-full bg-[#303A96] transition px-6 py-[10px] text-[16px] md:text-[18px] rounded-xl cursor-pointer flex items-center justify-center gap-2 text-white font-semibold shadow-md"
          onClick={() => setShowPDF(true)}
          type="button"
        >
          <MdOutlineFileDownload size={23} />
          <span>View / Download Receipt</span>
        </button>
      )}
      {/* PDF Preview */}
      {showPDF && (
        <div className="flex flex-col gap-3 sm:gap-0 ">
          <PDF studentData={studentData} />
        </div>
      )}
    </div>
  );
};

export default Profile;
