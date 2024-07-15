import React from "react";
import { Row, Table, Col } from "antd";
import { formatDate, formatAmount } from "../../utils/formatting";
import { getCourseOfferingName } from "../../utils/formatting";
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
      dataIndex: "reviewCost",
      key: "reviewCost",
      render: (_, data) => {
        return formatAmount(data?.courseOffering?.reviewCost);
      },
    },
    {
      title: "Enrollment Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) => formatDate(data),
    },
    { title: "Processed By", dataIndex: "processedBy", key: "processedBy" },
    {
      title: "Remaining Balance",
      dataIndex: "remainingBalance",
      key: "remainingBalance",
      render: (data) => formatAmount(data),
    },
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
