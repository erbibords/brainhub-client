import React from 'react';
import { Menu, Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { removeBranch, removeToken } from '../../utils/token';
import logo from '../../assets/images/bhub-logo.png';

const Navbar = ({ currentRoute }) => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const handleLogout = () => {
    removeToken();
    removeBranch();
    setIsAuthenticated(false);
    navigate('/login');
    // following up on a full reload to knock off localStorage
    window.location.reload();
  };

  const handleAddNewEnrollment = () => {
    navigate('/add-enrollment');
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
        <div className="flex items-center">
          <img
            src={logo}
            alt="Brain Hub Logo"
            className="h-12 w-12 rounded-full mr-2"
          />
          <div className="text-white text-2xl font-bold">Brain Hub</div>
        </div>
        {isAuthenticated && (
          <div className="flex items-center">
            <Button
              type="primary"
              className="w-auto mr-3 bg-primary text-white"
              onClick={handleAddNewEnrollment}
            >
              <Link to="/enrollments"> Add New Enrollment</Link>
            </Button>
            {currentRoute !== '/login' && (
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
