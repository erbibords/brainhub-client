// src/components/SideBar/Sidebar.jsx
import React, { useMemo } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  LaptopOutlined,
  DollarCircleOutlined,
  BookOutlined,
  FlagOutlined,
  NotificationOutlined,
  WalletOutlined,
  PieChartOutlined,
  BarChartOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import { useMediaQuery } from 'react-responsive';
import { useAuth } from '../../contexts/auth';
import { useBranch } from '../../contexts/branch';

const { Sider } = Layout;

const Sidebar = () => {
  const isMobile = useMediaQuery({
    query: '(max-width: 768px) (background:white;)',
  });
  const location = useLocation();
  const { user } = useAuth();
  const { branchId, emulatedBranch, isEmulating } = useBranch();
  const isSuperAdmin = Boolean(user?.isSuperAdmin);

  const getMenuKeys = () => {
    const pathname = location.pathname;
    let selectedKey = [];
    let openKeys = [];

    if (pathname.startsWith('/admin/dashboard')) {
      selectedKey = ['admin_dashboard'];
    } else if (pathname.startsWith('/admin/expenses')) {
      selectedKey = ['admin_expenses'];
    } else if (pathname.startsWith('/admin/reporting')) {
      selectedKey = ['admin_reporting'];
    } else if (pathname.startsWith('/admin/branches')) {
      selectedKey = ['admin_branches'];
    } else if (pathname.startsWith('/enrollment')) {
      selectedKey = ['enrollment'];
    } else if (pathname.startsWith('/students')) {
      selectedKey = ['student_list'];
    } else if (pathname.startsWith('/courses')) {
      selectedKey = ['courses'];
    } else if (pathname.startsWith('/payments/add')) {
      selectedKey = ['addPayment'];
      openKeys = ['addPayment'];
    } else if (pathname.startsWith('/payments/list')) {
      selectedKey = ['payments_list'];
      openKeys = ['payments_list'];
    } else if (pathname.startsWith('/offerings')) {
      selectedKey = ['offerings'];
    } else if (pathname.startsWith('/view-enrollment')) {
      selectedKey = ['enrollment'];
    } else if (pathname.startsWith('/review-program')) {
      selectedKey = ['program'];
    } else if (pathname.startsWith('/schools')) {
      selectedKey = ['schools'];
    } else if (pathname.startsWith('/expenses')) {
      selectedKey = ['expenses'];
    }

    return { selectedKey, openKeys };
  };

  const { selectedKey, openKeys } = getMenuKeys();

  const menuItems = useMemo(() => {
    if (isSuperAdmin && !isEmulating) {
      return [
        {
          key: 'admin_dashboard',
          icon: <PieChartOutlined />,
          label: <Link to="/admin/dashboard">Dashboard</Link>,
        },
        {
          key: 'admin_expenses',
          icon: <WalletOutlined />,
          label: <Link to="/admin/expenses">Expenses</Link>,
        },
        {
          key: 'admin_reporting',
          icon: <BarChartOutlined />,
          label: <Link to="/admin/reporting">Reporting</Link>,
        },
        {
          key: 'admin_branches',
          icon: <ApartmentOutlined />,
          label: <Link to="/admin/branches">Branches</Link>,
        },
      ];
    }

    return [
      {
        key: 'student_list',
        icon: <UserOutlined />,
        label: <Link to="/students">Students</Link>,
      },
      {
        key: 'enrollment',
        icon: <LaptopOutlined />,
        label: <Link to="/enrollments">Enrollments</Link>,
      },
      {
        key: 'payments_list',
        icon: <DollarCircleOutlined />,
        label: <Link to="/payments/list">Payments</Link>,
      },
      {
        key: 'offerings',
        icon: <NotificationOutlined />,
        label: <Link to="/offerings">Offerings</Link>,
      },
      {
        key: 'program',
        icon: <FlagOutlined />,
        label: <Link to="/review-program">Review Program</Link>,
      },
      {
        key: 'schools',
        icon: <BookOutlined />,
        label: <Link to="/schools">Schools</Link>,
      },
      {
        key: 'courses',
        icon: <BookOutlined />,
        label: <Link to="/courses">Courses</Link>,
      },
      {
        key: 'expenses',
        icon: <WalletOutlined />,
        label: <Link to="/expenses">Expenses</Link>,
      },
    ];
  }, [isEmulating, isSuperAdmin]);

  const footerDetails = useMemo(() => {
    const effectiveBranchLabel = branchId ? branchId.slice(-7) : 'unknown';
    if (isSuperAdmin && isEmulating && emulatedBranch?.id) {
      return `Emulating: ${emulatedBranch.name ?? emulatedBranch.id}`;
    }
    if (isSuperAdmin) {
      return `Super Admin • Branch ${effectiveBranchLabel}`;
    }
    return `Branch ${effectiveBranchLabel}`;
  }, [branchId, emulatedBranch, isEmulating, isSuperAdmin]);

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
        {menuItems.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>

      <div className="absolute bottom-0 w-full p-4 bg-white">
        <div className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-2 rounded-md">
          <div>{footerDetails}</div>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
