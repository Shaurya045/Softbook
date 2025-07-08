import React, { useEffect } from "react";
import { useContext } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Context } from "../context/Context";
import Sidebar from "../component/Sidebar";

function ProtectedLayout() {
  const { token, loading } = useContext(Context);
  const navigate = useNavigate();
  const { libraryId } = useParams();
  useEffect(() => {
    if (!loading && !token) {
      navigate(`/${libraryId}/login`);
    }
  }, [token, loading, libraryId]);

  if (loading) return null; // or a loading spinner

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="py-[30px] px-[30px] sm:px-[50px] w-full h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default ProtectedLayout;
