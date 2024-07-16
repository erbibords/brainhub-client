import React, { useMemo } from "react";
import CustomButton from "../../components/Button/Button";
import { Row, Table, Col, Image, Space } from "antd";
import {
  formatAmount,
  formatDate,
  getCourseOfferingName,
} from "../../utils/formatting";
import { useNavigate } from "react-router-dom";
import { MEDIA_BASE_URL } from "../../constants";

export const PaymentHistory = ({ payments }) => {
  const navigate = useNavigate();
  if (!payments) return null;

  const sortByPaidAt = useMemo(() => {
    return payments.sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt));
  }, [payments]);

  const columns = [
    {
      title: "Reference",
      dataIndex: "referenceNo",
      key: "referenceNo",
      render: (data) => (data ? data : ""),
    },
    {
      title: "Payment Amount",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (data) => formatAmount(data),
    },
    {
      title: "Balance after payment",
      dataIndex: "balance",
      key: "balance",
      render: (data) => formatAmount(data ?? 0),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Payment Date",
      dataIndex: "paidAt",
      key: "paidAt",
      render: (data) => formatDate(data),
    },
    {
      title: "Attachment",
      dataIndex: "attachment",
      render: (_, record) => {
        return record?.attachments?.length && record?.attachments[0] !== "" ? (
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <CustomButton
            onClick={() => navigate(`/prints/receipt/${record?.id}`)}
          >
            Print
          </CustomButton>
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Table
          dataSource={sortByPaidAt}
          columns={columns}
          title={() => <h2 className="text-2xl">Payments History</h2>}
        />
      </Col>
    </Row>
  );
};
