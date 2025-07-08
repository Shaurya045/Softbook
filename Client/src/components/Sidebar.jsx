import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
// import { images } from "../assets/assets";
import { LuLayoutDashboard } from "react-icons/lu";
import { GoPersonAdd } from "react-icons/go";
import { RiLogoutCircleLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { GrGroup } from "react-icons/gr";
import { RiCalendarCheckLine } from "react-icons/ri";
import { RiAddBoxLine } from "react-icons/ri";

import ThemeToggle from "./ThemeToggle";
import { Context } from "../context/Context";

function Sidebar() {
  const { theme, setToken } = useContext(Context);
  const bgColor = theme === "light" ? "bg-white" : "bg-[#1F2937]";
  const textColor = theme === "light" ? "text-black" : "text-white";
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <div
      className={`${bgColor} ${textColor} w-[20%] min-h-[100vh] max-h-screen text-[max(1vw,18px)] flex flex-col gap-12 justify-center items-start px-8 py-6 `}
    >
      <h1 className="text-xl font-bold ">SOFT BOOK</h1>
      <div className="flex flex-col items-start justify-between h-full ">
        <div className=" flex flex-col gap-4 ">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${
                isActive ? "bg-[#374151] rounded-lg text-[#4BDE80] " : ""
              } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer `
            }
          >
            <LuLayoutDashboard size={20} />
            <p className="max-[900px]:hidden">Dashboard</p>
          </NavLink>
          <NavLink
            to="/new-admission"
            className={({ isActive }) =>
              `${
                isActive ? "bg-[#374151] rounded-lg text-[#4BDE80] " : ""
              } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer `
            }
          >
            <GoPersonAdd size={20} />
            <p className="max-[900px]:hidden">New Admission</p>
          </NavLink>
          <NavLink
            to="/students"
            className={({ isActive }) =>
              `${
                isActive ? "bg-[#374151] rounded-lg text-[#4BDE80] " : ""
              } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer `
            }
          >
            <GrGroup size={20} />
            <p className="max-[900px]:hidden">Student Record</p>
          </NavLink>
          <NavLink
            to="/addseats"
            className={({ isActive }) =>
              `${
                isActive ? "bg-[#374151] rounded-lg text-[#4BDE80] " : ""
              } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer `
            }
          >
            <RiAddBoxLine size={20} />
            <p className="max-[900px]:hidden">Add Seats</p>
          </NavLink>
          <NavLink
            to="/attendance"
            className={({ isActive }) =>
              `${
                isActive ? "bg-[#374151] rounded-lg text-[#4BDE80] " : ""
              } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer `
            }
          >
            <RiCalendarCheckLine size={20} />
            <p className="max-[900px]:hidden">Attendance</p>
          </NavLink>
        </div>
        <div className="flex flex-col gap-2 ">
          <ThemeToggle />
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${
                isActive ? "bg-[#374151] rounded-lg text-[#4BDE80] " : ""
              } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer `
            }
          >
            <CgProfile size={20} />
            <p className="max-[900px]:hidden">Profile</p>
          </NavLink>
          <div
            onClick={handleLogout}
            className="flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer"
          >
            <RiLogoutCircleLine color="red" size={20} />
            <p className="max-[900px]:hidden">Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
