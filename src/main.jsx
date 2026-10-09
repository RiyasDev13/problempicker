import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import AboutPage from "./components/AboutPage.jsx";
import "./styles.css";
createRoot(document.getElementById("root")).render(
  <BrowserRouter
    basename={import.meta.env.BASE_URL}
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <Routes>
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>,
);
