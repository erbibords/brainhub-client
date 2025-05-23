import React from "react";
import { Row, Table, Col } from "antd";
import { formatDate, formatAmount } from "../../utils/formatting";
import { getCourseOfferingName } from "../../utils/mappings";
import { toSafeNumber } from "../../utils/formatting";
export const StudentEnrollments = ({ enrollments }) => {
  if (!enrollments) return null;

  const columns = [
    {
      title: "Offering",
      dataIndex: "offering",
      key: "offering",
      render: (_, data) => {
        return getCourseOfferingName(data?.courseOffering);
      },
    },
    {
      title: "Review Fee",
      dataIndex: "reviewFee",
      key: "reviewFee",
      render: (data) => {
        return formatAmount(data);
      },
    },

    {
      title: "Discount Amount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (data) => <p className="font-bold"> {formatAmount(data)}</p>,
    },
    {
      title: "Total Amount Paid",
      dataIndex: "totalAmountPaid",
      key: "totalAmountPaid",
      render: (data) => <p className="font-bold"> {formatAmount(data)}</p>,
    },
    {
      title: "Remaining Balance",
      dataIndex: "remainingBalance",
      key: "remainingBalance",
      render: (_, row) => {
        const reviewFee = toSafeNumber(row?.reviewFee);
        const discountAmount = toSafeNumber(row?.discountAmount);
        const totalAmountPaid = toSafeNumber(row?.totalAmountPaid);
        const remainingBalance = reviewFee - discountAmount - totalAmountPaid;
        return (
          <p className="text-red-600 font-bold">
            {formatAmount(toSafeNumber(remainingBalance) ?? 0)}
          </p>
        );
      },
    },
    {
      title: "Enrollment Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) => formatDate(data),
    },

    {
      title: "Enrollee Type",
      dataIndex: "enrolleeType",
      key: "enrolleeType",
      // render: (data) => formatDate(data),
    },
    { title: "Processed By", dataIndex: "processedBy", key: "processedBy" },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Table
          dataSource={enrollments}
          columns={columns}
          title={() => <h2 className="text-2xl">Enrollments</h2>}
        />
      </Col>
    </Row>
  );
};
