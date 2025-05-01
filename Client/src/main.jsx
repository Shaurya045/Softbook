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
import PDF from "./components/PDF.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* <Route path="" element={<PDF />} /> */}
      <Route path="" element={<Dashboard />} />
      <Route path="/new-admission" element={<NewAdmission />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
