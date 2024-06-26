import React, { useEffect } from "react";
import { Form, Input, Typography, Row, Col, Table, Divider } from "antd";

const { Title, Text } = Typography;

const accountingColumns = [
  { title: "ACCOUNTING INFORMATION", dataIndex: "info", key: "info" },
  { title: "PROJECTED", dataIndex: "projected", key: "projected" },
  { title: "ACTUAL", dataIndex: "actual", key: "actual" },
  { title: "REMARKS", dataIndex: "remarks", key: "remarks" },
  { title: "DEADLINE OF PAYMENTS", dataIndex: "deadline", key: "deadline" },
];

const accountingData = [
  {
    key: "1",
    info: "NO. OF STUDENTS",
    projected: "",
    actual: "",
    remarks: "",
    deadline: "",
  },
  {
    key: "2",
    info: "COST OF REVIEW FEE",
    projected: "",
    actual: "",
    remarks: "",
    deadline: "",
  },
  {
    key: "3",
    info: "BUDGET PROPOSAL",
    projected: "",
    actual: "",
    remarks: "",
    deadline: "SUMMER",
  },
  {
    key: "4",
    info: "TOTAL NET INCOME",
    projected: "",
    actual: "",
    remarks: "",
    deadline: "1ST SEM",
  },
  {
    key: "5",
    info: "PROGRAM PROFIT",
    projected: "",
    actual: "",
    remarks: "",
    deadline: "2ND SEM",
  },
  {
    key: "6",
    info: "PROGRAM SHARE",
    projected: "",
    actual: "",
    remarks: "",
    deadline: "",
  },
  {
    key: "7",
    info: "ACT. PROGRAM PROFIT",
    projected: "",
    actual: "",
    remarks: "",
    deadline: "",
  },
];

const scheduleColumns = [
  { title: "PROGRAM", dataIndex: "program", key: "program" },
  { title: "HOURS/SESSION", dataIndex: "hours", key: "hours" },
  { title: "DAYS/SESSION", dataIndex: "days", key: "days" },
  {
    title: "TOTAL # OF SESSIONS",
    dataIndex: "totalSessions",
    key: "totalSessions",
  },
  {
    title: "OVER-ALL TOTAL NO. OF REVIEW DAYS",
    dataIndex: "totalDays",
    key: "totalDays",
  },
  { title: "PROJECTED", dataIndex: "projected", key: "projected" },
  { title: "ACTUAL", dataIndex: "actual", key: "actual" },
];

const scheduleData = [
  {
    key: "1",
    program: "SUMMER",
    hours: "",
    days: "",
    totalSessions: "",
    totalDays: "",
    projected: "",
    actual: "",
  },
  {
    key: "2",
    program: "1ST SEMESTER",
    hours: "",
    days: "",
    totalSessions: "",
    totalDays: "",
    projected: "",
    actual: "",
  },
  {
    key: "3",
    program: "2ND SEMESTER",
    hours: "",
    days: "",
    totalSessions: "",
    totalDays: "",
    projected: "",
    actual: "",
  },
];

const PrintProjectionForm = () => {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="bg-white p-5 max-w-3xl mx-auto">
      <div className="text-center mb-5">
        <Title level={4}>
          PROJECTION PLANNING FOR REVIEW PROGRAM ACCOUNTING (ENHANCEMENT)
        </Title>
        <div className="text-left mb-5">
          <Text>REMINDERS:</Text>
          <ol className="list-decimal ml-5">
            <li>
              Prepare this report before the start of the review program or
              preferably a month before the actual start of the review. This
              should be done by the Accounting Head and Program Director.
            </li>
            <li>
              Essential information must be ready such as: Review schedule,
              Budget Proposal, Professional Fees of Lecturers, List of
              Enrollees.
            </li>
          </ol>
        </div>
        <Form layout="vertical" className="space-y-4">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="COURSE:" className="mb-4 inline-block w-auto">
                <Input
                  className="border-t-0 border-x-0 border-b-2 bg-transparent"
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="SEMESTER:" className="mb-4 inline-block w-auto">
                <Input
                  className="border-t-0 border-x-0 border-b-2 bg-transparent"
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="PROGRAM:" className="mb-4 inline-block w-auto">
                <Input
                  className="border-t-0 border-x-0 border-b-2 bg-transparent"
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="REVIEW STARTS:"
                className="mb-4 inline-block w-auto"
              >
                <Input
                  className="border-t-0 border-x-0 border-b-2 bg-transparent"
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="BRANCH:" className="mb-4 inline-block w-auto">
                <Input
                  className="border-t-0 border-x-0 border-b-2 bg-transparent"
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="REVIEW DURATION:"
                className="mb-4 inline-block w-auto"
              >
                <Input
                  className="border-t-0 border-x-0 border-b-2 bg-transparent"
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <Divider />
      <div className="mt-5 mb-5">
        <Table
          dataSource={accountingData}
          columns={accountingColumns}
          pagination={false}
          bordered
        />
      </div>
      <br />
      <br />
      <div className="text-center mt-5 mb-5">
        <Text className="font-bold">------- PROJECTED SCHEDULES -------</Text>
      </div>
      <div className="mt-5 mb-5">
        <Table
          dataSource={scheduleData}
          columns={scheduleColumns}
          pagination={false}
          bordered
        />
      </div>
    </div>
  );
};

export default PrintProjectionForm;