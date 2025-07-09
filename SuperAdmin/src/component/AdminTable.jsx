import React, { useState, useContext } from "react";
import { Context } from "../context/Context";
import { IoSearchOutline } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

function AdminTable() {
  const { adminsData, backendURL, token, loadAdminsData } = useContext(Context);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
                let rowTextClass = "";
                if (!item.subscription.active) {
                  rowTextClass = "text-red-500";
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
                    <td className="px-4 py-2">
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
                        >
                          <option value="Active">Active</option>
                          <option value="Expired">Expired</option>
                        </select>
                        <button className="p-1 hover:bg-[#374151] rounded cursor-pointer">
                          <FaWhatsapp color="#4BDE80" size={18} />
                        </button>
                        {/* <Link
                          to={`/students/${item._id}`}
                          className="p-1 hover:bg-[#374151] rounded cursor-pointer"
                        >
                          <FiExternalLink color="#989FAB" size={18} />
                        </Link> */}
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
