// src/components/Layout/Layout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import Sidebar from "../SideBar/Sidebar";
import { Layout as Layout } from "antd";
import { AuthProvider } from "../../contexts/auth";
import { StudentProvider } from "../../contexts/students";
import { CoursesProvider } from "../../contexts/courses";
import { OfferingsProvider } from "../../contexts/offerings";
const { Header, Sider, Content } = Layout;

const MainLayout = ({ children, showSidebar = true }) => {
  const location = useLocation();

  return (
    <AuthProvider>
      <StudentProvider>
        <CoursesProvider>
          <OfferingsProvider>
            <Layout className="min-h-screen">
              <Header className="p-0 bg-white">
                <Navbar currentRoute={location.pathname} />
              </Header>
              <Layout>
                {showSidebar && (
                  <Sider width={200} className="site-layout-background">
                    <Sidebar />
                  </Sider>
                )}
                <Layout style={{ padding: "0 24px 24px" }} className="p-[24px]">
                  <Content className="my-[16px] mx-0">{children}</Content>
                </Layout>
              </Layout>
            </Layout>
          </OfferingsProvider>
        </CoursesProvider>
      </StudentProvider>
    </AuthProvider>
  );
};

export default MainLayout;
