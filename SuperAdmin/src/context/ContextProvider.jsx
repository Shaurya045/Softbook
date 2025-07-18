import axios from "axios";
import { Context } from "./Context";
import { useEffect, useState } from "react";

const ContextProvider = (props) => {
  const backendURL = "http://localhost:3000/api/v1/";
  // const backendURL = "https://softbook-backend.onrender.com/api/v1/";

  const [theme, setTheme] = useState("dark");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminsData, setAdminsData] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const loadAdminsData = async () => {
    try {
      const response = await axios.get(`${backendURL}admin/alladmins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setAdminsData(response.data.admins || []);
        // console.log(response.data);
      }
    } catch (err) {
      console.error("Error fetching attendance:", err);
    }
  };

  useEffect(() => {
    if (token) {
      loadAdminsData();
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
    adminsData,
    loadAdminsData,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
