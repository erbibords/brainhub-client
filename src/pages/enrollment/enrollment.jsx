import React, { useState } from "react";
<<<<<<< HEAD
import Sidebar from "../../components/SideBar/Sidebar";
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
import CustomInput from "../../components/Input/Input";

const { Content } = Layout;
=======
import { Table, Space, Row, Col, Button, Select, DatePicker } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import CustomInput from "../../components/Input/Input";
import useSchools from "../../hooks/useSchools";
import { useCourse } from "../../contexts/courses";
import { DateTime } from "luxon";
>>>>>>> master
const { Option } = Select;
const { RangePicker } = DatePicker;

const Enrollment = () => {
<<<<<<< HEAD
  const [searchValue, setSearchValue] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const data = [
    {
      key: "1",
      firstName: "Louie",
      middleName: "M",
      lastName: "Emms",
      schoolId: "WVSU",
      takerType: "1st Taker",
      courseId: "BSIT",
      semester: "1st",
      date: "2024-06-10",
    },
    {
      key: "2",
      firstName: "Johny",
      middleName: "S",
      lastName: "Seens",
      schoolId: "UI",
      takerType: "Re-Taker",
      courseId: "BSEM",
      semester: "2nd",
      date: "2024-05-22",
    },
  ];

  const columns = [
    // { title: 'Name', dataIndex: 'name', key: 'name' },
=======
  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();

  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });
  const [studentNameFilter, setStudentNameFilter] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(undefined);
  const [selectedSchoolId, setSelectedSchoolId] = useState(undefined);
  const [selectedSemester, setSelectedSemester] = useState(undefined);
  const [selectedYear, setSelectedYear] = useState(undefined);

  const columns = [
>>>>>>> master
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
    { title: "Course.", dataIndex: "courseId", key: "courseId" },
    { title: "Semester", dataIndex: "semester", key: "semester" },
    { title: "Date.", dataIndex: "date", key: "date" },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
<<<<<<< HEAD
          <Button type="primary" onClick={() => handleViewEnrollment(record.id)} title="View" className="w-auto bg-primary text-white">View</Button>
=======
          <Button
            type="primary"
            onClick={() => handleViewEnrollment(record.id)}
            title="View"
            className="w-auto bg-primary text-white"
          >
            View
          </Button>
>>>>>>> master
        </Space>
      ),
    },
  ];

  const handleViewEnrollment = (studentId) => {
    alert("debugging...");
  };

<<<<<<< HEAD
  const searchEnrollent = () => {
    console.log("Search value:", searchValue);
    console.log("Selected semester:", selectedSemester);
    console.log("Selected year:", selectedYear);
    console.log("Date From:", dateFrom ? dateFrom.format("YYYY-MM-DD") : null);
    console.log("Date To:", dateTo ? dateTo.format("YYYY-MM-DD") : null);
=======
  const searchEnrollment = () => {
    console.log(
      dateRange,
      studentNameFilter,
      selectedCourseId,
      selectedSchoolId,
      selectedSemester,
      selectedYear
    );
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    if (dates) {
      const [startDate, endDate] = dates;
      const formatedStartDate = DateTime.fromJSDate(startDate.toDate()).toISO({
        includeOffset: false,
      });
      const formattedEndDate = DateTime.fromJSDate(endDate.toDate()).toISO({
        includeOffset: false,
      });

      setDateRange({
        from: formatedStartDate,
        to: formattedEndDate,
      });
      console.log(formatedStartDate, formattedEndDate);
    } else {
      setDateRange({ start: null, end: null });
    }
>>>>>>> master
  };

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Enrollments</h1>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row gutter={[16, 16]}>
<<<<<<< HEAD
            <Col span={4}>
              <CustomInput
                placeholder="Student Name"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="mb-4"
              />
            </Col>
            <Col span={4}>
              <CustomInput placeholder="Course" className="mb-4" />
            </Col>
            <Col span={8}>
              <CustomInput placeholder="School" className="mb-4" />
            </Col>
            <Col span={4}>
              <Select
                placeholder="Semester"
                className="w-full mb-4 h-[40px]"
=======
            <Col span={6}>
              <RangePicker
                placeholder={["Date From", "Date To"]}
                className="h-[50px]"
                onChange={handleDateRangeChange}
              />
            </Col>
            <Col span={6}>
              <CustomInput
                placeholder="Student Name"
                value={studentNameFilter}
                onChange={(e) => setStudentNameFilter(e.target.value)}
                size="large"
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Course"
                className="w-full"
                loading={getCoursesLoading}
                disabled={getCoursesLoading || getCoursesError}
                onChange={(value) => setSelectedCourseId(value)}
              >
                {courses &&
                  courses?.data?.map((course) => (
                    <Option value={course.id}> {course.name}</Option>
                  ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                placeholder="School"
                className="w-full"
                oading={schoolsLoading}
                disabled={schoolsLoading || schoolsError}
                onChange={(value) => setSelectedSchoolId(value)}
              >
                {schools &&
                  schools?.map((school) => (
                    <Option value={school.id}> {school.name}</Option>
                  ))}
              </Select>
            </Col>
            <Col span={3}>
              <Select
                placeholder="Semester"
                className="w-full"
>>>>>>> master
                onChange={(value) => setSelectedSemester(value)}
              >
                <Option value="1st">1st</Option>
                <Option value="2nd">2nd</Option>
<<<<<<< HEAD
                <Option value="3rd">3rd</Option>
              </Select>
            </Col>

            <Col span={4}>
              <Select
                placeholder="Year"
                className="w-full mb-4 h-[40px]"
                onChange={(value) => setSelectedSemester(value)}
              >
                <Option value="2020">2020</Option>
                <Option value="2021">2021</Option>
                <Option value="2022">2022</Option>
                <Option value="2023">2023</Option>
                <Option value="2024">2024</Option>
=======
                <Option value="SUMMER">Summer</Option>
              </Select>
            </Col>

            <Col span={3}>
              <Select
                placeholder="Year"
                className="w-full"
                onChange={(value) => setSelectedYear(value)}
              >
                <Option value="2024">2024</Option>
                <Option value="2025">2025</Option>
                <Option value="2026">2026</Option>
                <Option value="2027">2027</Option>
                <Option value="2028">2028</Option>
                <Option value="2029">2029</Option>
                <Option value="2030">2030</Option>
                <Option value="2031">2031</Option>
>>>>>>> master
              </Select>
            </Col>

            <Col span={4}>
<<<<<<< HEAD
              <RangePicker
                placeholder={["Date From", "Date To"]}
                className="h-[50px]"
              />
            </Col>

            <Col span={4}>
              <Button
                type="primary"
                className="w-auto bg-primary text-white mt-[10px]"
                icon={<SearchOutlined />}
                onClick={searchEnrollent}
=======
              <Button
                type="primary"
                size="large"
                className="w-auto bg-primary text-white h-[50px]"
                icon={<SearchOutlined />}
                onClick={searchEnrollment}
>>>>>>> master
              >
                Search
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
<<<<<<< HEAD
          <Table dataSource={data} columns={columns} />
=======
          <Table dataSource={[]} columns={columns} />
>>>>>>> master
        </Col>
      </Row>
    </div>
  );
};

export default Enrollment;
