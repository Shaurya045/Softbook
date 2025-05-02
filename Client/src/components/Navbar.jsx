import React from "react";
import { images } from "../assets/assets";

function Navbar() {
  return (
    <div className=" h-[100px] flex justify-center items-center p-[8px_4%] bg-[#ffffff]">
      <div className="flex items-center">
        <img className="w-[120px] sm:w-[150px]" src={images.logo} alt="logo" />
        <p className="font-bold text-2xl sm:text-3xl text-[#539486] ">PRATAP LIBRARY</p>
      </div>
    </div>
  );
}

export default Navbar;
