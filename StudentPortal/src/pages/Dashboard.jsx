import React, { useContext } from "react";
import { Context } from "../context/Context";
import { CgProfile } from "react-icons/cg";
import AttendanceTable from "../component/AttendanceTable";

function Dashboard() {
  const { studentData } = useContext(Context);
  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center gap-3">
        <div className="w-10 rounded-full overflow-hidden ">
          {studentData.image ? (
            <img
              className="object-cover w-10 h-10 rounded-full"
              src={studentData.image}
              alt=""
            />
          ) : (
            <CgProfile size={40} />
          )}
        </div>
        <h2 className="text-[30px]">{studentData.studentName}</h2>
      </div>
      <AttendanceTable />
    </div>
  );
}

export default Dashboard;
