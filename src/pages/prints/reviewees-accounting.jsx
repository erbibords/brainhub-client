import React, { useEffect } from "react";
import { Form, Input, Typography, Row, Col, Table } from "antd";

const { Title, Text } = Typography;

const columns = [
  { title: "DATE", dataIndex: "date", key: "date" },
  { title: "AMOUNT", dataIndex: "amount", key: "amount" },
  { title: "RECEIPT NO.", dataIndex: "receiptNo", key: "receiptNo" },
  { title: "SIGNATURE", dataIndex: "signature", key: "signature" },
];

const dataSource = [
  {
    key: '1',
    date: '06/01/2024',
    amount: '3,333',
    receiptNo: '12345',
    signature: '',
  },
  // Add more data here
];

const RevieweesAccounting = () => {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="bg-white p-5 max-w-3xl mx-auto">
      <div className="text-center mb-5">
        <Title level={4} className="">REVIEWEE'S ACCOUNTING RECORD</Title>
        <Form layout="vertical" className="space-y-4 mt-6">
          <Row gutter={[16, 16]}>
            <Col span={12} className="text-left">
              <Form.Item label="Enrollment Date" className="mb-4 inline-block w-auto">
                <Input
                  className="border-t-0 border-x-0 border-b-2 bg-transparent"
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={12} className="text-right">
              <Form.Item label="Assisted by" className="mb-4 inline-block w-auto">
                <Input
                  className="border-t-0 border-x-0 border-b-2 bg-transparent"
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="text-left">
            <Col span={12}>
              <Form.Item label="Review Fee" className="mb-4 inline-block w-auto">
                <Input
                  className="border-t-0 border-x-0 border-b-2 bg-transparent"
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="mt-5">
        <Table dataSource={dataSource} columns={columns} pagination={false} bordered />
      </div>
    </div>
  );
};

export default RevieweesAccounting;
