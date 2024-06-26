import React, { useEffect } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { Table, Space, Row, Col, Button, Select } from "antd";
import { useNavigate } from "react-router";
import { useOfferingsContext } from "../../contexts/offerings";
import { useCourse } from "../../contexts/courses";

import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { DateTime } from "luxon";
import { formatSemester, formatAmount } from "../../utils/formatting";
import { REVIEW_PROGRAM, SEMESTER, YEAR } from "../../constants";
const { Option } = Select;

const Offerings = () => {
  const navigate = useNavigate();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();
  const {
    data: offerings,
    getOfferingsLoading,
    getOfferingsError,
    setParams,
  } = useOfferingsContext();

  console.log(offerings);

  useEffect(() => {
    setParams({
      pageNo: 1,
      pageSize: 25,
    });
  }, []);

  const columns = [
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (_, record) => <p>{record?.course?.name}</p>,
    },
    {
      title: "Review Program",
      dataIndex: "program",
      key: "program",
    },

    {
      title: "Semester Offered",
      dataIndex: "semester",
      key: "semester",
      render: (value) => {
        return formatSemester(value);
      },
    },
    { title: "Year offered", dataIndex: "yearOffered", key: "yearOffered" },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (value) => {
        return DateTime.fromISO(value).toFormat("MMM dd, yyyy");
      },
    },
    {
      title: "Payment Deadline",
      dataIndex: "paymentDeadline",
      key: "paymentDeadline",
      render: (value) => {
        return DateTime.fromISO(value).toFormat("MMM dd, yyyy");
      },
    },
    {
      title: "Enrollment Capacity",
      dataIndex: "enrollmentCapacity",
      key: "enrollmentCapacity",
    },
    {
      title: "Review Cost",
      dataIndex: "reviewCost",
      key: "reviewCost",
      render: (value) => formatAmount(value),
    },
    {
      title: "Budget Proposal",
      dataIndex: "budgetProposal",
      key: "budgetProposal",
      render: (value) => formatAmount(value),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <CustomButton
            type="primary"
            onClick={() => navigate(`/offerings/${record.id}`)}
          >
            View
          </CustomButton>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Offerings</h1>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <p>Course: </p>
          <Select
            className="h-[40px] w-full"
            disabled={getCoursesLoading || getCoursesError}
            loading={getCoursesLoading}
          >
            {courses?.data?.map((course) => (
              <Option value={course.id} key={course.id}>
                {course.name}
              </Option>
            ))}
          </Select>
          {getCoursesError && (
            <label className="text-secondary"> Unable to fetch courses. </label>
          )}
        </Col>

        <Col span={4}>
          <p>Program: </p>
          <Select className="h-[40px] w-full">
            {REVIEW_PROGRAM.map((program) => (
              <Option value={program.value} key={program.value}>
                {program.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col span={4}>
          <p>Year Offered: </p>
          <Select className="h-[40px] w-full">
            {YEAR.map((y) => (
              <Option value={y} key={y}>
                {y}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <p>Semester Offered: </p>
          <Select className="h-[40px] w-full">
            {SEMESTER.map((sem) => (
              <Option value={sem.value} key={sem.value}>
                {sem.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={3} className="flex items-center mt-4">
          <CustomButton type="primary" className="mr-2">
            Filter
          </CustomButton>
          <CustomButton type="primary">Clear</CustomButton>
        </Col>

        <Col span={24}>
          <Button
            className="w-auto bg-primary text-white float-right mt-[3vh]"
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
              dataSource={offerings && offerings?.data}
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
