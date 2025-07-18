import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
import { images } from "../assets/assets";

function Register() {
  const { backendURL, token } = useContext(Context);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    libraryName: "",
    password: "",
    address: "",
  });
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const navigate = useNavigate();

  // Get location on first mount
  useEffect(() => {
    if (!location) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
            setLocationError("");
          },
          () => {
            setLocationError(
              "Location access is required to register. Please allow location access in your browser."
            );
            setLocation(null);
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!location) {
      toast.error(
        "Location access is required to register. Please allow location access in your browser."
      );
      setLocationError(
        "Location access is required to register. Please allow location access in your browser."
      );
      // Try to get location again
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
            setLocationError("");
          },
          () => {
            setLocationError(
              "Location access is required to register. Please allow location access in your browser."
            );
            setLocation(null);
          }
        );
      }
      return;
    }
    try {
      // According to the controller, send location as { lat, lng }
      const payload = {
        ...data,
        location: {
          lat: location.lat,
          lng: location.lng,
        },
      };
      const response = await axios.post(`${backendURL}admin/register`, payload);
      if (response.data && response.data.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        toast.error(response.data?.message || "Registration failed.");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          error.message || "Registration failed due to server error."
        );
      }
      // Optionally log error for debugging
      // console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full min-h-screen pb-6 sm:pb-10">
      {/* Logo Row */}
      <div className="w-full flex flex-row items-start">
        <Link
          to="/"
          className="flex items-center mt-4 ml-4 z-20"
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
      </div>
      {/* Main Card */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-[600px] px-4 sm:px-8 gap-8 mt-2 sm:mt-[-30px] pb-8">
        {/* Welcome Text */}
        <div className="text-center mt-4 sm:mt-0 mb-2 sm:mb-0">
          <h1 className="text-[22px] sm:text-[30px] font-semibold leading-tight">Welcome!</h1>
          <p className="text-[#757C89] text-[15px] sm:text-base mt-1">
            Sign Up and let us handle your business
          </p>
        </div>
        {locationError && (
          <div className="text-red-500 text-center mb-2">{locationError}</div>
        )}
        <form
          className="flex flex-col gap-[20px] sm:gap-[28px] w-full"
          onSubmit={onSubmitHandler}
        >
          <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[32px]">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[15px] sm:text-[16px] font-semibold pl-[3px]">
                Full Name
              </p>
              <input
                value={data.name}
                onChange={onChangeHandler}
                name="name"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base"
                type="text"
                placeholder="Sanjay Kumar Singh"
                required
              />
            </div>
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
          </div>
          <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[32px]">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[15px] sm:text-[16px] font-semibold pl-[3px]">
                Phone
              </p>
              <input
                value={data.phone}
                onChange={onChangeHandler}
                name="phone"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base"
                type="text"
                placeholder="9876543210"
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[15px] sm:text-[16px] font-semibold pl-[3px]">
                Library Name
              </p>
              <input
                value={data.libraryName}
                onChange={onChangeHandler}
                name="libraryName"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base"
                type="text"
                placeholder="Pratap Library"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[15px] sm:text-[16px] font-semibold pl-[3px]">
              Address
            </p>
            <textarea
              value={data.address}
              onChange={onChangeHandler}
              name="address"
              className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base resize-none"
              type="text"
              placeholder="Patna, Bihar..."
              rows={2}
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
            className="bg-[#303A96] p-[10px] text-white text-[18px] sm:text-[20px] font-semibold rounded-[10px] w-full max-w-full cursor-pointer self-center transition-all"
            disabled={!location}
            title={!location ? "Location access required" : ""}
          >
            Sign up
          </button>
        </form>
        <p className="text-center text-[15px] sm:text-base mt-4">
          Already have an account?{" "}
          <span
            className="cursor-pointer text-[#83ABDB] underline"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
