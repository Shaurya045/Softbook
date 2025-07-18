import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./context/Context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { theme } = useContext(Context);
  const textColor = theme === "light" ? "text-black" : "text-white";
  const bgColor = theme === "light" ? "bg-[#E2E2E2]" : "bg-gradient-to-bl from-[#484381] via-[#0F0E1B] to-[#0F0E1B] ";
  return (
    <div className={`${textColor} ${bgColor} min-h-screen w-full `}>
      <ToastContainer />
      <Outlet />
    </div>
  );
}

export default App;
