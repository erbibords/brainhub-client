import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { useNavigate } from "react-router-dom";
import { Typography, Table } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CustomButton from "../../components/Button/Button";

const { Title } = Typography;

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

class PaymentPrintList extends React.Component {
  render() {
    return (
      <div>
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
      </div>
    );
  }
}

const PrintComponent = () => {
  const componentRef = useRef();
  const navigate = useNavigate();

  return (
    <div>
      <CustomButton
        type="text"
        onClick={() => navigate("/payments/list")}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />
      <PaymentPrintList ref={componentRef} />
      <div className="text-right mb-5 w-fullflex justify-center">
        <ReactToPrint
          trigger={() => (
            <CustomButton type="primary" size="large">
              Print
            </CustomButton>
          )}
          content={() => componentRef.current}
        />
      </div>
    </div>
  );
};

export default PrintComponent;
