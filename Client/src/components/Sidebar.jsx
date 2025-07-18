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
import { RxHamburgerMenu } from "react-icons/rx";

import ThemeToggle from "./ThemeToggle";
import { Context } from "../context/Context";
import { images } from "../assets/assets";

function Sidebar({ isMobileView, mobileOpen, setMobileOpen }) {
  const { theme, setToken } = useContext(Context);
  const bgColor = theme === "light" ? "bg-white" : "bg-transparent";
  const textColor = theme === "light" ? "text-black" : "text-white";
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <>
      {/* smaller screens */}
      {isMobileView && (
        <div className=" flex items-center justify-between py-[12px] px-[20px] sm:px-[40px] border-b-1 border-b-white  ">
          <div className="flex items-center self-start ml-[-4px] ">
            <img
              className="w-[55px] sm:w-[50px]"
              src={images.logo}
              alt="logo"
            />
            <img
              className="w-[160px] sm:w-[155px] "
              src={images.letterLogo}
              alt="logo"
            />
          </div>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`${
              mobileOpen ? "hidden" : ""
            } bg-[#ffffff10] p-2 rounded-md shadow-lg`}
            aria-label="Open sidebar"
          >
            <RxHamburgerMenu size={24} color="white" />
          </button>
        </div>
      )}

      {/* bigger screens */}
      {!isMobileView && (
        <div
          className={`${bgColor} ${textColor} border-r-1 border-r-[#FFFFFF] w-[20%] min-h-[100vh] max-h-screen text-[max(1vw,18px)] flex flex-col gap-12 justify-center items-start px-8 py-6 `}
        >
          <div className="flex items-center self-start ml-[-4px] ">
            <img
              className="w-[55px] sm:w-[50px]"
              src={images.logo}
              alt="logo"
            />
            <img
              className="w-[160px] sm:w-[155px] "
              src={images.letterLogo}
              alt="logo"
            />
          </div>
          <div className="flex flex-col items-start justify-between h-full ">
            <div className=" flex flex-col gap-4 ">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
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
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
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
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
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
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
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
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
                  } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer `
                }
              >
                <RiCalendarCheckLine size={20} />
                <p className="max-[900px]:hidden">Attendance</p>
              </NavLink>
            </div>
            <div className="flex flex-col gap-2 ">
              {/* <ThemeToggle /> */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
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
      )}

      {/* hamview */}
      {isMobileView && (
        <div
          className={`
            fixed top-0 right-0 z-50 h-full w-3/4 max-w-xs
            bg-gradient-to-bl from-[#484381] via-[#0F0E1B] to-[#0F0E1B]
            text-[max(1vw,18px)] flex flex-col gap-12 items-start px-4 py-6
            transition-transform duration-300 ease-in-out
            ${mobileOpen ? "translate-x-0" : "translate-x-full"}
          `}
          style={{ minWidth: "250px" }}
        >
          <div
            onClick={() => setMobileOpen((prev) => !prev)}
            className="self-end cursor-pointer"
          >
            <RxHamburgerMenu size={24} color="white" />
          </div>
          <div className="flex flex-col items-start justify-between h-full w-full">
            <div className=" flex flex-col gap-4 w-full">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
                  } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer w-full`
                }
                onClick={() => setMobileOpen(false)}
              >
                <LuLayoutDashboard size={20} />
                <p>Dashboard</p>
              </NavLink>
              <NavLink
                to="/new-admission"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
                  } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer w-full`
                }
                onClick={() => setMobileOpen(false)}
              >
                <GoPersonAdd size={20} />
                <p>New Admission</p>
              </NavLink>
              <NavLink
                to="/students"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
                  } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer w-full`
                }
                onClick={() => setMobileOpen(false)}
              >
                <GrGroup size={20} />
                <p>Student Record</p>
              </NavLink>
              <NavLink
                to="/addseats"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
                  } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer w-full`
                }
                onClick={() => setMobileOpen(false)}
              >
                <RiAddBoxLine size={20} />
                <p>Add Seats</p>
              </NavLink>
              <NavLink
                to="/attendance"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
                  } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer w-full`
                }
                onClick={() => setMobileOpen(false)}
              >
                <RiCalendarCheckLine size={20} />
                <p>Attendance</p>
              </NavLink>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {/* <ThemeToggle /> */}
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${
                    isActive ? "bg-[#374151] rounded-lg text-[#83ABDB] " : ""
                  } flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer w-full`
                }
                onClick={() => setMobileOpen(false)}
              >
                <CgProfile size={20} />
                <p>Profile</p>
              </NavLink>
              <div
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="flex items-center justify-start gap-[12px] p-[8px_10px] cursor-pointer w-full"
              >
                <RiLogoutCircleLine color="red" size={20} />
                <p>Logout</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
