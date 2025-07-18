import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import { images } from "../assets/assets";

function Login() {
  const { backendURL, token, setToken } = useContext(Context);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendURL}admin/login`, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="flex flex-col items-center w-full min-h-screen ">
      <Link
        to="/"
        className="flex items-center self-start mt-4 ml-4 z-20"
      >
        <img
          className="w-[50px] sm:w-[55px] md:w-[65px] lg:w-[75px]"
          src={images.logo}
          alt="logo"
        />
        <img
          className="w-[140px] sm:w-[160px] md:w-[200px] lg:w-[233px]"
          src={images.letterLogo}
          alt="logo"
        />
      </Link>
      <div className="flex flex-col justify-center flex-1 w-full max-w-[600px] px-4 sm:px-8 gap-8 mt-[-30px] sm:mt-[-50px]">
        <div className="text-center">
          <h1 className="text-[24px] sm:text-[30px] font-semibold">Welcome!</h1>
          <p className="text-[#757C89] text-[15px] sm:text-base">
            Sing In and see your records
          </p>
        </div>
        <form
          className="flex flex-col gap-[24px] sm:gap-[30px] w-full"
          onSubmit={onSubmitHandler}
        >
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[15px] sm:text-[16px] font-semibold pl-[3px]">
              Email
            </p>
            <input
              value={data.email}
              onChange={onChangeHandler}
              name="email"
              className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base"
              type="email"
              placeholder="sanjay123@gmail.com"
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[15px] sm:text-[16px] font-semibold pl-[3px]">
              Password
            </p>
            <input
              value={data.password}
              onChange={onChangeHandler}
              name="password"
              className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base"
              type="password"
              placeholder="password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#303A96] p-[10px] text-white text-[18px] sm:text-[20px] font-semibold rounded-[10px] w-full  max-w-full cursor-pointer self-center transition-all"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-[15px] sm:text-base">
          Create new account{" "}
          <span
            className="cursor-pointer text-[#83ABDB] underline"
            onClick={() => navigate("/register")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
