import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import { AuthProvider } from "../../contexts/auth.jsx";
import { StudentProvider } from "../../contexts/students.jsx";
import { CoursesProvider } from "../../contexts/courses.jsx";
const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <AuthProvider>
      <CoursesProvider>
        <StudentProvider>
          <Navbar currentRoute={location.pathname} />
          <div>{children}</div>
        </StudentProvider>
      </CoursesProvider>
    </AuthProvider>
  );
};

export default Layout;
