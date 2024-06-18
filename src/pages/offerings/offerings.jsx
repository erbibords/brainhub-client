import React, { useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { Table, Space, Row, Col, Button, Select } from "antd";
import { useNavigate } from "react-router";
import { useOfferingsContext } from "../../contexts/offerings";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
const Option = { Select };

const Offerings = () => {
  const navigate = useNavigate();
  const { data, getOfferingsLoading, getOfferingsError } =
    useOfferingsContext();

  const columns = [
    { title: "Course", dataIndex: "course", key: "course" },
    {
      title: "Review Program",
      dataIndex: "program",
      key: "program",
    },
    {
      title: "Enrollment Capacity",
      dataIndex: "enrollmentCapacity",
      key: "enrollmentCapacity",
    },
    { title: "Semester Offered", dataIndex: "semester", key: "semester" },
    { title: "Year offered", dataIndex: "yearOffered", key: "yearOffered" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    {
      title: "Payment Deadline",
      dataIndex: "paymentDeadline",
      key: "paymentDeadline",
    },
    { title: "Review Cost", dataIndex: "reviewCost", key: "reviewCost" },
    {
      title: "Budget Proposal",
      dataIndex: "budgetProposal",
      key: "budgetProposal",
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="small">
          <CustomButton type="edit">Edit</CustomButton>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Offerings</h1>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <CustomInput
            placeholder="Search by course.."
            onChange={(e) => searchByOfferings(e.target.value)}
            className="mb-4"
          />
        </Col>

        <Col span={4}>
          <Select
            placeholder="Year"
            onChange={(value) => setSelectedYear(value)}
            className="h-[40px] w-full mb-[10px]"
          >
            <Option value="2020">2020</Option>
            <Option value="2021">2021</Option>
            <Option value="2022">2022</Option>
            <Option value="2023">2023</Option>
            <Option value="2024">2024</Option>
          </Select>
        </Col>
        <Col span={4}>
          <Select
            placeholder="Semester"
            onChange={(value) => setSelectedSemester(value)}
            className="h-[40px] w-full mb-[10px]"
          >
            <Option value="1st">1st</Option>
            <Option value="2nd">2nd</Option>
            <Option value="Summer">Summer</Option>
          </Select>
        </Col>
        <Col span={3}>
          <CustomButton type="primary">Search</CustomButton>
        </Col>

        <Col span={8}>
          <Button
            className="w-auto bg-primary text-white float-right"
            size="large"
            onClick={() => {
              navigate(`/offerings/add`);
            }}
          >
            Add Offerings
          </Button>
        </Col>
        <Col span={24}>
          {getOfferingsError ? (
            <GenericErrorDisplay className="!items-start" />
          ) : (
            <Table
              size="small"
              dataSource={data}
              columns={columns}
              loading={getOfferingsLoading}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Offerings;
