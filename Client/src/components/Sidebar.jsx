import React from "react";
import { NavLink } from "react-router-dom";
import { images } from "../assets/assets";

function Sidebar() {
  return (
    <div className="w-[18%] min-h-[100vh] border-[1.5px] border-solid border-[#a9a9a9] border-t-0 text-[max(1vw,10px)] ">
      <div className="pt-[50px] pl-[20%] flex flex-col gap-[20px] ">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${
              isActive ? "bg-[#edffed] border-green-600" : ""
            } flex items-center justify-center gap-[12px] border-[1px] border-solid border-[#a9a9a9] border-r-0 p-[8px_10px] rounded-[3px_0_0_3px] cursor-pointer `
          }
        >
          {/* <img src={assets.add_icon} alt="add_icon" /> */}
          <p className="max-[900px]:hidden">Dashboard</p>
        </NavLink>
        <NavLink
          to="/new-admission"
          className={({ isActive }) =>
            `${
              isActive ? "bg-[#edffed] border-green-600" : ""
            } flex items-center justify-center gap-[12px] border-[1px] border-solid border-[#a9a9a9] border-r-0 p-[8px_10px] rounded-[3px_0_0_3px] cursor-pointer `
          }
        >
          <img className="w-[20px]" src={images.add} alt="add_icon" />
          <p className="max-[900px]:hidden">New Admission</p>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
