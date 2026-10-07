import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/Theme.css";
import App from "./App.jsx";

try {
  document.documentElement.dataset.theme =
    localStorage.getItem("tema") === "dark" ? "dark" : "light";
} catch {
  document.documentElement.dataset.theme = "light";
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
