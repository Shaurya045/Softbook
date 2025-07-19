import axios from "axios";
import { useParams } from "react-router-dom";
import { Context } from "./Context";
import { useEffect, useState } from "react";

const ContextProvider = (props) => {
  // const backendURL = "http://192.168.0.106:3000/api/v1/";
  const backendURL = "https://softbook-backend.onrender.com/api/v1/";

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "dark";
  });
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const { libraryId } = useParams();
  const [studentData, setStudentData] = useState({});
  const [studentLoaded, setStudentLoaded] = useState(false); // Track if studentData has been loaded
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [profileData, setProfileData] = useState({});

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

  // Request location on first load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          setLat(null);
          setLng(null);
        }
      );
    }
  }, []);

  const loadStudentData = async () => {
    setStudentLoaded(false);
    try {
      const response = await axios.get(`${backendURL}studentauth/getstudent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setStudentData(response.data.student || {});
        setProfileData(response.data.library || {});
      } else {
        setStudentData({});
        setProfileData({});
      }
    } catch (err) {
      setStudentData({});
      setProfileData({});
      console.error("Error fetching students:", err);
    } finally {
      setStudentLoaded(true);
    }
  };

  const loadAttendanceData = async () => {
    try {
      const response = await axios.get(`${backendURL}attendance/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setAttendanceData(response.data.attendance || []);
        // console.log(response.data.attendance);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  // Handle subscription inactive: only after profileData is loaded and valid
  useEffect(() => {
    if (
      profileData &&
      profileData.subscription &&
      profileData.subscription.active === false
    ) {
      setToken("");
      localStorage.removeItem("token");
    }
  }, [profileData?.subscription?.active]);

  // Only log out if studentData has been loaded and is empty or missing _id
  useEffect(() => {
    if (
      studentLoaded &&
      (!studentData ||
        typeof studentData !== "object" ||
        Object.keys(studentData).length === 0 ||
        !studentData._id)
    ) {
      setToken("");
      localStorage.removeItem("token");
    }
  }, [studentLoaded, studentData]);

  useEffect(() => {
    if (token) {
      loadStudentData();
      loadAttendanceData();
    } else {
      setStudentData({});
      setProfileData({});
      setStudentLoaded(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }
    setId(libraryId);
    setLoading(false);
  }, []);

  const contextValue = {
    backendURL,
    theme,
    toggleTheme,
    setToken,
    token,
    loading,
    id,
    studentData,
    lat,
    lng,
    setLat,
    setLng,
    attendanceData,
    profileData,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
