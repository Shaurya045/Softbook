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
    <div className="flex flex-col items-center w-full h-screen">
      <Link to="/" className="flex items-center self-start mt-4 ml-4 z-20">
        <img className="w-[55px] sm:w-[75px]" src={images.logo} alt="logo" />
        <img
          className="w-[160px] sm:w-[233px] "
          src={images.letterLogo}
          alt="logo"
        />
      </Link>
      <div className=" flex flex-col justify-center h-full gap-8 mt-[-50px]  ">
        <div>
          <h1 className="text-[30px] font-semibold ">Welcome!</h1>
          <p className="text-[#757C89] ">
            Sing Up and let us handle your business
          </p>
        </div>
        {locationError && (
          <div className="text-red-500 text-center mb-2">{locationError}</div>
        )}
        <form
          className="flex flex-col gap-[30px] w-full "
          onSubmit={onSubmitHandler}
        >
          <div className="flex flex-col lg:flex-row gap-[40px]">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[16px] font-semibold pl-[3px] ">Full Name</p>
              <input
                value={data.name}
                onChange={onChangeHandler}
                name="name"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                type="text"
                placeholder="Sanjay Kumar Singh"
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[16px] font-semibold pl-[3px] ">Email</p>
              <input
                value={data.email}
                onChange={onChangeHandler}
                name="email"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                type="email"
                placeholder="sanjay123@gmail.com"
                required
              />
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-[40px]">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[16px] font-semibold pl-[3px] ">Phone</p>
              <input
                value={data.phone}
                onChange={onChangeHandler}
                name="phone"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                type="text"
                placeholder="9876543210"
                required
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[16px] font-semibold pl-[3px] ">
                Library Name
              </p>
              <input
                value={data.libraryName}
                onChange={onChangeHandler}
                name="libraryName"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]"
                type="text"
                placeholder="Pratap Library"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[16px] font-semibold pl-[3px] ">Address</p>
            <textarea
              value={data.address}
              onChange={onChangeHandler}
              name="address"
              className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] resize-none"
              type="text"
              placeholder="Patna, Bihar..."
              rows={2}
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
            className="bg-[#4BDE80] p-[10px] text-[#101826] text-[20px] font-semibold rounded-[10px] w-[500px] cursor-pointer self-center "
            disabled={!location}
            title={!location ? "Location access required" : ""}
          >
            Sign up
          </button>
        </form>
        <p>
          Already have a account?{" "}
          <span
            className="cursor-pointer text-[#4BDE80] "
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
