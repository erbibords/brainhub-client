import React, { useState, useMemo } from "react";
import { Table, Space, Row, Col, Button, Select, DatePicker } from "antd";
import CustomInput from "../../components/Input/Input";
import useSchools from "../../hooks/useSchools";
import { useEnrollmentsContext } from "../../contexts/enrollments";
import { useCourse } from "../../contexts/courses";
import { DateTime } from "luxon";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { getCourseById, getSchoolById } from "../../utils/mappings";
import CustomButton from "../../components/Button/Button";
import { formatSemester, formatTakerType } from "../../utils/formatting";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Enrollment = () => {
  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();
  const { enrollments, getEnrollmentsLoading, getEnrollmentsError } =
    useEnrollmentsContext();
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });
  const [studentNameFilter, setStudentNameFilter] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(undefined);
  const [selectedSchoolId, setSelectedSchoolId] = useState(undefined);
  const [selectedSemester, setSelectedSemester] = useState(undefined);
  const [selectedYear, setSelectedYear] = useState(undefined);

  const handleViewEnrollment = (studentId) => {
    alert("debugging...");
  };

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "student",
        render: (student) => (
          <label>
            {student.firstName} {student.middleName} {student.lastName}
          </label>
        ),
      },
      {
        title: "School",
        dataIndex: "student",
        render: (data) => {
          if (!data || schoolsLoading || schoolsError) return null;
          const school = getSchoolById(schools?.data, data.schoolId);
          return school ? school.name : null;
        },
      },
      {
        title: "Student Status",
        dataIndex: "takerType",
        render: (data) => formatTakerType(data),
      },
      {
        title: "Course",
        dataIndex: "courseOffering",
        render: (data) => {
          if (!data || getCoursesLoading || getCoursesError) return null;
          const course = getCourseById(courses?.data, data.course.id);
          return course ? course.name : null;
        },
      },
      {
        title: "Semester",
        dataIndex: "courseOffering",
        render: (course) => {
          return formatSemester(course.semester);
        },
      },
      {
        title: "Enrollment Date",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (val) => {
          const date = DateTime.fromISO(val);
          const formattedDate = date.toFormat("MMM dd, yyyy");
          return <label>{formattedDate}</label>;
        },
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <Space size="middle">
            <CustomButton
              type="primary"
              onClick={() => handleViewEnrollment(record.id)}
              title="View"
              className="w-auto bg-primary text-white"
            >
              View
            </CustomButton>
          </Space>
        ),
      },
    ],
    [
      courses,
      getCoursesLoading,
      getCoursesError,
      handleViewEnrollment,
      schools,
      schoolsError,
      schoolsLoading,
    ]
  );

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
  };

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Enrollments</h1>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <p>Date From - Date To:</p>
              <RangePicker
                placeholder={["Date From", "Date To"]}
                className="h-[50px] w-full"
                onChange={handleDateRangeChange}
              />
            </Col>
            <Col span={6}>
              <p>Student Name:</p>
              <CustomInput
                value={studentNameFilter}
                onChange={(e) => setStudentNameFilter(e.target.value)}
                size="large"
              />
            </Col>
            <Col span={6}>
              <p>Course:</p>
              <Select
                className="w-full"
                loading={getCoursesLoading}
                disabled={getCoursesLoading || getCoursesError}
                onChange={(value) => setSelectedCourseId(value)}
              >
                {courses &&
                  courses?.data?.map((course) => (
                    <Option value={course.id} key={course.id}>
                      {course.name}
                    </Option>
                  ))}
              </Select>
            </Col>
            <Col span={6}>
              <p>School</p>
              <Select
                className="w-full"
                oading={schoolsLoading}
                disabled={schoolsLoading || schoolsError}
                onChange={(value) => setSelectedSchoolId(value)}
              >
                {schools &&
                  schools?.data?.map((school) => (
                    <Option value={school.id} key={school.id}>
                      {" "}
                      {school.name}
                    </Option>
                  ))}
              </Select>
            </Col>
            <Col span={3}>
              <p>Semester</p>
              <Select
                className="w-full"
                onChange={(value) => setSelectedSemester(value)}
              >
                <Option value="FIRST_SEMESTER">1st</Option>
                <Option value="SECOND_SEMESTER">2nd</Option>
                <Option value="SUMMER">Summer</Option>
              </Select>
            </Col>

            <Col span={3}>
              <p>Year</p>
              <Select
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
              </Select>
            </Col>

            <Col span={3} className="flex items-end mb-1">
              <CustomButton size="large" onClick={searchEnrollment}>
                Search
              </CustomButton>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          {getEnrollmentsError ? (
            <GenericErrorDisplay />
          ) : (
            <Table
              dataSource={enrollments?.data}
              columns={columns}
              loading={getEnrollmentsLoading}
            />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Enrollment;
