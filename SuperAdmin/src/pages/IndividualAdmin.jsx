import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function IndividualAdmin() {
  const { token, backendURL } = useContext(Context);
  const { id } = useParams();
  const [adminData, setAdminData] = useState({});
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}superadmin/getadmin`,
        { libraryId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //   console.log(response);
      if (response.data.success) {
        setAdminData(response.data.admin);
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

  const loadStudentData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}superadmin/allstudent`,
        { libraryId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      //   console.log(response);
      if (response.data.success) {
        setStudentsData(response.data.students);
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
    loadAdminData();
    loadStudentData();
  }, [id]);

  if (loading) {
    return <div>Data being loaded...</div>;
  }

  return (
    <div className="flex flex-col gap-9 w-full">
      <h1 className="text-[30px] font-semibold">Profile</h1>
      <div className="bg-[#1F2937] p-7 rounded-xl shadow-lg flex flex-col gap-6 w-full max-w-2xl ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <div className="flex flex-col">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Owner Name
            </span>
            <span className="text-lg font-medium text-white break-words">
              {adminData.name}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#BBD3EE] text-sm font-semibold">Email</span>
            <span className="text-lg font-medium text-white break-words">
              {adminData.email}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Phone No.
            </span>
            <span className="text-lg font-medium text-white break-words">
              {adminData.phone}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Library Name
            </span>
            <span className="text-lg font-medium text-white break-words">
              {adminData.libraryName}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Total Students
            </span>
            <span className="text-lg font-medium text-white break-words">
              {studentsData.length}
            </span>
          </div>
          <div className="flex flex-col ">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Subscription
            </span>
            <span className="text-lg font-medium text-white break-words">
              {adminData.subscription?.active ? (
                <>
                  <span className="text-green-400 font-semibold">Active</span>
                  {adminData.subscription.plan && (
                    <span className="ml-2 text-[#BBD3EE]">
                      (
                      {adminData.subscription.plan.charAt(0).toUpperCase() +
                        adminData.subscription.plan.slice(1)}{" "}
                      Plan)
                    </span>
                  )}
                  {adminData.subscription.expiresAt && (
                    <span className="ml-2 text-[#BBD3EE]">
                      Expires:{" "}
                      {new Date(
                        adminData.subscription.expiresAt
                      ).toLocaleDateString("en-GB")}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-red-400 font-semibold">Inactive</span>
              )}
            </span>
          </div>
          <div className="flex flex-col sm:col-span-2">
            <span className="text-[#BBD3EE] text-sm font-semibold">
              Address
            </span>
            <span className="text-lg font-medium text-white break-words">
              {adminData.address}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndividualAdmin;
