import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  LaptopOutlined,
  DollarCircleOutlined,
  BookOutlined,
  PlusOutlined ,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const { Sider } = Layout;

const Sidebar = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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
        defaultSelectedKeys={["4"]}
        defaultOpenKeys={["4"]}
        style={{ height: "100%", borderRight: 0 }}
      > 
        <Menu.Item key="4" icon={<LaptopOutlined  />}>Enrollment</Menu.Item>
        <Menu.SubMenu key="sub1" icon={<UserOutlined />} title="Student">
          <Menu.Item key="1">Student List</Menu.Item>
          <Menu.Item key="2">View Student</Menu.Item>
        </Menu.SubMenu>
        
        
        <Menu.SubMenu
          key="sub3"
          icon={<BookOutlined />}
          title="Course"
        >
          <Menu.Item key="5">
            <Link to="/courses">Course List</Link>
          </Menu.Item>
          <Menu.Item key="6">Update Course</Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu
          key="sub4"
          icon={<DollarCircleOutlined />}
          title="Payment"
        >
          <Menu.Item key="7">Payments List</Menu.Item>
          <Menu.Item key="8">View Payment Method</Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="9" icon={<PlusOutlined  />}>Add Payment</Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
