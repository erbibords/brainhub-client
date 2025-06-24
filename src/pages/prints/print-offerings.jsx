import React from "react";
import { Table } from "antd";
import { useOfferingsContext } from "../../contexts/offerings";
import { DateTime } from "luxon";
import { formatSemester, formatAmount } from "../../utils/formatting";

const PrintOfferings = () => {
  const { data: offerings, getOfferingsLoading } = useOfferingsContext();

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
      <h2 className="text-xl mb-4">Offerings List</h2>
      <Table
        size="small"
        dataSource={offerings?.data}
        columns={columns}
        pagination={false}
        loading={getOfferingsLoading}
        bordered
      />
    </div>
  );
};

export default PrintOfferings;
