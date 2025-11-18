import React, { useEffect, useMemo, useCallback } from 'react';
import { Table, Button, Space, Tag, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import useBranches from '../../hooks/useBranches';
import { useAuth } from '../../contexts/auth';
import { useBranch } from '../../contexts/branch';

const { Title, Paragraph } = Typography;

const BranchesAdminPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isBootstrapping } = useAuth();
  const { data, error, isLoading } = useBranches();
  const { setEmulatedBranchId, emulatedBranch, isEmulating } = useBranch();

  const isSuperAdmin = Boolean(user?.isSuperAdmin);

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }

    if (!isAuthenticated || !isSuperAdmin) {
      navigate(isAuthenticated ? '/students' : '/login', { replace: true });
    }
  }, [isAuthenticated, isSuperAdmin, isBootstrapping, navigate]);

  const tableData = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return data.data.filter((branch) => !branch.isCentral);
  }, [data]);

  const handleEmulateBranch = useCallback(
    (branch) => {
      setEmulatedBranchId({ id: branch.id, name: branch.name });
      message.success(`You are now emulating ${branch.name}`);
      navigate('/students');
    },
    [navigate, setEmulatedBranchId]
  );

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (value, record) => (
          <Space size="small">
            <span>{value}</span>
            {record?.isCentral && <Tag color="gold">Central</Tag>}
          </Space>
        ),
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: (value) => value ?? '—',
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value) => dayjs(value).format('MMM DD, YYYY'),
      },
      {
        title: 'Updated',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (value) => dayjs(value).format('MMM DD, YYYY'),
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => {
          const isActive = emulatedBranch?.id === record.id && isEmulating;
          return (
            <Space>
              {isActive ? (
                <Tag color="green">Currently emulating</Tag>
              ) : (
                <Button size="small" type="primary" onClick={() => handleEmulateBranch(record)}>
                  Emulate
                </Button>
              )}
            </Space>
          );
        },
      },
    ],
    [emulatedBranch, handleEmulateBranch, isEmulating]
  );

  return (
    <div className="space-y-6">
      <div>
        <Title level={2}>Branches</Title>
        <Paragraph type="secondary">
          Emulate a branch to access its day-to-day operations. While emulating,
          the UI behaves exactly as a local branch administrator.
        </Paragraph>
      </div>

      <Table
        rowKey="id"
        dataSource={tableData}
        columns={columns}
        loading={isLoading}
        locale={{ emptyText: error ? 'Unable to load branches' : undefined }}
      />
    </div>
  );
};

export default BranchesAdminPage;
