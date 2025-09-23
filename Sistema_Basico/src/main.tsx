// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

// Forzar modo oscuro inmediatamente
document.documentElement.classList.add('dark');
document.documentElement.style.colorScheme = 'dark';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
