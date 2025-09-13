import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/Context";
import { toast } from "react-toastify";
// import { images } from "../assets/assets";

function Login() {
  const { backendURL, token, setToken } = useContext(Context);
  const [data, setData] = useState({
    phone: "",
    password: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const navigate = useNavigate();
  const { libraryId } = useParams();

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

    if (name === "phone") {
      // Only allow digits and max 10
      value = value.replace(/\D/g, "");
      if (value.length > 10) value = value.slice(0, 10);
      setPhoneError(validatePhone(value));
    }

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onPhoneBlur = () => {
    setPhoneTouched(true);
    setPhoneError(validatePhone(data.phone));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate phone before submit
    const phoneValidation = validatePhone(data.phone);
    setPhoneError(phoneValidation);
    setPhoneTouched(true);
    if (phoneValidation) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      let payload = { ...data, libraryId: libraryId };
      const response = await axios.post(
        `${backendURL}studentauth/login`,
        payload
      );
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
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
      <div className=" flex flex-col justify-center max-[640px]:w-full h-full gap-8 mt-[-50px]  ">
        <div>
          <h1 className="text-[30px] font-semibold ">Welcome!</h1>
          <p className="text-[#757C89] ">Sign In and mark your attendance</p>
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
            className="bg-[#303A96] p-[10px] text-white text-[20px] font-semibold rounded-[10px] w-full sm:w-[500px] cursor-pointer self-center "
          >
            Sign In
          </button>
        </form>
        <div className=" flex items-center justify-between">
          <p>
            Register Yourself:-{" "}
            <span
              className="cursor-pointer text-[#83ABDB] "
              onClick={() => navigate(`/${libraryId}/register`)}
            >
              Sign Up
            </span>
          </p>
          <p
            onClick={() => navigate(`/${libraryId}/forgot`)}
            className="cursor-pointer text-[#83ABDB] "
          >
            Forgot Password?
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
