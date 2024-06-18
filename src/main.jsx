import React from "react";
import "antd/dist/reset.css";
import ReactDOM from "react-dom/client";
import { SWRConfig } from "swr";
import App from "./App.jsx";
import fetcher from "./utils/fetcher.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SWRConfig value={{ fetcher }}>
      <App />
    </SWRConfig>
  </React.StrictMode>
);
