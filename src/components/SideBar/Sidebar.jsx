// src/components/SideBar/Sidebar.jsx
import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { UserOutlined, LaptopOutlined, DollarCircleOutlined, BookOutlined, PlusOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const { Sider } = Layout;

const Sidebar = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px) (background:white;)" });
  const location = useLocation();

  const getMenuKeys = () => {
    const pathname = location.pathname;
    let selectedKey = [];
    let openKeys = [];

    if (pathname.startsWith("/enrollment")) {
      selectedKey = ["enrollment"];
    } else if (pathname.startsWith("/students")) {
      selectedKey = ["student_list"];
    } else if (pathname.startsWith("/courses")) {
      selectedKey = ["courses"];
    } else if (pathname.startsWith("/payments/add")) {
      selectedKey = ["addPayment"];
      openKeys = ["addPayment"];
    } else if (pathname.startsWith("/payments/list")) {
      selectedKey = ["payments_list"];
      openKeys = ["payments_list"];
    }

    return { selectedKey, openKeys };
  };

  const { selectedKey, openKeys } = getMenuKeys();

  return (
    <Sider
      width={200}
      collapsed={isMobile}
      collapsible
      breakpoint="lg"
      trigger={null}
      className="bg-white h-full"
    >
      <Menu
        mode="inline"
        selectedKeys={selectedKey}
        defaultOpenKeys={openKeys}
        className="h-full border-r-0"
      >
        <Menu.Item key="student_list" icon={<UserOutlined />}>
          <Link to="/students">Students</Link>
        </Menu.Item>
        <Menu.Item key="enrollment" icon={<LaptopOutlined />}>
          <Link to="/enrollments">Enrollments</Link>
        </Menu.Item>
        <Menu.Item key="courses" icon={<BookOutlined />}>
          <Link to="/courses">Courses</Link>
        </Menu.Item>
        <Menu.Item key="course_offering" icon={<BookOutlined />}>
          <Link to="/course_offering">Offerings</Link>
        </Menu.Item>
        <Menu.Item key="payments_list" icon={<DollarCircleOutlined />}>
          <Link to="/payments/list">Payments</Link>
        </Menu.Item>
        <Menu.Item key="addPayment" icon={<PlusOutlined />}>
          <Link to="/payments/add">Add Payment</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
