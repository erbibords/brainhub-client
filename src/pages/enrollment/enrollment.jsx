import React, { useCallback, useState, useMemo } from "react";
import { Table, Row, Col, Select, DatePicker, Form, Button, Space } from "antd";
import CustomInput from "../../components/Input/Input";
import useSchools from "../../hooks/useSchools";
import { useEnrollmentsContext } from "../../contexts/enrollments";
import { useCourse } from "../../contexts/courses";
import { DateTime } from "luxon";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { getCourseById, getSchoolById } from "../../utils/mappings";
import CustomButton from "../../components/Button/Button";
import { formatSemester, formatTakerType } from "../../utils/formatting";
import { SEMESTER, YEAR } from "../../constants";
import { useNavigate } from "react-router-dom";
import { cleanParams } from "../../utils/formatting";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Enrollment = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();
  const { enrollments, getEnrollmentsLoading, getEnrollmentsError, setParams } =
    useEnrollmentsContext();

  const [searchParams, setSearchParams] = useState({
    startDate: undefined,
    endDate: undefined,
    studentName: undefined,
    courseId: undefined,
    schoolId: undefined,
    semester: undefined,
    yearOffered: undefined,
  });

  const handleFilter = useCallback(() => {
    setParams(cleanParams(searchParams));
  }, [setParams, searchParams]);

  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });

  const handleViewEnrollment = (studentId) => {
    navigate(`/enrollments/${studentId}`);
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
          const course = getCourseById(courses?.data, data?.courseId);
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
        title: "Processed By",
        dataIndex: "processedBy",
        key: "processedBy",
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => {
          return (
            <Space size="middle">
              <CustomButton
                type="primary"
                onClick={() =>
                  navigate(
                    `/prints/enrollment/${record?.student?.id}/${record?.id}`
                  )
                }
                title="View"
                className="w-auto bg-primary text-white"
              >
                Print RF
              </CustomButton>
            </Space>
          );
        },
      },
    ],
    [
      courses,
      getCoursesLoading,
      getCoursesError,
      schools,
      schoolsError,
      schoolsLoading,
    ]
  );

  const handleDateRangeChange = (dates) => {
    if (dates) {
      const [startDate, endDate] = dates;
      const formatedStartDate = DateTime.fromJSDate(startDate.toDate()).toISO({
        includeOffset: false,
      });
      const formattedEndDate = DateTime.fromJSDate(endDate.toDate()).toISO({
        includeOffset: false,
      });

      setSearchParams({
        ...searchParams,
        startDate: formatedStartDate,
        endDate: formattedEndDate,
      });
    } else {
      setDateRange({ start: null, end: null });
    }
  };

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Enrollments</h1>
      <Form form={form}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Form.Item name="dateRange">
                  <p>Date From - Date To:</p>
                  <RangePicker
                    placeholder={["Date From", "Date To"]}
                    className="h-[50px] w-full"
                    onChange={handleDateRangeChange}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="studentName">
                  <p>Student Name:</p>
                  <CustomInput
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        studentName: e.target.value,
                      })
                    }
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="courseId">
                  <p>Course:</p>
                  <Select
                    className="w-full"
                    loading={getCoursesLoading}
                    disabled={getCoursesLoading || getCoursesError}
                    onChange={(e) => {
                      setSearchParams({
                        ...searchParams,
                        courseId: e,
                      });
                    }}
                  >
                    {courses &&
                      courses?.data?.map((course) => (
                        <Option value={course.id} key={course.id}>
                          {course.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="schoolId">
                  <p>School:</p>
                  <Select
                    className="w-full"
                    oading={schoolsLoading}
                    disabled={schoolsLoading || schoolsError}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        schoolId: e,
                      })
                    }
                  >
                    {schools &&
                      schools?.data?.map((school) => (
                        <Option value={school.id} key={school.id}>
                          {school.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="semester">
                  <p>Semester</p>
                  <Select
                    className="w-full"
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        semester: e,
                      })
                    }
                  >
                    {SEMESTER.map((sem) => (
                      <Option value={sem.value} key={sem.value}>
                        {sem.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3}>
                <Form.Item name="yearOffered">
                  <p>Year</p>
                  <Select
                    className="w-full"
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        yearOffered: e,
                      })
                    }
                  >
                    {YEAR?.map((year) => (
                      <Option value={year} key={year}>
                        {year}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3} className="flex items-center items-end mb-1">
                <CustomButton size="large" onClick={handleFilter}>
                  Filter
                </CustomButton>
                <Button
                  className="w-auto text-primary ms-2"
                  size="large"
                  htmlType="button"
                  onClick={() => {
                    form.resetFields();
                    setParams({
                      pageNo: 1,
                      pageSize: 25,
                    });
                    setSearchParams({
                      startDate: undefined,
                      endDate: undefined,
                      studentName: undefined,
                      courseId: undefined,
                      schoolId: undefined,
                      semester: undefined,
                      yearOffered: undefined,
                    });
                  }}
                >
                  Clear
                </Button>
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
      </Form>
    </div>
  );
};

export default Enrollment;
