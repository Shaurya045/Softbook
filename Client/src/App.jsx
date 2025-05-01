import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      <Navbar />
      <hr />
      <div className="flex">
        <Sidebar />
        <div className="py-[50px] flex items-start justify-center w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
