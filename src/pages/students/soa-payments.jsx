import { useMemo } from "react";
import { Row, Table, Col } from "antd";
import {
  formatAmount,
  formatDate,
  getCourseOfferingName,
} from "../../utils/formatting";
import "./soa.css";

export const SoaPayments = ({ payments }) => {
  if (!payments) return null;

  const sortByPaidAt = useMemo(() => {
    if (!payments || payments?.length <= 0) return [];
    return payments?.sort((a, b) => new Date(b?.paidAt) - new Date(a?.paidAt));
  }, [payments]);

  const columns = [
    {
      title: "PARTICULAR",
      dataIndex: "enrollment",
      key: "particular",
      render: (data) => data?.courseOffering?.reviewProgram?.name,
    },
    {
      title: "S.Y",
      dataIndex: "enrollment",
      key: "yearOffered",
      render: (data) => data?.courseOffering?.yearOffered,
    },
    {
      title: "AMOUNT",
      dataIndex: "amountPaid",
      key: "amountPaid",
      render: (data) => <span className="font-bold">{formatAmount(data)}</span>,
    },

    {
      title: "DATE OF PAYMENT",
      dataIndex: "paidAt",
      key: "paidAt",
      render: (data) => formatDate(data),
    },

    {
      title: "REFERENCE",
      dataIndex: "referenceNo",
      key: "referenceNo",
      render: (data) => (data ? data : ""),
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Table
          className="very-small-table"
          size="small"
          dataSource={payments && sortByPaidAt}
          columns={columns}
          locale={{ emptyText: "" }}
          pagination={false}
          title={() => <h3 className="text-xs">Breakdown of Payments</h3>}
        />
      </Col>
    </Row>
  );
};
