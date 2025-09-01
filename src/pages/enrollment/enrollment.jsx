import { useCallback, useState, useMemo, useEffect } from "react";
import { Table, Row, Col, Select, DatePicker, Form, Button, Space } from "antd";
import CustomInput from "../../components/Input/Input";
import useSchools from "../../hooks/useSchools";
import { useEnrollmentsContext } from "../../contexts/enrollments";
import { useCourse } from "../../contexts/courses";
import { DateTime } from "luxon";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { getCourseById, getSchoolById } from "../../utils/mappings";
import CustomButton from "../../components/Button/Button";
import {
  formatAmount,
  formatSemester,
  formatTakerType,
} from "../../utils/formatting";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // Display 25 per page
  const [isFiltered, setIsFiltered] = useState(false); // Track if filters are applied

  const [searchParams, setSearchParams] = useState({
    startDate: undefined,
    endDate: undefined,
    studentName: undefined,
    courseId: undefined,
    schoolId: undefined,
    semester: undefined,
    yearOffered: undefined,
    offeringType: undefined,
  });

  useEffect(() => {
    // Initial load: fetch 200 records, Filtered: fetch all records
    const apiPageSize = isFiltered ? 10000 : 200; // Use large number to get all filtered results
    const apiPageNo = 1; // Always fetch from page 1

    console.log("Enrollments API call params:", {
      apiPageNo,
      apiPageSize,
      isFiltered,
      currentPage,
      pageSize,
    });

    setParams({
      pageNo: apiPageNo,
      pageSize: apiPageSize,
    });
  }, [isFiltered, setParams]);

  const handleFilter = useCallback(() => {
    setCurrentPage(1); // Reset to first page when filtering
    setIsFiltered(true); // Mark as filtered to fetch all records
    setParams({
      ...cleanParams(searchParams),
      pageNo: 1,
      pageSize: 10000, // Fetch all filtered records
    });
  }, [setParams, searchParams]);

  const columns = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: ["student", "fullName"],
        render: (data) => <label className="p-1">{data}</label>,
      },
      {
        title: "Contact #",
        dataIndex: "student",
        render: (student) => {
          return <label>{student?.contactNumber}</label>;
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
        title: "Year Level",
        dataIndex: "yearLevel",
        key: "yearLevel",
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
        title: "Review Fee",
        dataIndex: "reviewFee",
        key: "reviewFee",
        render: (data) => formatAmount(data ?? 0),
      },
      {
        title: "Discount Amount",
        dataIndex: "discountAmount",
        key: "discountAmount",
        render: (data) => formatAmount(data ?? 0),
      },
      {
        title: "Remarks",
        dataIndex: "remarks",
        key: "remarks",
      },
      {
        title: "Processed By",
        dataIndex: "processedBy",
        key: "processedBy",
      },

      {
        title: "Enrollee Type",
        dataIndex: "courseOffering",
        key: "enrolleeType",
        render: (data) => data.offeringType,
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

              <CustomButton
                type="edit"
                onClick={() =>
                  navigate(`/enrollments/edit-enrollment/${record?.id}`)
                }
                title="edit"
                className="w-auto bg-success text-white"
              >
                Edit
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
      setSearchParams({
        ...searchParams,
        startDate: undefined,
        endDate: undefined,
      });
    }
  };

  const expandedRowRender = (record) => {
    const schoolId = record?.student?.schoolId;
    const courseId = record?.courseOffering?.courseId;

    const school = getSchoolById(schools?.data, schoolId ?? null) ?? null;
    const course = getCourseById(courses?.data, courseId ?? null) ?? null;

    return (
      <div className="flex">
        <p className="p-1 font-bold">
          <span className="font-normal mr-[6px]"> School: </span>
          {school?.name}
        </p>

        <p className="p-1 font-bold">
          <span className="font-normal mr-[6px]"> Course: </span>
          {course?.name}
        </p>

        <p className="p-1 font-bold">
          <span className="font-normal mr-[6px]">Taker Type: </span>
          {formatTakerType(record?.takerType)}
        </p>
      </div>
    );
  };

  // Apply client-side pagination to the data
  const paginatedData = useMemo(() => {
    if (!enrollments?.data) return [];
    return enrollments.data.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [enrollments?.data, currentPage, pageSize]);

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

              <Col span={6}>
                <Form.Item name="offeringType">
                  <p>Enrollee Type: </p>
                  <Select
                    loading={schoolsLoading}
                    disabled={schoolsLoading}
                    size="large"
                    className="custom-select"
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        offeringType: e,
                      })
                    }
                    placeholder="Select Enrollee Type" // Optional placeholder
                  >
                    <Option value="all" key="all">
                      All
                    </Option>
                    <Option value="COMBI" key="combi">
                      Combi Enrollee
                    </Option>
                    <Option value="REGULAR" key="regular">
                      Regular Enrollee
                    </Option>
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
                    setCurrentPage(1);
                    setPageSize(25);
                    setIsFiltered(false); // Reset filter state
                    setParams({
                      pageNo: 1,
                      pageSize: 200, // Reset to fetch 200 records
                    });
                    setSearchParams({
                      startDate: undefined,
                      endDate: undefined,
                      studentName: undefined,
                      courseId: undefined,
                      schoolId: undefined,
                      semester: undefined,
                      yearOffered: undefined,
                      offeringType: undefined,
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
                size="small"
                dataSource={paginatedData}
                columns={columns}
                loading={getEnrollmentsLoading}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: enrollments?.data?.length || 0,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${
                      enrollments?.data?.length || 0
                    } items`,
                  pageSizeOptions: ["10", "25", "50", "100"],
                }}
                scroll={{ y: 800 }}
                onChange={(pagination) => {
                  console.log("Enrollments pagination changed:", {
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: enrollments?.data?.length || 0,
                    isFiltered,
                  });
                  setCurrentPage(pagination.current);
                  setPageSize(pagination.pageSize);
                }}
                expandable={{
                  expandedRowRender,
                  rowExpandable: (record) => !!record.student, // Optional: conditionally expand rows if the student object exists
                }}
              />
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Enrollment;
