import React, { useContext } from "react";
import QRCode from "react-qr-code";
import { Context } from "../context/Context";

function QR() {
  const { profileData } = useContext(Context);
  return (
    <div className=" flex flex-col gap-4 bg-[#374151] rounded-xl p-4 ">
      <div className="flex flex-col gap1  ">
        <h2 className="text-[20px] ">QR Code for Student Attendance</h2>
      </div>
      <QRCode
        className="rounded-xl"
        size={400}
        value={`http://192.168.0.100:5175/${profileData._id}/attendance`}
      />
    </div>
  );
}

export default QR;
