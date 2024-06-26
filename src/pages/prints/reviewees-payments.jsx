import React, { useEffect } from "react";
import { Form, Input, DatePicker, Typography, Row, Col, Table } from "antd";

const { Title, Text } = Typography;

const columns = [
  { title: "DATE", dataIndex: "date", key: "date" },
  { title: "DAY", dataIndex: "day", key: "day" },
  { title: "NAME", dataIndex: "name", key: "name" },
  { title: "AMOUNT", dataIndex: "amount", key: "amount" },
  { title: "RECEIPT NO.", dataIndex: "receiptNo", key: "receiptNo" },
];

const dataSource = [
  {
    key: "1",
    date: "06/01/2024",
    day: "Monday",
    name: "John Doe",
    amount: "3,333",
    receiptNo: "12345",
  },
  // Add more data here
];

const RevieweesPayments = () => {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="bg-white p-6 max-w-xl mx-auto">
      <Title level={4} className="text-center">
        DAILY SUMMARY AND MONITORING OF REVIEWEES' PAYMENTS (PER PROGRAM)
      </Title>

      <Form layout="vertical" className="space-y-4">
        <Row>
          <Col span={24} className="text-right">
            <Form.Item label="MONTH:" className="mb-4 inline-block w-auto">
              <Input
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="COURSE:" className="mb-4">
              <Input
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="REV. DURATION:" className="mb-4">
              <Input
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="PROGRAM:" className="mb-4">
              <Input
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="DATE OF ACCT SETTLEMENT:" className="mb-4">
              <Input
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="PROJ. NO. OF STUDENTS:" className="mb-4">
              <Input
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="PROJ. PROGRAM BUDGET:" className="mb-4">
              <Input
                className="border-t-0 border-x-0 border-b-2 bg-transparent"
                readOnly
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div className="mt-6 mb-6 text-xs">
        <p>
          REMINDERS: This must be filled up every time a reviewee will pay their
          review fees. Please make sure that receipt numbers must appear in a
          sequential manner with the total amount to be declared DAILY.
        </p>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default RevieweesPayments;
