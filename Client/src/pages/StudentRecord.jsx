import React, { useContext, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { BiSolidPhoneCall } from "react-icons/bi";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import UpdateStudent from "../components/UpdateStudent";
import { Link } from "react-router-dom";

function getDueDateStatus(dueDate) {
  if (!dueDate) return "normal";
  const now = new Date();
  const due = new Date(dueDate);
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) {
    return "danger";
  } else if (diffDays <= 7) {
    return "warning";
  } else if (diffDays < 0) {
    return "danger++";
  }
  return "normal";
}

function StudentRecord() {
  const { studentData, backendURL, token, loadStudentData } =
    useContext(Context);
  const [showEdit, setShowEdit] = useState(false);
  const [item, setItem] = useState({});
  const [search, setSearch] = useState("");
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredItems = studentData.filter((item) => {
    if (search === "") return true;
    const searchLower = search.toLowerCase();
    return (
      item.studentName.toLowerCase().startsWith(searchLower) ||
      item.room.toLowerCase().startsWith(searchLower) ||
      item.shift.toLowerCase().startsWith(searchLower) ||
      item.phone.toString().startsWith(searchLower)
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${backendURL}students/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: deleteID },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setDeleteID("");
        setDeleteShow(false);
        await loadStudentData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className=" w-full h-full">
      {showEdit && item && (
        <UpdateStudent setShowEdit={setShowEdit} item={item} />
      )}
      {deleteShow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000cc] w-full h-full overflow-y-auto px-6 pt-10 pb-10">
          <div className="bg-[#374151] p-4 sm:p-6 w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl h-auto flex flex-col items-center justify-center gap-6 rounded-xl mx-2">
            <p className="text-[18px] sm:text-[20px] font-semibold text-center break-words">
              Do You Want to Delete{" "}
              {studentData.find((item) => item._id === deleteID)?.studentName ||
                ""}
              's Data ?
            </p>
            <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-4 sm:gap-5">
              <button
                onClick={() => {
                  setDeleteShow(false);
                  setDeleteID("");
                }}
                className="bg-[#EF4444] p-2 sm:p-[10px] text-white text-[18px] sm:text-[20px] font-semibold rounded-[10px] w-full sm:w-1/2 cursor-pointer self-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-[#477CBF] p-2 sm:p-[10px] text-white text-[18px] sm:text-[20px] font-semibold rounded-[10px] w-full sm:w-1/2 cursor-pointer self-center"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 sm:gap-9 w-full">
        <h1 className="text-[22px] sm:text-[30px] font-semibold ">
          Student Record
        </h1>
        <div className="flex flex-col gap-4 sm:gap-6 w-full">
          {/* Search Bar */}
          <div className="flex flex-row items-center justify-start gap-2 w-full bg-[#374151] rounded-lg px-2 py-2 sm:px-4 shadow-2xl">
            <IoSearchOutline color="white" size={22} className=" block" />
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
                    <th className="px-2 sm:px-4 py-2">Due Date</th>
                    <th className="px-2 sm:px-4 py-2">Actions</th>
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
                      const dueStatus = getDueDateStatus(item.dueDate);
                      let rowTextClass = "";
                      if (dueStatus === "danger" || dueStatus === "danger++") {
                        rowTextClass = "text-red-500";
                      } else if (dueStatus === "warning") {
                        rowTextClass = "text-yellow-400";
                      }
                      return (
                        <tr
                          key={index}
                          className={`bg-[#1F2937] text-[12px] sm:text-[14px] px-2 sm:px-4 py-2 font-normal align-middle rounded-xl overflow-hidden ${rowTextClass}`}
                        >
                          <td className="px-2 sm:px-4 py-2 rounded-l-xl">
                            {(currentPage - 1) * itemsPerPage + index + 1 < 10
                              ? `0${
                                  (currentPage - 1) * itemsPerPage + index + 1
                                }`
                              : (currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-2 sm:px-4 py-2 break-words max-w-[120px] sm:max-w-none">
                            {" "}
                            {item.studentName}{" "}
                          </td>
                          <td className="px-2 sm:px-4 py-2">{item.room}</td>
                          <td className="px-2 sm:px-4 py-2">{item.shift}</td>
                          <td className="px-2 sm:px-4 py-2">
                            {item.seatNo < 10 ? `0${item.seatNo}` : item.seatNo}
                          </td>
                          <td className="px-2 sm:px-4 py-2 break-all">
                            {item.phone}
                          </td>
                          <td className="px-2 sm:px-4 py-2">
                            {item.dueDate
                              ? new Date(item.dueDate).toLocaleDateString(
                                  "en-GB"
                                )
                              : ""}
                          </td>
                          <td className="py-2 rounded-r-xl">
                            <div className="flex gap-1 sm:gap-2 items-center justify-center flex-wrap">
                              <button
                                onClick={() => {
                                  setShowEdit(true);
                                  setItem(item);
                                }}
                                className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                                aria-label="Edit"
                              >
                                <MdModeEdit
                                  color="#83ABDB"
                                  size={16}
                                  className="sm:size-[18px]"
                                />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteID(item._id);
                                  setDeleteShow(true);
                                }}
                                className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                                aria-label="Delete"
                              >
                                <RiDeleteBin6Fill
                                  color="#EF4444"
                                  size={16}
                                  className="sm:size-[18px]"
                                />
                              </button>
                              <a
                                href={`https://wa.me/${item.phone}?text=Dear ${
                                  item.studentName
                                }, ${
                                  dueStatus === "normal"
                                    ? `this is to inform you that your payment is overdue. Please pay your membership fees as soon as possible.`
                                    : `this is to inform you that the due date for your library membership is on the ${new Date(
                                        item.dueDate
                                      ).toLocaleDateString(
                                        "en-Gb"
                                      )}. Please pay the membership fee before the due date to continue using the service.`
                                }`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <button
                                  className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                                  aria-label="Whatsapp"
                                >
                                  <FaWhatsapp
                                    color="#4BDE80"
                                    size={16}
                                    className="sm:size-[18px]"
                                  />
                                </button>
                              </a>{" "}
                              <a href={`tel:${item.phone}`} className="block md:hidden">
                                <button
                                  className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                                  aria-label="Phone"
                                >
                                  <BiSolidPhoneCall
                                    color="#BBD3EE"
                                    size={16}
                                    className="sm:size-[18px]"
                                  />
                                </button>
                              </a>
                              <Link
                                to={`/students/${item._id}`}
                                className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                                aria-label="View Details"
                              >
                                <FiExternalLink
                                  color="#989FAB"
                                  size={16}
                                  className="sm:size-[18px]"
                                />
                              </Link>
                            </div>
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
                        ? "bg-[#4BDE80] text-white"
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
    </div>
  );
}

export default StudentRecord;
