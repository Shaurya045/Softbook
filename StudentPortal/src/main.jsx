import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ContextProvider from "./context/ContextProvider.jsx";
import Attendance from "./pages/Attendance.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PublicLayout from "./layout/PublicLayout.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route element={<PublicLayout />}>
        <Route path="/:libraryId/register" element={<Register />} />
        <Route path="/:libraryId/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/:libraryId/dashboard" element={<Dashboard />} />
        <Route path="/:libraryId/attendance" element={<Attendance />} />
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
