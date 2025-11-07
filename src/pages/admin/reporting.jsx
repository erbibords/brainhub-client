import React from 'react';
import { Typography, Alert } from 'antd';
import PaymentsList from '../payments/payments-list';
import { useBranch } from '../../contexts/branch';

const { Title, Paragraph } = Typography;

const AdminReporting = () => {
  const { isEmulating } = useBranch();

  return (
    <div className="space-y-6">
      <div>
        <Title level={2}>Reporting</Title>
        <Paragraph type="secondary">
          Access the familiar payments reporting view used by branch admins. To
          inspect another branch, stop emulation and pick a different branch
          from the branches list.
        </Paragraph>
      </div>

      {!isEmulating ? (
        <Alert
          type="info"
          showIcon
          message="Emulation required"
          description="Start emulating a branch to view its reporting dashboard."
        />
      ) : (
        <PaymentsList />
      )}
    </div>
  );
};

export default AdminReporting;
