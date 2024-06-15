// src/components/Layout/Layout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import Sidebar from "../SideBar/Sidebar";
import { Layout as Layout } from "antd";
import { AuthProvider } from "../../contexts/auth";
import { StudentProvider } from "../../contexts/students";
import { CoursesProvider } from "../../contexts/courses";
const { Header, Sider, Content } = Layout;

const MainLayout = ({ children, showSidebar = true }) => {
  const location = useLocation();

  return (
    <AuthProvider>
      <StudentProvider>
        <CoursesProvider>
          <Layout style={{ minHeight: "100vh" }}>
            <Header style={{ padding: 0, background: "#fff" }}>
              <Navbar currentRoute={location.pathname} />
            </Header>
            <Layout>
              {showSidebar && (
                <Sider width={200} className="site-layout-background">
                  <Sidebar />
                </Sider>
              )}
              <Layout style={{ padding: "0 24px 24px" }}>
                <Content style={{ margin: "16px 0" }}>{children}</Content>
              </Layout>
            </Layout>
          </Layout>
        </CoursesProvider>
      </StudentProvider>
    </AuthProvider>
  );
};

export default MainLayout;
