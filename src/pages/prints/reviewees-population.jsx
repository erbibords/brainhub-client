import React, { useEffect } from "react";
import { Typography, Row, Col, Table, Form } from "antd";
import CustomInput from "../../components/Input/Input";

const { Title, Text } = Typography;

const columns = [
  {
    title: "Date Enrolled",
    dataIndex: "dateEnrolled",
    key: "dateEnrolled",
    width: 150,
  },
  { title: "Name", dataIndex: "name", key: "name", width: 300 },
  { title: "School", dataIndex: "school", key: "school", width: 200 },
  { title: "Status", dataIndex: "status", key: "status", width: 100 },
  { title: "Amount", dataIndex: "amount", key: "amount", width: 100 },
];

const dataSource = [
  {
    key: "1",
    dateEnrolled: "2024-06-30",
    name: "Louie Doromal",
    school: "University of Ano",
    status: "",
    amount: "3000",
  },
];

const RevieweesPopulation = () => {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="mx-auto p-5 font-sans">
      <div className="text-center mb-5">
        <Title level={3} className="text-center text-2xl font-bold">
          R E V I E W E E S&nbsp;&nbsp;&nbsp;P O P U L A T I O
          N&nbsp;&nbsp;&nbsp;R E P O R T
        </Title>
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

export default RevieweesPopulation;
