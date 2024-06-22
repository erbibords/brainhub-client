import React, { useState } from "react";

import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import useSchools from "../../hooks/useSchools";
import { useCourse } from "../../contexts/courses";
import {
  Layout,
  Input,
  Table,
  Space,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
} from "antd";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PaymentsList = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();

  const data = [
    {
      key: "1",
      reference: "Reference 02131",
      firstName: "Louie",
      middleName: "Emms",
      lastName: "Emms",
      schoolId: "WVSU",
      takerType: "1st Taker",
      courseId: "BSIT",
      semester: "1st",
      date: "2024-06-10",
      payments: "7500",
    },
    {
      key: "2",
      reference: "Reference 32131",
      firstName: "Johny",
      middleName: "S",
      lastName: "Seens",
      schoolId: "UI",
      takerType: "Re-Taker",
      courseId: "BSEM",
      semester: "2nd",
      date: "2024-05-22",
      payments: "6000",
    },
  ];

  const columns = [
    { title: "Reference", dataIndex: "reference", key: "reference" },
    {
      title: "Name",
      dataIndex: ["firstName", "middleName", "lastName"],
      render: (text, record) => (
        <span>
          {record.firstName} {record.middleName} {record.lastName}
        </span>
      ),
    },
    { title: "School", dataIndex: "schoolId", key: "schoolId" },
    { title: "Student Status", dataIndex: "takerType", key: "takerType" },
    { title: "Course.", dataIndex: "courseId", key: "course" },
    { title: "Semester", dataIndex: "semester", key: "semester" },
    { title: "Date.", dataIndex: "date", key: "date" },
    { title: "Payments", dataIndex: "payments", key: "payments" },

    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (text, record) => (
    //     <Space size="middle">
    //       <Button type="primary" onClick={() => handleViewPaymentList(record.key)} title="View" className="w-auto bg-primary text-white">View</Button>
    //     </Space>
    //   ),
    // },
  ];

  const handleViewPaymentList = (studentId) => {
    alert("debugging...");
  };

  const searchPaymentList = () => {
    console.log("Search value:", searchValue);
    console.log("Selected semester:", selectedSemester);
    console.log("Selected year:", selectedYear);
    console.log("Date From:", dateFrom ? dateFrom.format("YYYY-MM-DD") : null);
    console.log("Date To:", dateTo ? dateTo.format("YYYY-MM-DD") : null);
  };

  const printPaymentList = () => {
    alert("..");
  };

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Payment Lists</h1>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={4}>
              <p>Date From/Date To:</p>
              <RangePicker className="h-[50px]" />
            </Col>

            <Col span={4}>
              <p>Reference:</p>
              <CustomInput
                placeholder="Reference"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </Col>

            <Col span={4}>
              <p>Student Name:</p>
              <CustomInput onChange={(e) => setSearchValue(e.target.value)} />
            </Col>
            <Col span={4}>
              <p>Course:</p>
              <Select
                className="w-full"
                loading={getCoursesLoading}
                disabled={getCoursesLoading || getCoursesError}
              >
                {courses &&
                  courses?.data?.map((course) => (
                    <Option value={course.id}> {course.name}</Option>
                  ))}
              </Select>
            </Col>
            <Col span={8}>
              <p>School:</p>
              <Select
                className="w-full"
                oading={schoolsLoading}
                disabled={schoolsLoading || schoolsError}
              >
                {schools &&
                  schools?.data?.map((school) => (
                    <Option value={school.id}> {school.name}</Option>
                  ))}
              </Select>
            </Col>
            <Col span={4}>
              <p>Semester:</p>
              <Select
                onChange={(value) => setSelectedSemester(value)}
                className="h-[50px] w-full mb-[10px]"
              >
                <Option value="FIRST_SEMESTER">1st</Option>
                <Option value="SECOND_SEMESTER">2nd</Option>
                <Option value="SUMMER">Summer</Option>
              </Select>
            </Col>

            <Col span={4}>
              <p>Year</p>
              <Select className="w-full">
                <Option value="2024">2024</Option>
                <Option value="2025">2025</Option>
                <Option value="2026">2026</Option>
                <Option value="2027">2027</Option>
                <Option value="2028">2028</Option>
                <Option value="2029">2029</Option>
                <Option value="2030">2030</Option>
                <Option value="2031">2031</Option>
              </Select>
            </Col>

            <Col span={4} className="flex items-end mb-1">
              <CustomButton
                type="primary"
                size="large"
                className="bg-primary text-white mb-[10px]"
              >
                Search
              </CustomButton>
            </Col>

            <Col span={12}>
              <Button
                type="primary"
                className="w-auto bg-success text-white mt-[25px] float-right"
                onClick={printPaymentList}
                size="large"
              >
                Print List
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Table dataSource={data} columns={columns} />
        </Col>
      </Row>
    </div>
  );
};

export default PaymentsList;
