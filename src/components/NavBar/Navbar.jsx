import React from 'react';
import { Menu, Dropdown, Avatar, Button, message } from 'antd';
import { UserOutlined, LogoutOutlined, StopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { useBranch } from '../../contexts/branch';
import logo from '../../assets/images/bhub-logo.png';

const Navbar = ({ currentRoute }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const {
    isEmulating,
    clearEmulatedBranchId,
    emulatedBranch,
    branchId,
  } = useBranch();

  const isSuperAdmin = Boolean(user?.isSuperAdmin);

  const handleLogout = () => {
    logout();
  };

  const handleAddNewEnrollment = () => {
    navigate('/add-enrollment');
  };

  const handleStopEmulation = () => {
    clearEmulatedBranchId();
    message.success('Emulation ended. Redirecting to branch list.');
    navigate('/admin/branches');
  };

  const dropdownMenu = (
    <Menu>
      {isSuperAdmin && isEmulating && (
        <Menu.Item
          key="stop_emulation"
          icon={<StopOutlined />}
          onClick={handleStopEmulation}
        >
          Exit Emulation
        </Menu.Item>
      )}
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const showEnrollmentButton =
    isAuthenticated && (!isSuperAdmin || isEmulating);

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
            {isSuperAdmin && isEmulating && (
              <span className="text-white text-sm mr-3">
                Emulating: {emulatedBranch?.name ?? emulatedBranch?.id ?? branchId}
              </span>
            )}
            {showEnrollmentButton && (
              <Button
                type="primary"
                className="w-auto mr-3 bg-primary text-white"
                onClick={handleAddNewEnrollment}
              >
                Add New Enrollment
              </Button>
            )}
            {isSuperAdmin && isEmulating && (
              <Button
                type="default"
                className="w-auto mr-3"
                icon={<StopOutlined />}
                onClick={handleStopEmulation}
              >
                Exit Emulation
              </Button>
            )}
            {currentRoute !== '/login' && (
              <Dropdown overlay={dropdownMenu} placement="bottomRight">
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
