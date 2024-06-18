import React from "react";
import { Menu, Dropdown, Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/auth";
import { removeToken } from "../../utils/token";

const Navbar = ({ currentRoute }) => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleAddNewEnrollment = () => {
    navigate("/add-enrollment");
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="bg-secondary px-4 py-2">
      <div className="flex justify-between items-center mx-auto">
        <div className="text-white text-2xl font-bold">Brain Hub</div>
        {isAuthenticated && (
          <div className="flex items-center">
            <Button
              type="primary"
              className="w-auto mr-3 bg-primary text-white"
              onClick={handleAddNewEnrollment}
            >
              <Link to="/enrollments"> Add New Enrollment</Link>
            </Button>
            {currentRoute !== "/login" && (
              <Dropdown overlay={menu} placement="bottomRight">
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  className="cursor-pointer"
                />
              </Dropdown>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
