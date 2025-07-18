import { Outlet, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";

function ProtectedLayout() {
  const { token, loading } = useContext(Context);
  const [isMobileView, setIsMobileView] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const checkMobile = () => {
    const width = window.innerWidth;
    if (width < 1120) {
      setIsMobileView(true);
    } else {
      setIsMobileView(false);
    }
  };

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !token) {
      navigate("/login");
    }
  }, [token, loading]);

  if (loading) return null; // or a loading spinner

  return (
    <div
      className={`${!isMobileView ? "flex-row" : "flex-col"} flex min-h-screen`}
    >
      <Sidebar
        isMobileView={isMobileView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div
        className={`${
          isMobileView ? "py-[20px] h-auto" : "py-[30px] h-screen"
        } px-[25px] sm:px-[50px] w-full overflow-y-auto`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default ProtectedLayout;
