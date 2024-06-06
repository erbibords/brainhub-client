// src/Navbar.js
import React from "react";
import { Menu, Dropdown, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const Navbar = () => {
  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-secondary px-4 py-2">
      <div className="flex justify-between items-center mx-auto">
        <div className="text-white text-2xl font-bold">Brain Hub</div>
        <Dropdown overlay={menu} placement="bottomRight">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            className="cursor-pointer"
          />
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
