import React, { useContext, useEffect, useState } from "react";
import SeatsView from "../components/SeatsView";
import { Context } from "../context/Context";
import QR from "../components/QR";

function Dashboard() {
  const { studentData, rooms, shifts } = useContext(Context);
  const [income, setIncome] = useState();
  const calculateIncome = () => {
    let total = 0;
    studentData.forEach((student) => {
      total += student.amount;
    });
    setIncome(total);
  };
  useEffect(() => {
    calculateIncome();
  }, [studentData]);
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
      <div className="flex items-start justify-between mt-4 ">
        <QR />
        <div className="flex flex-col items-center justify-center bg-[#374151] border-[1px] border-white rounded-lg px-20 py-4 w-140 h-50 ">
          <p className="text-[25px] font-medium">Total Revenue</p>
          <h2 className="text-[70px] font-bold text-[#4BDE80] ">
            Rs. {income}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
