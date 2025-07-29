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
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  // Email regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // Validation function
  const validate = (fieldValues = data) => {
    let errors = {};

    // Phone: only numbers, exactly 10 digits
    if (!/^\d{10}$/.test(fieldValues.phone)) {
      errors.phone = "Phone number must be exactly 10 digits.";
    }

    // Email: must be valid
    if (!emailRegex.test(fieldValues.email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Password: at least 6 characters
    if (!fieldValues.password || fieldValues.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    return errors;
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    // For phone, allow only digits and max 10 characters
    if (name === "phone") {
      value = value.replace(/\D/g, ""); // Remove non-digits
      if (value.length > 10) value = value.slice(0, 10);
    }

    setData((prev) => ({ ...prev, [name]: value }));

    // Only validate the field that changed, not all fields
    if (name === "phone" || name === "email" || name === "password") {
      const fieldError = validate({ ...data, [name]: value });
      setFormErrors((prev) => ({
        ...prev,
        [name]: fieldError[name] || "",
      }));
    }
  };

  const onBlurHandler = (e) => {
    const name = e.target.name;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur as well
    if (name === "phone" || name === "email" || name === "password") {
      const fieldError = validate(data);
      setFormErrors((prev) => ({
        ...prev,
        [name]: fieldError[name] || "",
      }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate all fields before submit
    const errors = validate(data);
    setFormErrors(errors);
    setTouched({
      name: true,
      email: true,
      phone: true,
      libraryName: true,
      password: true,
      address: true,
    });

    if (Object.keys(errors).length > 0) {
      // Show first error as toast
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

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
        <Link to="/" className="flex items-center mt-4 ml-4 z-20">
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
          <h1 className="text-[22px] sm:text-[30px] font-semibold leading-tight">
            Welcome!
          </h1>
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
          autoComplete="off"
        >
          <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[32px]">
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[15px] sm:text-[16px] font-semibold pl-[3px]">
                Full Name
              </p>
              <input
                value={data.name}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                name="name"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base"
                type="text"
                placeholder="Rohan Singh"
                required
                autoComplete="off"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[15px] sm:text-[16px] font-semibold pl-[3px]">
                Email
              </p>
              <input
                value={data.email}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                name="email"
                className={`outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base ${
                  touched.email && formErrors.email
                    ? "border border-red-500"
                    : ""
                }`}
                type="email"
                placeholder="softbook123@gmail.com"
                required
                autoComplete="off"
              />
              {touched.email && formErrors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {formErrors.email}
                </span>
              )}
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
                onBlur={onBlurHandler}
                name="phone"
                className={`outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base ${
                  touched.phone && formErrors.phone
                    ? "border border-red-500"
                    : ""
                }`}
                type="tel"
                inputMode="numeric"
                pattern="\d{10}"
                maxLength={10}
                placeholder="9876543210"
                required
                autoComplete="off"
              />
              {touched.phone && formErrors.phone && (
                <span className="text-red-500 text-xs mt-1">
                  {formErrors.phone}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[15px] sm:text-[16px] font-semibold pl-[3px]">
                Library Name
              </p>
              <input
                value={data.libraryName}
                onChange={onChangeHandler}
                onBlur={onBlurHandler}
                name="libraryName"
                className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base"
                type="text"
                placeholder="Your Library"
                required
                autoComplete="off"
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
              onBlur={onBlurHandler}
              name="address"
              className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base resize-none"
              type="text"
              placeholder="Patna, Bihar..."
              rows={2}
              required
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[15px] sm:text-[16px] font-semibold pl-[3px]">
              Password
            </p>
            <input
              value={data.password}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              name="password"
              className={`outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-[15px] sm:text-base ${
                touched.password && formErrors.password
                  ? "border border-red-500"
                  : ""
              }`}
              type="password"
              placeholder="password"
              required
              minLength={6}
              autoComplete="off"
            />
            {touched.password && formErrors.password && (
              <span className="text-red-500 text-xs mt-1">
                {formErrors.password}
              </span>
            )}
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
