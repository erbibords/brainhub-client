// src/components/Layout/Layout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../NavBar/Navbar";

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <Navbar currentRoute={location.pathname} />
      <div>{children}</div>
    </>
  );
};

export default Layout;
