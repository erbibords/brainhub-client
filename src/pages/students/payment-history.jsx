import React, { useMemo } from "react";
import { Row, Table, Col, Image } from "antd";
import {
  formatAmount,
  formatDate,
  getCourseOfferingName,
} from "../../utils/formatting";
import { MEDIA_BASE_URL } from "../../constants";

export const PaymentHistory = ({ payments }) => {
  if (!payments) return null;

  const columns = [
    { title: "Reference", dataIndex: "referenceNo", key: "referenceNo" },
    {
      title: "Payment Amount",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (data) => formatAmount(data),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Payment Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) => formatDate(data),
    },
    {
      title: "Attachment",
      dataIndex: "attachment",
      render: (_, record) => {
        return record?.attachments?.length ? (
          <Image
            width={100}
            height={100}
            src={`${MEDIA_BASE_URL}/${record?.attachments[0]}`}
            alt={record?.attachments[0]}
            preview={{
              className: "custom-image-preview",
              mask: <div>Click to preview</div>,
              maskClassName: "custom-mask",
            }}
          />
        ) : (
          ""
        );
      },
    },
    {
      title: "Offering",
      dataIndex: "offering",
      render: (_, record) =>
        getCourseOfferingName(record?.enrollment?.courseOffering),
    },
    { title: "Processed by", dataIndex: "processedBy", key: "processedBy" },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Table
          dataSource={payments}
          columns={columns}
          title={() => <h2 className="text-2xl">Payments History</h2>}
        />
      </Col>
    </Row>
  );
};
