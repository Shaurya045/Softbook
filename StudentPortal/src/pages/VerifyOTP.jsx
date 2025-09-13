import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const VerifyOTP = () => {
  const { token, backendURL } = useContext(Context);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const { libraryId, studentId } = useParams();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (token) {
      navigate(`/${libraryId}/dashboard`);
    }
    if (!email || !studentId) {
      navigate(`/${libraryId}/forgot`);
    }
  }, [token, libraryId, navigate, email, studentId]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        otp,
        studentId,
      };
      const response = await axios.post(
        `${backendURL}studentauth/verify-otp`,
        payload
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/${libraryId}/reset-password/${studentId}`, {
          state: { email },
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const payload = { email, libraryId };
      const response = await axios.post(
        `${backendURL}studentauth/forgot-password`,
        payload
      );

      if (response.data.success) {
        toast.success("OTP resent successfully!");
        setCountdown(60); // 60 seconds countdown
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen px-6">
      <div className="flex flex-col justify-center max-[640px]:w-full h-full gap-8 mt-[-50px]">
        <div>
          <h1 className="text-[30px] font-semibold">Verify OTP</h1>
          <p className="text-[#757C89]">
            Enter the 6-digit OTP sent to {email}
          </p>
        </div>
        <form
          className="flex flex-col gap-[30px] w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[16px] font-semibold pl-[3px]">OTP</p>
            <input
              value={otp}
              onChange={handleOtpChange}
              className="outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] text-center text-2xl tracking-widest"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              placeholder="000000"
              required
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="bg-[#303A96] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full sm:w-[500px] cursor-pointer self-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[#757C89] text-sm">Didn't receive the OTP?</p>
          <button
            onClick={handleResendOTP}
            disabled={resendLoading || countdown > 0}
            className="text-[#83ABDB] text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${countdown}s`
              : "Resend OTP"}
          </button>
        </div>
        <button
          onClick={() => navigate(`/${libraryId}/forgot`)}
          className="text-[#83ABDB] text-sm cursor-pointer"
        >
          ← Back to Forgot Password
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
