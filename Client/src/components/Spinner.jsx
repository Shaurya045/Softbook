import React from "react";

function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc]">
      <div className="w-16 h-16 border-4 border-t-[#2a3de9] border-b-[#2a3de9] border-l-[#2a3de9] border-r-[#374151] rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;
