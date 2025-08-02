import React from "react";
import { Row, Table, Col } from "antd";
import { formatAmount } from "../../utils/formatting";
import { getCourseOfferingName } from "../../utils/mappings";
import "./soa.css";
export const SoaParticulars = ({ enrollments }) => {
  if (!enrollments) return null;

  console.log(enrollments);
  const columns = [
    {
      title: "PROGRAM",
      dataIndex: "offering",
      key: "offering",
      render: (_, data) => {
        return data?.courseOffering?.reviewProgram?.name;
      },
    },
    {
      title: "OFFERING",
      dataIndex: "offering",
      key: "offering",
      render: (_, data) => {
        return getCourseOfferingName(data?.courseOffering);
      },
    },
    {
      title: "REVIEW FEE",
      dataIndex: "reviewFee",
      key: "reviewFee",
      render: (data) => {
        return <span className="font-bold">{formatAmount(data)}</span>;
      },
    },

    {
      title: "DISCOUNT AMOUNT",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (data) => <p className="font-bold"> {formatAmount(data)}</p>,
    },
    {
      title: "REMARKS",
      dataIndex: "remarks",
      key: "remarks",
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Table
          className="very-small-table"
          dataSource={enrollments}
          columns={columns}
          pagination={false}
          size="small"
          title={() => <h3 className="text-xs">Particulars</h3>}
          locale={{ emptyText: "" }}
        />
      </Col>
    </Row>
  );
};
