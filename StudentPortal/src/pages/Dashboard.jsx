import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { CgProfile } from "react-icons/cg";
import AttendanceTable from "../component/AttendanceTable";
import EmailUpdateModal from "../component/EmailUpdateModal";

function Dashboard() {
  const { studentData, profileData, studentAuthData, token } =
    useContext(Context);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const dueDate = new Date(studentData.dueDate);
  const today = new Date();
  dueDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const dayLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    if (studentAuthData === null || studentAuthData === undefined) return;
    if (token && studentAuthData) {
      const hasNoEmail =
        !studentAuthData.email ||
        studentAuthData.email === null ||
        studentAuthData.email === undefined ||
        studentAuthData.email === "";

      if (hasNoEmail) {
        setIsEmailModalOpen(true);
      } else {
        setIsEmailModalOpen(false);
      }
    }
  }, [token, studentAuthData]);

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-center justify-between">
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
          <div className="flex flex-col items-start">
            <h2 className="text-[22px]">{studentData.studentName}</h2>
            <p className="mt-[-8px] text-[#989FAB] text-[16px] font-medium ">
              {profileData.libraryName}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p
            className={`text-[14px] ${
              dayLeft <= 3
                ? "text-red-500"
                : dayLeft <= 7
                ? "text-yellow-400"
                : ""
            }`}
          >
            {dayLeft} {dayLeft === 1 ? "day" : "days"} left
          </p>
          <p className="text-[14px] bg-gray-500 px-[3px] rounded-[5px] ">
            {new Date(studentData.dueDate).toLocaleDateString("en-Gb")}
          </p>
        </div>
      </div>
      <AttendanceTable />
      <EmailUpdateModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
}

export default Dashboard;
