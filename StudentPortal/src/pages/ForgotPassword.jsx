import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const { token, backendURL } = useContext(Context);
  const [data, setData] = useState({
    email: "",
    phone: "",
  });
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneEntry, setIsPhoneEntry] = useState(false);
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const { libraryId } = useParams();

  const validateEmail = (email) => {
    if (!email) {
      return "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };
  const validatePhone = (phone) => {
    if (!phone) {
      return "Phone is required";
    } else if (!/^\d{10}$/.test(phone)) {
      return "Phone number must be exactly 10 digits";
    }
    return "";
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    if (name === "email") {
      // Convert email to lowercase
      value = value.toLowerCase();
      setEmailError(validateEmail(value));
    }
    if (name === "phone") {
      // Only allow digits and max 10
      value = value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
      setPhoneError(validatePhone(value));
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(data.email));
  };
  const onPhoneBlur = () => {
    setPhoneTouched(true);
    setPhoneError(validatePhone(data.phone));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate email before submit
    const emailValidation = validateEmail(data.email);
    setEmailError(emailValidation);
    setEmailTouched(true);
    if (emailValidation) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = { email: data.email, libraryId, phone: data.phone };
      const response = await axios.post(
        `${backendURL}studentauth/forgot-password`,
        payload
      );

      if (response.data.success) {
        toast.success(response.data.message);
        // Navigate to OTP verification page
        navigate(`/${libraryId}/verify-otp/${response.data.studentId}`, {
          state: { email: data.email },
        });
      } else {
        toast.error(response.data.message);
        // console.log(response.data.isPhone);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      if (error.response.data.isPhone) {
        setIsPhoneEntry(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate(`/${libraryId}/dashboard`);
    }
  }, [token, libraryId, navigate]);

  return (
    <div className="flex flex-col items-center w-full h-screen px-6 ">
      <div className=" flex flex-col justify-center max-[640px]:w-full h-full gap-8 mt-[-50px]  ">
        <h1 className="text-[30px] font-semibold ">Forgot Password</h1>
        <form
          className="flex flex-col gap-[30px] w-full "
          onSubmit={onSubmitHandler}
        >
          {isPhoneEntry && (
            <div className="flex flex-col gap-1 w-full">
              <p className="text-[16px] font-semibold pl-[3px] ">Phone</p>
              <input
                value={data.phone}
                onChange={onChangeHandler}
                onBlur={onPhoneBlur}
                name="phone"
                className={`outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]${
                  phoneTouched && phoneError ? " border border-red-500" : ""
                }`}
                type="tel"
                inputMode="numeric"
                pattern="\d{10}"
                maxLength={10}
                placeholder="76672XXXXX"
                required
                autoComplete="off"
              />
              {phoneTouched && phoneError && (
                <span className="text-red-500 text-xs mt-1">{phoneError}</span>
              )}
            </div>
          )}
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[16px] font-semibold pl-[3px] ">
              Enter Email Address
            </p>
            <input
              value={data.email}
              onChange={onChangeHandler}
              onBlur={onEmailBlur}
              name="email"
              className={`outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB]${
                emailTouched && emailError ? " border border-red-500" : ""
              }`}
              type="email"
              placeholder="student@example.com"
              required
              autoComplete="off"
            />
            {emailTouched && emailError && (
              <span className="text-red-500 text-xs mt-1">{emailError}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#303A96] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full sm:w-[500px] cursor-pointer self-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
      {/* recaptcha */}
      <div ref={recaptchaRef}></div>
    </div>
  );
};

export default ForgotPassword;
