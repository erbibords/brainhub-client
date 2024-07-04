import React, { useMemo } from "react";
import { Row, Table, Col } from "antd";
import {
  formatAmount,
  formatDate,
  getCourseOfferingName,
} from "../../utils/formatting";
import useAttachmentData from "../../hooks/usePaymentAttachment";
import fetcher from "../../utils/fetcher";
import useSWR from "swr";
import { PAYMENTS_BASE_URL } from "../../constants";

export const PaymentHistory = ({ payments }) => {
  if (!payments) return null;

  //   const paymentWithAttachment = useMemo(() => {
  //     return payments.map((payment) => {
  //       const { data } = useAttachmentData(payment.attachments);

  //       console.log(data);

  //       return data;

  //       //   return {
  //       //     ...payment,
  //       //     attachment: attachmentData.join(", "), // Join multiple attachments with a comma if needed
  //       //   };
  //     });
  //   }, [payments]);

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
      dataIndex: "attachments",
      key: "attachments",
      render: (data) => {
        return data?.map((attachment) => {
          return attachment;
          const { data, error } = useSWR(
            attachment ? `${PAYMENTS_BASE_URL}/uploads/${attachment}` : null,
            fetcher
          );
          const isLoading = !data && !error;
          console.log(data);
        });
      },
    },
    { title: "Offering", dataIndex: "offering", key: "offering" },
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
