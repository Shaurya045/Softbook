// import axios from "axios";
import axios from "axios";
import { Context } from "./Context";
import { useEffect, useState } from "react";

const ContextProvider = (props) => {
  const backendURL = "http://localhost:3000/api/v1/";

  const [theme, setTheme] = useState("dark");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState([]);
  const [seatData, setSeatData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const loadProfiletData = async () => {
    try {
      const response = await axios.get(`${backendURL}admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setProfileData(response.data.admin || {});
      }
    } catch (err) {
      console.error("Error fetching students:", err);
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
        let shifts = new Set();
        seats.forEach((item) => {
          rooms.add(item.room);
          shifts.add(item.shift);
        });
        setRooms([...rooms]);
        setShifts([...shifts]);
        setSeatData(seats || []);
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

  useEffect(() => {
    if (token) {
      loadProfiletData();
      loadStudentData();
      loadSeatData();
      loadAttendanceData();
    }
  }, [token]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    setLoading(false);
  }, []);

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
    shifts,
    attendanceData,
    loadStudentData,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
