import React, { useState, useContext } from "react";
import { Context } from "../context/Context";
import { IoSearchOutline } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FiExternalLink } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function getDueDateStatus(dueDate) {
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

function AdminTable() {
  const { adminsData, backendURL, token, loadAdminsData } = useContext(Context);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const itemsPerPage = 10;

  const filteredItems = adminsData.filter((item) => {
    if (search === "") return true;
    const searchLower = search.toLowerCase();
    return (
      item.name.toLowerCase().startsWith(searchLower) ||
      item.phone.toString().startsWith(searchLower) ||
      item.libraryName.toLowerCase().startsWith(searchLower)
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

  const handleSubscription = async (e, adminId) => {
    try {
      const status = e.target.value === "Active" ? true : false;
      const response = await axios.patch(
        `${backendURL}admin/updatesubscription`,
        {
          adminId,
          active: status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        loadAdminsData();
      }
    } catch (error) {
      console.log(error);
      toast.erro(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${backendURL}superadmin/deleteadmin`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { libraryId: deleteID },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setDeleteID("");
        setDeleteShow(false);
        await loadAdminsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
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

      {deleteShow && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#00000060] ">
          <div className="bg-[#989FAB] p-5 w-1/3 h-1/3 flex flex-col items-center justify-center gap-6 rounded-xl ">
            <p className="text-[20px] font-semibold text-center ">
              Do You Want to Delete{" "}
              {adminsData.find((item) => item._id === deleteID)?.libraryName ||
                ""}
              's Data?
            </p>
            <div className="flex w-full items-center justify-center gap-5 ">
              <button
                onClick={() => {
                  setDeleteShow(false);
                  setDeleteID("");
                }}
                className="bg-[#EF4444] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-1/2 cursor-pointer self-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-[#4BDE80] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-1/2 cursor-pointer self-center "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className=" rounded-xl ">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[#989FAB] text-[16px] font-normal ">
              <th className="px-4 py-2">Sl. No.</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Library Name</th>
              <th className="px-4 py-2">Subscription</th>
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
                let subscriptionTextClass = "";
                if (!item.subscription.active) {
                  subscriptionTextClass = "text-red-500";
                } else {
                  subscriptionTextClass = "text-green-500";
                }

                const dueStatus = getDueDateStatus(item.subscription.expiresAt);
                let rowTextClass = "";
                if (dueStatus <= 3) {
                  rowTextClass = "text-red-500";
                } else if (dueStatus <= 7) {
                  rowTextClass = "text-yellow-400";
                }
                return (
                  <tr
                    key={index}
                    className={`bg-[#1F2937] text-[14px] px-4 py-2 font-normal align-middle rounded-xl overflow-hidden ${rowTextClass} `}
                  >
                    <td className="px-4 py-2 rounded-l-xl">
                      {" "}
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}{" "}
                    </td>
                    <td className="px-4 py-2"> {item.name} </td>
                    <td className="px-4 py-2">{item.phone}</td>
                    <td className="px-4 py-2">{item.libraryName}</td>
                    <td className={`px-4 py-2 ${subscriptionTextClass}`}>
                      {item.subscription.active ? "Active" : "Expired"}
                    </td>
                    <td className=" py-2 rounded-r-xl">
                      <div className="flex gap-2 items-center justify-start">
                        {/* <button
                          onClick={() => {
                            setShowEdit(true);
                            setItem(item);
                          }}
                          className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                        >
                          <MdModeEdit color="#4BDE80" size={18} />
                        </button> */}
                        <select
                          onChange={(e) => handleSubscription(e, item._id)}
                          value={
                            item.subscription.active ? "Active" : "Expired"
                          }
                          className="bg-[#1F2937]"
                        >
                          <option value="Active">Active</option>
                          <option value="Expired">Expired</option>
                        </select>

                        <a
                          href={`https://wa.me/${item.phone}?text=Dear ${
                            item.name
                          }, ${
                            dueStatus <= 0
                              ? `this is to inform you that your payment is overdue. Please pay your subscription fees as soon as possible.`
                              : `this is to inform you that the due date for your library subscription is on the *${new Date(
                                  item.subscription.expiresAt
                                ).toLocaleDateString(
                                  "en-Gb"
                                )}*. Please pay the subscription fee before the due date to continue using the service.`
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="p-1 hover:bg-[#374151] rounded cursor-pointer">
                            <FaWhatsapp color="#4BDE80" size={18} />
                          </button>
                        </a>
                        <button
                          onClick={() => {
                            setDeleteID(item._id);
                            setDeleteShow(true);
                          }}
                          className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                        >
                          <RiDeleteBin6Fill color="#EF4444" size={18} />
                        </button>
                        <Link
                          to={`/admin/${item._id}`}
                          className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                        >
                          <FiExternalLink color="#989FAB" size={18} />
                        </Link>
                        <p>{dueStatus}</p>
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
  );
}

export default AdminTable;
