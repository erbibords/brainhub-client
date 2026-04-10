import React, { useRef, useMemo } from "react";
import ReactToPrint from "react-to-print";
import { useNavigate, useLocation } from "react-router-dom";
import { Typography, Table } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CustomButton from "../../components/Button/Button";
import { usePaymentsContext } from "../../contexts/payments";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import {
  getCourseOfferingName,
  formatDate,
  formatAmount,
} from "../../utils/formatting";
const { Title } = Typography;

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 300,
    render: (_, record) => {
      return record?.enrollment?.student?.fullName;
    },
  },
  {
    title: "Reference",
    dataIndex: "referenceNo",
    key: "referenceNo",
    width: 100,
    render: (data) => {
      if (data === "undefined" || undefined || null) return "";
      return data;
    },
  },
  {
    title: "Payment Amount",
    dataIndex: "amountPaid",
    key: "amountPaid",
    width: 100,
    render: (data) => formatAmount(data) ?? "",
  },
  {
    title: "Payment Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
    width: 100,
  },
  {
    title: "Payment Date",
    dataIndex: "paidAt",
    key: "paidAt",
    width: 100,
    render: (data) => formatDate(data) ?? "",
  },
  {
    title: "Offering",
    dataIndex: "offering",
    key: "offering",
    width: 100,
    render: (_, record) =>
      getCourseOfferingName(record?.enrollment?.courseOffering) ?? "",
  },
];

const PrintComponent = () => {
  const componentRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    payments: data,
    getPaymentsLoading: isLoading,
    getPaymentsError: error,
  } = usePaymentsContext();

  const printRows = useMemo(() => {
    if (Array.isArray(location?.state?.paymentsData)) {
      return location.state.paymentsData;
    }
    return data?.data || [];
  }, [data, location?.state?.paymentsData]);

  const totalAmount = useMemo(() => {
    return printRows.reduce((acc, item) => acc + item.amountPaid, 0) || 0;
  }, [printRows]);

  return (
    <div>
      <CustomButton
        type="text"
        onClick={() => navigate("/payments/list")}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />

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
      <div ref={componentRef}>
        <div className="mx-auto p-5 font-sans">
          <div className="text-center mb-5">
            <Title level={3} className="text-center text-2xl font-bold">
              PAYMENT LIST
            </Title>
          </div>

          {error ? (
            <GenericErrorDisplay />
          ) : (
            <div>
              <div className="flex justify-end p-2 mt-4">
                <h3 className="font-bold text-lg">
                  {" "}
                  Total amount: {formatAmount(totalAmount)}
                </h3>
              </div>
              <Table
                loading={isLoading}
                dataSource={printRows}
                columns={columns}
                pagination={false}
                bordered
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrintComponent;
