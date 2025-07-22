import axios from "axios";
import { Context } from "./Context";
import { useEffect, useState } from "react";

const ContextProvider = (props) => {
  // const backendURL = "http://localhost:3000/api/v1/";
  const backendURL = "https://softbook-backend.onrender.com/api/v1/";

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "dark";
  });
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState([]);
  const [seatData, setSeatData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [shiftData, setShiftData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  // profileData is always an object, never null, to avoid runtime errors in consumers
  const [profileData, setProfileData] = useState({});
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "dark");
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const loadProfiletData = async () => {
    setProfileLoaded(false);
    try {
      const response = await axios.get(`${backendURL}admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (
        response.data.success &&
        response.data.admin &&
        response.data.admin._id
      ) {
        setProfileData(response.data.admin);
      } else {
        setProfileData({});
      }
    } catch (err) {
      setProfileData({});
      console.error("Error fetching students:", err);
    } finally {
      setProfileLoaded(true);
    }
  };

  const loadStudentData = async () => {
    try {
      const response = await axios.get(`${backendURL}students/allstudents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setStudentData(response.data.students || []);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const loadSeatData = async () => {
    try {
      const response = await axios.get(`${backendURL}seat/allseats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const seats = response.data.seats;
        let rooms = new Set();
        seats.forEach((item) => {
          rooms.add(item.room);
        });
        setRooms([...rooms].sort((a, b) => a.localeCompare(b)));
        setSeatData(seats || []);
      }
    } catch (err) {
      console.error("Error fetching seats:", err);
    }
  };

  const loadShiftData = async () => {
    try {
      const response = await axios.get(`${backendURL}seat/allshifts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const shifts = response.data.shifts;
        // console.log(shifts);
        setShiftData(shifts || []);
      }
    } catch (err) {
      console.error("Error fetching seats:", err);
    }
  };

  const loadAttendanceData = async () => {
    try {
      const response = await axios.get(`${backendURL}attendance/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setAttendanceData(response.data.attendance || []);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await axios.get(`${backendURL}payment/getpayments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response);
      if (response.data.success) {
        setPaymentData(response.data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const loadBookingData = async () => {
    try {
      const response = await axios.get(`${backendURL}booking/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const bookings = response.data.bookings;
        setBookingData(bookings || []);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  // Handle subscription inactive: only after profileData is loaded and valid
  useEffect(() => {
    if (
      profileLoaded &&
      profileData &&
      typeof profileData === "object" &&
      Object.keys(profileData).length > 0 &&
      profileData.subscription &&
      profileData.subscription.active === false
    ) {
      setToken("");
      localStorage.removeItem("token");
    }
  }, [profileLoaded, profileData?.subscription?.active]);

  useEffect(() => {
    if (token) {
      loadProfiletData();
      loadStudentData();
      loadSeatData();
      loadShiftData();
      loadAttendanceData();
      loadPayments();
      loadBookingData();
    } else {
      setProfileData({});
      setProfileLoaded(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    setLoading(false);
  }, []);

  // Only log out if profileData has been loaded and is empty or missing _id
  useEffect(() => {
    if (
      profileLoaded &&
      (!profileData ||
        typeof profileData !== "object" ||
        Object.keys(profileData).length === 0 ||
        !profileData._id)
    ) {
      setToken("");
      localStorage.removeItem("token");
    }
  }, [profileLoaded, profileData]);

  const contextValue = {
    backendURL,
    theme,
    toggleTheme,
    setToken,
    token,
    loading,
    profileData,
    studentData,
    seatData,
    rooms,
    shiftData,
    attendanceData,
    paymentData,
    bookingData,
    loadStudentData,
    loadSeatData,
    loadShiftData,
    loadBookingData,
    loadPayments,
    loadAttendanceData,
    profileLoaded,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
