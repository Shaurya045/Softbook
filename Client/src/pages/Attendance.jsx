import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import { IoSearchOutline } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

function Attendance() {
  const { attendanceData } = useContext(Context);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Only include items with a valid student object
  const filteredItems = attendanceData.filter((item) => {
    const itemDate = new Date(item.date).toISOString().split("T")[0];
    if (itemDate !== date) return false;
    if (!item.student) return false;
    if (search === "") return true;

    const searchLower = search.toLowerCase();
    return (
      item.student.studentName.toLowerCase().startsWith(searchLower) ||
      item.student.room.toLowerCase().startsWith(searchLower) ||
      item.student.shift.toLowerCase().startsWith(searchLower) ||
      item.student.phone.toString().startsWith(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
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
    <div className="flex flex-col gap-6 sm:gap-9 w-full">
      <h1 className="text-[22px] sm:text-[30px] font-semibold ">
        Attendance Record
      </h1>
      <div className="flex flex-col gap-4 sm:gap-6 w-full">
        {/* Search and Date Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
          <div className="flex flex-row items-center gap-2 w-full sm:w-[60%] bg-[#374151] rounded-lg px-2 sm:px-4 py-2 shadow-2xl">
            <IoSearchOutline color="white" size={22} className="block" />
            <input
              className="bg-transparent text-[16px] sm:text-[20px] text-[#989FAB] outline-none p-1 w-full"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              type="text"
              placeholder="Search by student name, room, shift, phone"
              placeholdertextcolor="#989FAB"
            />
          </div>
          <div className="bg-[#3F62AE] px-2 sm:px-4 py-2 rounded-lg text-[16px] sm:text-[20px] flex items-center w-full sm:w-auto">
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white outline-none w-full"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div
          className="rounded-xl w-full overflow-x-auto mb-6"
          style={{
            scrollbarWidth: "none", // Firefox
            msOverflowStyle: "none", // IE 10+
          }}
        >
          <style>
            {`
              /* Hide scrollbar for Chrome, Safari and Opera */
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
              /* Hide scrollbar for IE, Edge and Firefox */
              .hide-scrollbar {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
              }
            `}
          </style>
          <div className="hide-scrollbar" style={{ overflowX: "auto" }}>
            <table className="min-w-[600px] w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[#989FAB] text-[13px] sm:text-[16px] font-normal">
                  <th className="px-2 sm:px-4 py-2">Sl. No.</th>
                  <th className="px-2 sm:px-4 py-2">Name</th>
                  <th className="px-2 sm:px-4 py-2">Room</th>
                  <th className="px-2 sm:px-4 py-2">Shift</th>
                  <th className="px-2 sm:px-4 py-2">Seat</th>
                  <th className="px-2 sm:px-4 py-2">Phone</th>
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
                    if (!item.student) return null;
                    const student = item.student;
                    return (
                      <tr
                        key={index}
                        className={`bg-[#1F2937] text-[12px] sm:text-[14px] px-2 sm:px-4 py-2 font-normal align-middle rounded-xl overflow-hidden`}
                      >
                        <td className="px-2 sm:px-4 py-2 rounded-l-xl">
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </td>
                        <td className="px-2 sm:px-4 py-2 break-words max-w-[120px] sm:max-w-none">
                          {student.studentName}
                        </td>
                        <td className="px-2 sm:px-4 py-2">{student.room}</td>
                        <td className="px-2 sm:px-4 py-2">{student.shift}</td>
                        <td className="px-2 sm:px-4 py-2">
                          {typeof student.seatNo === "number" ||
                          (typeof student.seatNo === "string" &&
                            student.seatNo !== "")
                            ? student.seatNo < 10
                              ? `0${student.seatNo}`
                              : student.seatNo
                            : ""}
                        </td>
                        <td className="px-2 sm:px-4 py-2 rounded-r-xl">
                          {student.phone}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center px-2 sm:px-4 py-3 gap-2">
            <div className="text-[#989FAB] text-xs sm:text-sm text-center sm:text-left">
              Showing Page{" "}
              <span className="font-medium">
                {totalPages === 0 ? 0 : currentPage}
              </span>{" "}
              of <span className="font-medium">{totalPages}</span> Pages
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
                className="text-[#989FAB] bg-[#374151] rounded px-2 py-1 outline-none text-xs sm:text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <button
                className={`px-2 sm:px-3 py-1 rounded border bg-[#374151] hover:bg-[#989FAB] disabled:opacity-50 cursor-pointer`}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1 || totalPages === 0}
                aria-label="Previous Page"
              >
                <FaAngleLeft />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-2 sm:px-3 py-1 rounded border border-gray-300 cursor-pointer ${
                    currentPage === i + 1
                      ? "bg-[#303A96] text-white"
                      : "bg-[#374151] hover:bg-[#989FAB]"
                  }`}
                  onClick={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className={`px-2 sm:px-3 py-1 rounded border bg-[#374151] hover:bg-[#989FAB] disabled:opacity-50 cursor-pointer`}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                aria-label="Next Page"
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
