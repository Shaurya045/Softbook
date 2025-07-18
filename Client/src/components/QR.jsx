import React, { useContext } from "react";
import QRCode from "react-qr-code";
import { Context } from "../context/Context";

function QR() {
  const { profileData } = useContext(Context);
  return (
    <div className="flex flex-col gap-4 bg-[#374151] rounded-xl p-4 w-full max-w-[95vw] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h2 className="text-[18px] sm:text-[20px] font-semibold">
          QR Code for Student Attendance
        </h2>
        <button className="px-3 py-1 bg-[#477CBF] cursor-pointer rounded text-white text-[15px] mt-2 sm:mt-0">
          Download
        </button>
      </div>
      <div className="flex justify-center items-center w-full">
        <QRCode
          className="rounded-xl"
          size={Math.min(300, window.innerWidth * 0.7)}
          value={`https://ef1b79320c38.ngrok-free.app/${profileData._id}/attendance`}
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "320px",
            minWidth: "120px",
          }}
        />
      </div>
    </div>
  );
}

export default QR;
