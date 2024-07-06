import React, { useEffect, useRef } from "react";
import { Typography, Row, Col, Table, Form } from "antd";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { useReactToPrint } from "react-to-print";

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
  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  return (
    <div className="mx-auto p-5 font-sans">
      <div ref={contentToPrint} className="p-5">
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
      <div className="mb-5 mt-5 w-full flex gap-2 justify-end">
        <CustomButton
          type="primary"
          size="large"
          onClick={() => {
            handlePrint(null, () => contentToPrint.current);
          }}
        >
          Print
        </CustomButton>
      </div>
    </div>
  );
};

export default RevieweesPopulation;
