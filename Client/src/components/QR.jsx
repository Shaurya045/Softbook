import React, { useContext } from "react";
import QRCode from "react-qr-code";
import { Context } from "../context/Context";

function QR() {
  const { profileData } = useContext(Context);
  return (
    <div className=" flex flex-col gap-5 ">
      <div className="flex flex-col gap1 ">
        <h2 className="text-[30px] ">QR Code</h2>
        <h4 className="text-[20px] text-[#757C89] ">For Student Attendance</h4>
      </div>
      <QRCode
        className="rounded-xl"
        size={400}
        value={`https://bb79fc885255.ngrok-free.app/${profileData._id}/attendance`}
      />
    </div>
  );
}

export default QR;
