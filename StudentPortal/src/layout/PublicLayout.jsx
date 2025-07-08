import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Context } from "../context/Context";

function PublicLayout() {
  const { token, loading } = useContext(Context);
  const navigate = useNavigate();
  const { libraryId } = useParams();
  useEffect(() => {
    if (!loading && token) {
      navigate(`/${libraryId}/dashboard`);
    }
  }, [token, loading, libraryId]);

  if (loading) return null;
  return (
    <div className="w-full h-screen ">
      <Outlet />
    </div>
  );
}

export default PublicLayout;
