import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Context } from "../context/Context";

function PublicLayout() {
  const { token, loading } = useContext(Context);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && token) {
      navigate("/dashboard");
    }
  }, [token, loading]);

  if (loading) return null; // or a loading spinner

  return (
    <div className="w-full min-h-screen ">
      <Outlet />
    </div>
  );
}

export default PublicLayout;
