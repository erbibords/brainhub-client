import React from 'react';
import { Alert, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const AdminExpenses = () => {
  return (
    <div className="space-y-4">
      <Title level={2}>Expenses Overview</Title>
      <Paragraph type="secondary">
        A cross-branch breakdown of expenses will live here. For now, emulate a
        branch to access the detailed expenses module.
      </Paragraph>
      <Alert
        message="Coming soon"
        description="Aggregate expense analytics for all branches will surface here in a future release."
        type="info"
        showIcon
      />
    </div>
  );
};

export default AdminExpenses;
