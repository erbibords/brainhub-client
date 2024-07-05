import React, { useEffect } from "react";
import { Typography, Row, Col, Table, Form } from "antd";
import CustomInput from "../../components/Input/Input";

const { Title, Text } = Typography;

const columns = [
  { title: "Name", dataIndex: "name", key: "name", width: 300 },
  { title: "Reference", dataIndex: "reference", key: "reference", width: 100 },
  {
    title: "Payment Amount",
    dataIndex: "paymentAmount",
    key: "paymentAmount",
    width: 100,
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    width: 100,
  },
  {
    title: "Payment Date",
    dataIndex: "paymentDate",
    key: "paymentDate",
    width: 100,
  },
  {
    title: "Offering",
    dataIndex: "offering",
    key: "offering",
    width: 100,
  },
  {
    title: "Proccessed By",
    dataIndex: "proccessedBy",
    key: "proccessedBy",
    width: 200,
  },
];

const dataSource = [
  {
    key: "1",
    name: "Louie Doromal",
    paymentAmount: "3000",
    paymentMethod: "GCASH",
    paymentDate: "2024-06-20",
    offering: "SSS",
    proccessedBy: "Rey G",
  },
];

const PaymentPrintLIst = () => {
  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="mx-auto p-5 font-sans">
      <div className="text-center mb-5">
        <Title level={3} className="text-center text-2xl font-bold">
          PAYMENT LIST
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

export default PaymentPrintLIst;
