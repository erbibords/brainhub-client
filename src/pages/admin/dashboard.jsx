import React from 'react';
import { Card, Row, Col, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <Title level={2}>Super Admin Dashboard</Title>
        <Paragraph type="secondary">
          Welcome back! Select a branch to emulate or review high-level metrics
          for the organisation. Additional analytics will appear here soon.
        </Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Active Branches" bordered={false}>
            <Title level={3}>--</Title>
            <Paragraph type="secondary">
              Total number of branches currently operating.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Total Students" bordered={false}>
            <Title level={3}>--</Title>
            <Paragraph type="secondary">
              Aggregate student count across all branches.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Monthly Revenue" bordered={false}>
            <Title level={3}>--</Title>
            <Paragraph type="secondary">
              Consolidated figures will be available in future updates.
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
