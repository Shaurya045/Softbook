import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ContextProvider from "./context/ContextProvider.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import PublicLayout from "./layout/PublicLayout.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import IndividualAdmin from "./pages/IndividualAdmin.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/:id" element={<IndividualAdmin />} />
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
