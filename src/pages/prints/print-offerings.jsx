import React, { useEffect } from "react";
import CustomButton from "../../components/Button/Button";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { useOfferingsContext } from "../../contexts/offerings";
import { DateTime } from "luxon";
import { formatSemester, formatAmount } from "../../utils/formatting";
import { useNavigate } from "react-router";

const PrintOfferings = () => {
  const { data: offerings, getOfferingsLoading } = useOfferingsContext();
  const navigate = useNavigate();

  const data = offerings?.data || [];

  // Totals
  const totalEnrollees = data.reduce(
    (acc, curr) => acc + (curr.enrollmentCapacity || 0),
    0
  );
  const totalReviewFee = data.reduce(
    (acc, curr) => acc + (curr.reviewFee || 0),
    0
  );
  const totalCollectibles = data.reduce(
    (acc, curr) => acc + (curr.budgetProposal || 0),
    0
  );

  const columns = [
    {
      title: "Course",
      dataIndex: "course",
      render: (_, record) => record?.course?.name,
    },
    {
      title: "Review Program",
      dataIndex: "reviewProgram",
      render: (data) => (
        <>
          {data?.name}
          <br />
          <small>{data?.description}</small>
        </>
      ),
    },
    {
      title: "Semester",
      dataIndex: "semester",
      render: formatSemester,
    },
    {
      title: "School Year",
      dataIndex: "yearOffered",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      render: (value) => DateTime.fromISO(value).toFormat("MMM dd, yyyy"),
    },
    {
      title: "Payment Deadline",
      dataIndex: "paymentDeadline",
      render: (value) => DateTime.fromISO(value).toFormat("MMM dd, yyyy"),
    },
    {
      title: "Enrollees",
      dataIndex: "enrollmentCapacity",
    },
    {
      title: "Review Fee",
      dataIndex: "reviewFee",
      render: formatAmount,
    },
    {
      title: "Total Collectibles",
      dataIndex: "budgetProposal",
      render: formatAmount,
    },
    {
      title: "Enrollee Type",
      dataIndex: "offeringType",
    },
    {
      title: "School",
      dataIndex: "school",
      render: (value) => value?.name ?? "",
    },
  ];

  return (
    <div className="p-4 print:bg-white">
      <CustomButton
        type="text"
        onClick={() => navigate("/offerings")}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />
      <h2 className="text-xl mb-4">Offerings List</h2>

      <Table
        size="small"
        dataSource={data}
        columns={columns}
        pagination={false}
        loading={getOfferingsLoading}
        bordered
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={6}>
              <strong>Totals</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6}>
              <strong>{totalEnrollees}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={7}>
              <strong>{formatAmount(totalReviewFee)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={8}>
              <strong>{formatAmount(totalCollectibles)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={9} colSpan={2}></Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <div className="mt-4 flex justify-end">
        <CustomButton
          type="primary"
          onClick={() => window.print()}
          className="bg-success text-white"
        >
          Print
        </CustomButton>
      </div>
    </div>
  );
};

export default PrintOfferings;
