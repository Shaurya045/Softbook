import React, { useContext } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RiCalendarCheckLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { Context } from "../context/Context";
import { images } from "../assets/assets";

function Sidebar() {
  const { theme, setToken } = useContext(Context);
  const bgColor = theme === "light" ? "bg-white" : "bg-transparent";
  const textColor = theme === "light" ? "text-black" : "text-white";
  const navigate = useNavigate();
  const { libraryId } = useParams();

  const handleLogout = () => {
    navigate(`/${libraryId}/login`);
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <div
      className={`${bgColor} ${textColor} border-r-1 border-r-[#FFFFFF] w-[20%] min-h-[100vh] max-h-screen text-[max(1vw,18px)] flex flex-col gap-12 justify-center items-start px-4 sm:px-8 py-6 `}
    >
      <div className="flex items-center min-[900px]:ml-[-10px] ">
        <img className="w-12 min-[1300px]:w-15" src={images.logo} alt="logo" />
        <img
          className="max-[900px]:hidden w-30 min-[1300px]:w-38 "
          src={images.letterLogo}
          alt="softbook"
        />
      </div>
      <div className="flex flex-col items-start justify-between h-full ">
        <div className=" flex flex-col gap-4 ">
          <NavLink
            to={`/${libraryId}/dashboard`}
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
            to={`/${libraryId}/attendance`}
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
          <NavLink
            to={`/${libraryId}/profile`}
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
  );
}

export default Sidebar;
