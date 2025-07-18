import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { MdOutlineFileDownload } from "react-icons/md";
import PDF2 from "../components/PDF2";
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

function IndividualStudent() {
  const { token, backendURL } = useContext(Context);
  const [data, setData] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [image, setImage] = useState("");

  const totalPages = Math.ceil(attendance.length / itemsPerPage);
  const paginatedItems = attendance.slice(
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

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}students/getstudent`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);
      if (response.data.success) {
        setData(response.data.student);
        setLoading(false);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (data && data._id) {
      const loadAttendanceData = async () => {
        try {
          // Use query param for studentId as per backend
          const response = await axios.get(
            `${backendURL}attendance/admin?studentId=${data._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          // console.log(response);
          if (response.data.success) {
            setAttendance(response.data.attendance || []);
          }
        } catch (err) {
          console.error("Error fetching attendance:", err);
        }
      };
      loadAttendanceData();
    }
  }, [data, backendURL, token]);

  if (loading) {
    return <div>Data being loaded...</div>;
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-9">
      {image && (
        <div className="fixed inset-0 z-50 bg-[#000000cc] flex items-center justify-center p-4">
          <div className="relative max-w-full max-h-full w-[90vw] h-[90vh] sm:w-[500px] sm:h-[500px] bg-transparent rounded-xl flex items-center justify-center overflow-hidden">
            <img
              className="w-full h-full object-contain rounded-xl"
              src={image}
              alt="student image or idupload"
            />
            <button
              onClick={() => setImage("")}
              className="absolute top-2 right-2 bg-[#1F2937] bg-opacity-80 rounded-full p-1 hover:bg-[#303A96] transition"
              aria-label="Close image preview"
            >
              <IoClose size={28} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Student Info */}
      <h1 className="text-[22px] sm:text-[30px] font-semibold ">Student Profile</h1>
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between w-full">
        {/* Left: Student Info */}
        <div className="w-full md:w-4/5 flex flex-col gap-4">
          <div className="flex flex-col p-5 rounded-xl gap-4 justify-center bg-[#1F2937] w-full shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex flex-col">
                <span className="text-[#BBD3EE] text-sm font-semibold">
                  Student Name
                </span>
                <span className="text-lg font-medium text-white">
                  {data.studentName}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#BBD3EE] text-sm font-semibold">
                  Father Name
                </span>
                <span className="text-lg font-medium text-white">
                  {data.fatherName}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#BBD3EE] text-sm font-semibold">
                  Room
                </span>
                <span className="text-lg font-medium text-white">
                  {data.room}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#BBD3EE] text-sm font-semibold">
                  Shift
                </span>
                <span className="text-lg font-medium text-white">
                  {data.shift}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#BBD3EE] text-sm font-semibold">
                  Seat No.
                </span>
                <span className="text-lg font-medium text-white">
                  {data.seatNo}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#BBD3EE] text-sm font-semibold">
                  Phone No.
                </span>
                <span className="text-lg font-medium text-white">
                  {data.phone}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[#BBD3EE] text-sm font-semibold">
                  Due Date
                </span>
                <span className="text-lg font-medium text-white">
                  {data.dueDate
                    ? new Date(data.dueDate).toLocaleDateString("en-GB")
                    : "-"}
                </span>
              </div>
              <div className="flex flex-col sm:col-span-2">
                <span className="text-[#BBD3EE] text-sm font-semibold">
                  Local Address
                </span>
                <span className="text-lg font-medium text-white break-words">
                  {data.localAdd}
                </span>
              </div>
            </div>
          </div>
          <button
            className="w-full bg-[#303A96] transition px-6 py-2 text-[18px] rounded-xl cursor-pointer flex items-center justify-center gap-2 text-white font-semibold shadow-md"
            onClick={() => setShowPDF(true)}
            type="button"
          >
            <MdOutlineFileDownload size={23} />
            <span>View / Download Receipt</span>
          </button>
        </div>
        {/* Right: Images */}
        <div className="flex flex-col gap-6 w-full md:w-1/5 mt-6 md:mt-0">
          {data.image ? (
            <div className="w-full h-50 rounded-xl overflow-hidden bg-[#23272f] flex items-center justify-center cursor-pointer">
              <img
                onClick={() => setImage(data.image)}
                className="object-center w-full h-full"
                src={data.image}
                alt={data.studentName}
              />
            </div>
          ) : (
            <div className="w-full h-50 rounded-xl bg-[#23272f] flex items-center justify-center text-gray-400 text-sm">
              No Photo
            </div>
          )}
          <div className="w-full h-50 rounded-xl overflow-hidden bg-[#23272f] flex items-center justify-center cursor-pointer">
            {data.idUpload ? (
              <img
                onClick={() => setImage(data.idUpload)}
                className="object-center w-full h-full"
                src={data.idUpload}
                alt={data.studentName}
              />
            ) : (
              <span className="text-gray-400 text-sm">No ID Uploaded</span>
            )}
          </div>
        </div>
      </div>

      {/* PDF Preview */}
      {showPDF && (
        <div className="flex flex-col gap-3 sm:gap-0 ">
          <button
            className=" w-[150px] bg-[#303A96] text-white p-[10px] rounded-xl cursor-pointer  "
            onClick={() => setShowPDF(false)}
          >
            Hide PDF
          </button>
          <PDF2 studentData={data} />
        </div>
      )}

      {/* Attendance Table */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <h2 className="text-[20px] sm:text-[25px] font-medium ">Attendance</h2>
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
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(e.target.value)}
                className="text-[#989FAB] bg-[#374151] rounded px-3 py-1 outline-none "
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
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
                      ? "bg-[#303A96] text-white"
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
  );
}

export default IndividualStudent;
