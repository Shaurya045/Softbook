import { Outlet, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useContext, useEffect } from "react";
import { Context } from "../context/Context";

function ProtectedLayout() {
  const { token, loading } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !token) {
      navigate("/login");
    }
  }, [token, loading]);

  if (loading) return null; // or a loading spinner

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="py-[30px] px-[50px] w-full h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default ProtectedLayout;
