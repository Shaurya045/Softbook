import React, { useContext } from "react";
import SeatsView from "../components/SeatsView";
import { Context } from "../context/Context";
import QR from "../components/QR";

function Dashboard() {
  const { studentData, rooms, shiftData, seatData, profileData } =
    useContext(Context);

  return (
    <div className="flex flex-col gap-7 sm:gap-9">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
        {/* <div className="flex  items-center justify-between gap-0 sm:gap-0 w-full"> */}
        <h1 className="text-[22px] sm:text-[30px] font-semibold">Dashboard</h1>
        <div className="mt-1 sm:mt-0">
          <p className="text-[16px] sm:text-[20px] font-medium text-left sm:text-right">
            Hey, {profileData.libraryName}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between w-full">
        <div className="flex-1 flex items-center justify-center bg-gradient-to-bl from-[#D6D446] via-40% via-[#F591B7] to-[#03C7BD] to-70% p-1 rounded-2xl min-w-[180px]">
          <div className="flex flex-col items-center justify-center bg-[#374151] rounded-2xl px-8 py-4 w-full">
            <p className="text-[18px] sm:text-[20px] font-medium text-center">
              Total Rooms
            </p>
            <h2 className="text-[36px] sm:text-[50px] font-bold text-center">
              {rooms.length}
            </h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-bl from-[#D6D446] via-40% via-[#F591B7] to-[#03C7BD] to-70% p-1 rounded-2xl min-w-[180px]">
          <div className="flex flex-col items-center justify-center bg-[#374151] rounded-2xl px-8 py-4 w-full">
            <p className="text-[18px] sm:text-[20px] font-medium text-center">
              Total Shifts
            </p>
            <h2 className="text-[36px] sm:text-[50px] font-bold text-center">
              {shiftData.length}
            </h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-bl from-[#D6D446] via-40% via-[#F591B7] to-[#03C7BD] to-70% p-1 rounded-2xl min-w-[180px]">
          <div className="flex flex-col items-center justify-center bg-[#374151] rounded-2xl px-8 py-4 w-full">
            <p className="text-[18px] sm:text-[20px] font-medium text-center">
              Total Seats
            </p>
            <h2 className="text-[36px] sm:text-[50px] font-bold text-center">
              {seatData.length}
            </h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gradient-to-bl from-[#D6D446] via-40% via-[#F591B7] to-[#03C7BD] to-70% p-1 rounded-2xl min-w-[180px]">
          <div className="flex flex-col items-center justify-center bg-[#374151] rounded-2xl px-8 py-4 w-full">
            <p className="text-[18px] sm:text-[20px] font-medium text-center">
              Total Students
            </p>
            <h2 className="text-[36px] sm:text-[50px] font-bold text-center">
              {studentData.length}
            </h2>
          </div>
        </div>
      </div>

      <SeatsView />

      <div className="flex flex-col gap-6 mt-4 sm:flex-row sm:items-start sm:justify-between w-full">
        {/* QR Code Section */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-start mb-6 sm:mb-0">
          <QR />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
