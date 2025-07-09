import axios from "axios";
import { Context } from "./Context";
import { useEffect, useState } from "react";

const ContextProvider = (props) => {
  const backendURL = "http://192.168.0.100:3000/api/v1/";

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
        console.log(response.data.admins[0].subscription.active);
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
