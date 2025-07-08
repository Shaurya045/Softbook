import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

function IndividualStudent() {
  const { token, backendURL } = useContext(Context);
  const [data, setData] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Data being loaded...</div>;
  }

  return (
    <div className="flex flex-col gap-9">
      <h1 className="text-[30px] font-semibold ">Student Profile</h1>
      <div className="flex gap-5 items-start justify-between w-full">
        <div className="flex flex-col p-5 rounded-xl gap-4 justify-center bg-[#1F2937] w-2/3 ">
          <div className="flex gap-5">
            <p>Student Name: </p>
            <p>{data.studentName}</p>
          </div>
          <div className="flex gap-5">
            <p>Father Name: </p>
            <p>{data.fatherName}</p>
          </div>
          <div className="flex gap-5">
            <p>Room: </p>
            <p>{data.room}</p>
          </div>
          <div className="flex gap-5">
            <p>Shift: </p>
            <p>{data.shift}</p>
          </div>
          <div className="flex gap-5">
            <p>Seat No.: </p>
            <p>{data.seatNo}</p>
          </div>
          <div className="flex gap-5">
            <p>Phone No.: </p>
            <p>{data.phone}</p>
          </div>
          <div className="flex gap-5">
            <p>DueDate: </p>
            <p>{new Date(data.dueDate).toLocaleDateString("en-GB")}</p>
          </div>
          <div className="flex gap-5">
            <p>Local Address: </p>
            <p>{data.localAdd}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="w-40 h-50 rounded-xl overflow-hidden">
            {data.image ? (
              <img src={data.image} alt={data.studentName} />
            ) : null}
          </div>
          <img className="w-40 rounded-xl" src={data.idUpload} alt={data.studentName} />
        </div>
      </div>
      {/* Attendance Table */}
    </div>
  );
}

export default IndividualStudent;
