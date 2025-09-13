import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Context } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token, backendURL } = useContext(Context);
  const [data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { libraryId, studentId } = useParams();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    if (token) {
      navigate(`/${libraryId}/dashboard`);
    }
    if (!email || !studentId) {
      navigate(`/${libraryId}/forgot`);
    }
  }, [token, libraryId, navigate, email, studentId]);

  const validate = (fieldValues = data) => {
    let temp = { ...errors };

    // New password validation
    if ("newPassword" in fieldValues) {
      if (!fieldValues.newPassword) {
        temp.newPassword = "New password is required";
      } else if (fieldValues.newPassword.length < 6) {
        temp.newPassword = "Password must be at least 6 characters";
      } else {
        temp.newPassword = "";
      }
    }

    // Confirm password validation
    if ("confirmPassword" in fieldValues) {
      if (!fieldValues.confirmPassword) {
        temp.confirmPassword = "Please confirm your password";
      } else if (fieldValues.confirmPassword !== data.newPassword) {
        temp.confirmPassword = "Passwords do not match";
      } else {
        temp.confirmPassword = "";
      }
    }

    setErrors(temp);
    return Object.values(temp).every((x) => x === "");
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setData((prev) => ({ ...prev, [name]: value }));
    validate({ ...data, [name]: value });
  };

  const onBlurHandler = (e) => {
    const name = e.target.name;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submit
    setTouched({ newPassword: true, confirmPassword: true });
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        newPassword: data.newPassword,
        studentId,
      };
      const response = await axios.post(
        `${backendURL}studentauth/reset-password`,
        payload
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/${libraryId}/login`);
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

  return (
    <div className="flex flex-col items-center w-full h-screen px-6">
      <div className="flex flex-col justify-center max-[640px]:w-full h-full gap-8 mt-[-50px]">
        <div>
          <h1 className="text-[30px] font-semibold">Reset Password</h1>
          <p className="text-[#757C89]">Enter your new password for {email}</p>
        </div>
        <form
          className="flex flex-col gap-[30px] w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[16px] font-semibold pl-[3px]">New Password</p>
            <input
              value={data.newPassword}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              name="newPassword"
              className={`outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] ${
                touched.newPassword && errors.newPassword
                  ? "border border-red-500"
                  : ""
              }`}
              type="password"
              placeholder="Enter new password"
              required
              minLength={6}
              autoComplete="new-password"
            />
            {touched.newPassword && errors.newPassword && (
              <span className="text-red-500 text-xs mt-1">
                {errors.newPassword}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[16px] font-semibold pl-[3px]">
              Confirm Password
            </p>
            <input
              value={data.confirmPassword}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              name="confirmPassword"
              className={`outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] ${
                touched.confirmPassword && errors.confirmPassword
                  ? "border border-red-500"
                  : ""
              }`}
              type="password"
              placeholder="Confirm new password"
              required
              minLength={6}
              autoComplete="new-password"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#303A96] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full sm:w-[500px] cursor-pointer self-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
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

export default ResetPassword;
