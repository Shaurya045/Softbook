import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/Context";
import { toast } from "react-toastify";

function Register() {
  const { backendURL, token } = useContext(Context);
  const [data, setData] = useState({
    phone: "",
    password: "",
  });
  const navigate = useNavigate();
  const { libraryId } = useParams();

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let payload = { ...data, libraryId: libraryId };
      const response = await axios.post(
        `${backendURL}studentauth/register`,
        payload
      );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/${libraryId}/login`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // Show backend error message if available
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (token) {
      navigate(`/${libraryId}/dashboard`);
    }
  }, [token, libraryId]);

  return (
    <div className="flex flex-col items-center w-full h-screen px-6 ">
      <Link to="/" className="flex items-center self-start mt-1 ml-6">
        {/* <img className="w-24" src={images.logo} alt="" /> */}
      </Link>
      <div className=" flex flex-col justify-center max-[640px]:w-full h-full gap-8 mt-[-50px] ">
        <div>
          <h1 className="text-[30px] font-semibold ">Welcome!</h1>
          <p className="text-[#757C89] ">Sign Up and mark your attendance</p>
          <p className="text-sm text-red-400 mt-2">
            Note: You can only register if you are already admitted to this
            study center.
          </p>
        </div>
        <form
          className="flex flex-col gap-[30px] w-full "
          onSubmit={onSubmitHandler}
        >
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[16px] font-semibold pl-[3px] ">Phone</p>
            <input
              value={data.phone}
              onChange={onChangeHandler}
              name="phone"
              className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
              type="text"
              placeholder="76672XXXXX"
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[16px] font-semibold pl-[3px] ">Password</p>
            <input
              value={data.password}
              onChange={onChangeHandler}
              name="password"
              className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
              type="password"
              placeholder="password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#4BDE80] p-[10px] text-[#101826] text-[20px] font-semibold rounded-[10px] w-full sm:w-[500px] cursor-pointer self-center "
          >
            Sign Up
          </button>
        </form>
        <p>
          Already registered?{" "}
          <span
            className="cursor-pointer text-[#4BDE80] "
            onClick={() => navigate(`/${libraryId}/login`)}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
