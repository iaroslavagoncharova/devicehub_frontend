import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./output.css";
import "./index.css";
// import "./output.css";
// import "./style/layout.css";
// import "./style/login.css";
// import "./style/home.css";
// import "./style/devices.css";
// import "./style/data.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
