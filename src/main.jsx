// index.js
import React from "react";
import "antd/dist/reset.css";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import axios from "axios";
import "./index.css";
// import { AuthContext } from "./contexts/auth.jsx"; // Import using curly braces

if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "https://brainhub-service.onrender.com/";
} else {
  axios.defaults.baseURL = "https://brainhub-service.onrender.com/";
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <AuthContext.Provider> */}
    <App />
    {/* </AuthContext.Provider> */}
  </React.StrictMode>
);
