import React, { useContext, useState } from "react";
import { Context } from "../context/Context";

import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

function AttendanceTable() {
  const { attendanceData } = useContext(Context);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(attendanceData.length / itemsPerPage);
  const paginatedItems = attendanceData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }
  return (
    <div>
      <div className=" rounded-xl shadow-sm ">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[#989FAB] text-[16px] font-normal ">
              <th className="px-4 py-2">Sl. No.</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  No data found.
                </td>
              </tr>
            ) : (
              paginatedItems.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`bg-[#1F2937] text-[14px] px-4 py-2 font-normal align-middle rounded-xl overflow-hidden `}
                  >
                    <td className="px-4 py-2 rounded-l-xl">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(item.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 py-2 rounded-r-xl">
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex flex-col gap-3 sm:flex-row justify-between items-center px-4 py-3">
          <div className="text-[#989FAB] text-sm">
            Showing Page{" "}
            <span className=" font-medium">
              {totalPages === 0 ? 0 : currentPage}
            </span>{" "}
            of <span className=" font-medium">{totalPages}</span> Pages
          </div>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded border bg-[#374151] hover:bg-[#989FAB] disabled:opacity-50 cursor-pointer`}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || totalPages === 0}
            >
              <FaAngleLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 rounded border border-gray-300 cursor-pointer ${
                  currentPage === i + 1
                    ? "bg-[#4BDE80] text-white"
                    : "bg-[#374151]  hover:bg-[#989FAB]"
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={`px-3 py-1 rounded border bg-[#374151]  hover:bg-[#989FAB] disabled:opacity-50 cursor-pointer`}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceTable;
