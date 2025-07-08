import React, { useContext } from "react";
import SeatsView from "../components/SeatsView";
import { Context } from "../context/Context";
import QR from "../components/QR";

function Dashboard() {
  const { studentData, rooms, shifts } = useContext(Context);
  return (
    <div className="flex flex-col gap-9">
      <h1 className="text-[30px] font-semibold ">Dashboard</h1>
      <div className="flex items-center justify-between ">
        <div className="flex flex-col items-center justify-center bg-[#374151] border-[1px] border-white rounded-lg px-20 py-4 ">
          <p className="text-[20px] font-medium">Total Rooms</p>
          <h2 className="text-[50px] font-bold ">{rooms.length}</h2>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#374151] border-[1px] border-white rounded-lg px-20 py-4 ">
          <p className="text-[20px] font-medium">Total Shifts</p>
          <h2 className="text-[50px] font-bold ">{shifts.length}</h2>
        </div>
        <div className="flex flex-col items-center justify-center bg-[#374151] border-[1px] border-white rounded-lg px-20 py-4 ">
          <p className="text-[20px] font-medium">Total Students</p>
          <h2 className="text-[50px] font-bold ">{studentData.length}</h2>
        </div>
      </div>
      <SeatsView />
      <QR />
    </div>
  );
}

export default Dashboard;
