import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  UserOutlined,
  LaptopOutlined,
  DollarCircleOutlined,
  BookOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const { Sider } = Layout;

const Sidebar = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
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
     
    } else if (pathname.startsWith("/payments")) {
      selectedKey = ["payments"];
      openKeys = ["payments"];
    }else if (pathname.startsWith("/addPayment")) {
      selectedKey = ["addPayment"];
      openKeys = ["addPayment"];
    }

    return { selectedKey, openKeys };
  };

  const { selectedKey, openKeys } = getMenuKeys();

  return (
    <Sider
      width={200}
      className="site-layout-background"
      collapsed={isMobile}
      collapsible
      breakpoint="lg"
      trigger={null}
    >
      <Menu
        mode="inline"
        selectedKeys={selectedKey} // Set the selectedKeys dynamically
        defaultOpenKeys={openKeys} // Set the defaultOpenKeys dynamically
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="student_list" icon={<UserOutlined />}>
          <Link to="/students">Students</Link>
        </Menu.Item>
        <Menu.Item key="enrollment" icon={<LaptopOutlined />}>
          <Link to="/enrollments">Enrollments</Link>
        </Menu.Item>

        <Menu.Item key="courses" icon={<BookOutlined />}>
          <Link to="/courses">Course</Link>
        </Menu.Item>


        <Menu.Item key="payments" icon={<DollarCircleOutlined />}>
          <Link to="/payment/list">Payments</Link>
        </Menu.Item>
  
         
        <Menu.Item key="addPayment" icon={<PlusOutlined />}>
          <Link to="/payment/add">Add Payment</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
