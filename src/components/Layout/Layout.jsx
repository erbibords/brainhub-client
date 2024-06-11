// src/components/Layout/Layout.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import Sidebar from "../SideBar/Sidebar";
import { Layout as Layout2 } from "antd";

const { Header, Sider, Content } = Layout2;

const Layout = ({ children, showSidebar = true }) => {
  const location = useLocation();

  return (
    <Layout2 style={{ minHeight: "100vh" }}>
      <Header style={{ padding: 0, background: '#fff' }}>
        <Navbar currentRoute={location.pathname} />
      </Header>
      <Layout2>
        {showSidebar && (
          <Sider width={200} className="site-layout-background">
            <Sidebar />
          </Sider>
        )}
        <Layout2 style={{ padding: '0 24px 24px' }}>
          <Content style={{ margin: '16px 0' }}>
            {children}
          </Content>
        </Layout2>
      </Layout2>
    </Layout2>
  );
};

export default Layout;
