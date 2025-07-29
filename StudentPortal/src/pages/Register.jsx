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
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    phone: false,
    password: false,
  });
  const navigate = useNavigate();
  const { libraryId } = useParams();

  // Validation logic
  const validate = (fieldValues = data) => {
    let temp = { ...errors };

    // Phone validation: must be 10 digits, only numbers
    if ("phone" in fieldValues) {
      if (!fieldValues.phone) {
        temp.phone = "Phone is required";
      } else if (!/^\d{10}$/.test(fieldValues.phone)) {
        temp.phone = "Phone number must be exactly 10 digits";
      } else {
        temp.phone = "";
      }
    }

    // Password validation: at least 6 chars
    if ("password" in fieldValues) {
      if (!fieldValues.password) {
        temp.password = "Password is required";
      } else if (fieldValues.password.length < 6) {
        temp.password = "Password must be at least 6 characters";
      } else {
        temp.password = "";
      }
    }

    setErrors(temp);

    // Return true if no errors
    return Object.values(temp).every((x) => x === "");
  };

  const onChangeHandler = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    // Only allow digits for phone
    if (name === "phone") {
      value = value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
    }

    setData((prev) => ({ ...prev, [name]: value }));

    // Validate on change
    validate({ ...data, [name]: value });
  };

  const onBlurHandler = (e) => {
    const name = e.target.name;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate(data);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate before submit
    setTouched({ phone: true, password: true });
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

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
              onBlur={onBlurHandler}
              name="phone"
              className={`outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] ${
                touched.phone && errors.phone ? "border border-red-500" : ""
              }`}
              type="text"
              inputMode="numeric"
              pattern="\d{10}"
              placeholder="76672XXXXX"
              required
              maxLength={10}
              autoComplete="off"
            />
            {touched.phone && errors.phone && (
              <span className="text-red-500 text-xs mt-1">{errors.phone}</span>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <p className="text-[16px] font-semibold pl-[3px] ">Password</p>
            <input
              value={data.password}
              onChange={onChangeHandler}
              onBlur={onBlurHandler}
              name="password"
              className={`outline-none p-3 bg-[#1F2937] rounded-[10px] text-[#989FAB] ${
                touched.password && errors.password
                  ? "border border-red-500"
                  : ""
              }`}
              type="password"
              placeholder="password"
              required
              minLength={6}
              autoComplete="off"
            />
            {touched.password && errors.password && (
              <span className="text-red-500 text-xs mt-1">
                {errors.password}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#303A96] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full sm:w-[500px] cursor-pointer self-center "
          >
            Sign Up
          </button>
        </form>
        <p>
          Already registered?{" "}
          <span
            className="cursor-pointer text-[#83ABDB] "
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
