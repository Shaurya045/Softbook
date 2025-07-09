import React, { useEffect } from "react";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";

function ProtectedLayout() {
  const { token, loading } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !token) {
      navigate(`/login`);
    }
  }, [token, loading]);

  if (loading) return null; // or a loading spinner

  return (
    <div className="flex h-screen">
      <div className="py-[30px] px-[30px] sm:px-[50px] w-full h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default ProtectedLayout;
