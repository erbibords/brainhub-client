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
      openKeys = ["student_list"];
    } else if (pathname.startsWith("/courses")) {
      selectedKey = ["courses"];
      openKeys = ["sub3"];
    } else if (pathname.startsWith("/payment")) {
      selectedKey = ["payments"];
      openKeys = ["sub4"];
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

        {/* <Menu.SubMenu key="sub1" icon={<UserOutlined />} title="Student">
          <Menu.Item key="students">
            <Link to="/students">Student List</Link>
          </Menu.Item>
          <Menu.Item key="viewStudent">
            <Link to="/students/profile/:studentId">View Student</Link>
          </Menu.Item>
        </Menu.SubMenu> */}

        <Menu.SubMenu key="sub3" icon={<BookOutlined />} title="Course">
          <Menu.Item key="courses">
            <Link to="/courses">Course List</Link>
          </Menu.Item>
          <Menu.Item key="updateCourse">
            <Link to="/courses/:courseId">Update Course</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="sub4"
          icon={<DollarCircleOutlined />}
          title="Payment"
        >
          <Menu.Item key="paymentsList">
            <Link to="/payment/list">Payments List</Link>
          </Menu.Item>
          <Menu.Item key="viewPayment">
            <Link to="/payment/:id">View Payment</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="addPayment" icon={<PlusOutlined />}>
          <Link to="/payment/add">Add Payment</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
