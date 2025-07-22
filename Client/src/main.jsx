import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import NewAdmission from "./pages/NewAdmission.jsx";
// import PDF from "./components/PDF.jsx";
import ContextProvider from "./context/ContextProvider.jsx";
import StudentRecord from "./pages/StudentRecord.jsx";
import Profile from "./pages/Profile.jsx";
import AddSeats from "./pages/AddSeats.jsx";
import Attendance from "./pages/Attendance.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import PublicLayout from "./layout/PublicLayout.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx";
import IndividualStudent from "./pages/IndividualStudent.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import AddShift from "./pages/AddShift.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-admission" element={<NewAdmission />} />
        <Route path="/students" element={<StudentRecord />} />
        <Route path="/students/:id" element={<IndividualStudent />} />
        <Route path="/addseats" element={<AddSeats />} />
        <Route path="/addshifts" element={<AddShift />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </ContextProvider>
);
