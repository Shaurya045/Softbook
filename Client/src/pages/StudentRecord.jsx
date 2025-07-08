import React, { useContext, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
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
  }
  return "normal";
}

function StudentRecord() {
  const { studentData, backendURL, token, loadStudentData } =
    useContext(Context);
  const [showEdit, setShowEdit] = useState(false);
  const [item, setItem] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${backendURL}students/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { id },
      });
      if (response.data.success) {
        toast.success(response.data.message);
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
    <div className="relative w-full h-full">
      {showEdit && item && (
        <UpdateStudent setShowEdit={setShowEdit} item={item} />
      )}
      <div className="flex flex-col gap-9">
        <h1 className="text-[30px] font-semibold ">Student Record</h1>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-center justify-start gap-1.5 w-full bg-[#374151] rounded-lg px-4 py-2 shadow-2xl ">
            <IoSearchOutline color="white" size={26} />
            <input
              className="bg-transparent text-[20px] text-[#989FAB] outline-none p-1 w-full "
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              type="text"
              placeholder="Search by student name, room, shift, phone"
              placeholderTextColor="#989FAB"
            />
          </div>

          <div className=" rounded-xl ">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[#989FAB] text-[16px] font-normal ">
                  <th className="px-4 py-2">Sl. No.</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Room</th>
                  <th className="px-4 py-2">Shift</th>
                  <th className="px-4 py-2">Seat</th>
                  <th className="px-4 py-2">Phone</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Actions</th>
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
                    if (dueStatus === "danger") {
                      rowTextClass = "text-red-500";
                    } else if (dueStatus === "warning") {
                      rowTextClass = "text-yellow-400";
                    }
                    return (
                      <tr
                        key={index}
                        className={`bg-[#1F2937] text-[14px] px-4 py-2 font-normal align-middle rounded-xl overflow-hidden ${rowTextClass}`}
                      >
                        <td className="px-4 py-2 rounded-l-xl">
                          {" "}
                          {index + 1 < 10 ? `0${index + 1}` : index + 1}{" "}
                        </td>
                        <td className="px-4 py-2"> {item.studentName} </td>
                        <td className="px-4 py-2"> {item.room} </td>
                        <td className="px-4 py-2"> {item.shift} </td>
                        <td className="px-4 py-2">
                          {" "}
                          {item.seatNo < 10
                            ? `0${item.seatNo}`
                            : item.seatNo}{" "}
                        </td>
                        <td className="px-4 py-2">{item.phone}</td>
                        <td className="px-4 py-2">
                          {item.dueDate
                            ? new Date(item.dueDate).toLocaleDateString("en-GB")
                            : ""}
                        </td>
                        <td className=" py-2 rounded-r-xl">
                          <div className="flex gap-2 items-center justify-center">
                            <button
                              onClick={() => {
                                setShowEdit(true);
                                setItem(item);
                              }}
                              className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                            >
                              <MdModeEdit color="#4BDE80" size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                            >
                              <RiDeleteBin6Fill color="#EF4444" size={18} />
                            </button>
                            <button className="p-1 hover:bg-[#374151] rounded cursor-pointer">
                              <FaWhatsapp color="#4BDE80" size={18} />
                            </button>
                            <Link
                              to={`/students/${item._id}`}
                              className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                            >
                              <FiExternalLink color="#989FAB" size={18} />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center px-4 py-3">
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
      </div>
    </div>
  );
}

export default StudentRecord;
