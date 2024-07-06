import React, { useState, useCallback } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import useSchools from "../../hooks/useSchools";
import { useCourse } from "../../contexts/courses";
import {
  Table,
  Row,
  Col,
  Space,
  Select,
  DatePicker,
  Image,
  Form,
  Button,
} from "antd";
import { SEMESTER, MEDIA_BASE_URL } from "../../constants";
import { usePaymentsContext } from "../../contexts/payments";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { getCourseOfferingName } from "../../utils/mappings";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { cleanParams } from "../../utils/formatting";

const { Option } = Select;
const { RangePicker } = DatePicker;

const PaymentsList = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { payments, getPaymentsLoading, getPaymentsError, setParams } =
    usePaymentsContext();

  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();

  const [searchParams, setSearchParams] = useState({
    referenceNo: undefined,
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

  const columns = [
    {
      title: "Name",
      render: (_, record) => record.enrollment.student.fullName,
    },
    { title: "Reference", dataIndex: "referenceNo" },

    { title: "Payment Amount", dataIndex: "amountPaid" },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    { title: "Payment Date", dataIndex: "paidAt" },
    {
      title: "Attachment",
      dataIndex: "attachment",
      render: (_, record) => {
        return record?.attachments?.length ? (
          <Image
            width={100}
            height={100}
            src={`${MEDIA_BASE_URL}/${record?.attachments[0]}`}
            alt={record?.attachments[0]}
            preview={{
              className: "custom-image-preview",
              mask: <div>Click to preview</div>,
              maskClassName: "custom-mask",
            }}
          />
        ) : (
          ""
        );
      },
    },
    {
      title: "Offering",
      dataIndex: "offering",
      render: (_, record) =>
        getCourseOfferingName(record.enrollment.courseOffering),
    },
    { title: "Processed by", dataIndex: "processedBy" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <CustomButton
            onClick={() => navigate(`/prints/receipt/${record?.id}`)}
          >
            Print
          </CustomButton>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Payment Lists</h1>
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

              <Col span={4}>
                <Form.Item name="referenceNo">
                  <p>Reference:</p>
                  <CustomInput
                    placeholder="Reference"
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        referenceNo: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>

              <Col span={4}>
                <Form.Item name="studentName">
                  <p>Student Name:</p>
                  <CustomInput
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        studentName: e.target.value,
                      })
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item name="courseId">
                  <p>Course:</p>
                  <Select
                    className="w-full"
                    loading={getCoursesLoading}
                    disabled={getCoursesLoading || getCoursesError}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        courseId: e,
                      })
                    }
                  >
                    {courses &&
                      courses?.data?.map((course) => (
                        <Option value={course.id}> {course.name}</Option>
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
                        <Option value={school.id}> {school.name}</Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item name="semester">
                  <p>Semester:</p>
                  <Select
                    className="h-[50px] w-full mb-[10px]"
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
                    <Option value="2024">2024</Option>
                    <Option value="2025">2025</Option>
                    <Option value="2026">2026</Option>
                    <Option value="2027">2027</Option>
                    <Option value="2028">2028</Option>
                    <Option value="2029">2029</Option>
                    <Option value="2030">2030</Option>
                    <Option value="2031">2031</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col span={3} className="flex items-center items-end mb-1">
                <CustomButton
                  type="primary"
                  size="large"
                  className="bg-primary text-white"
                  onClick={handleFilter}
                >
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
                      referenceNo: undefined,
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

              <Col span={15}>
                <CustomButton
                  type="primary"
                  className="w-auto bg-success text-white mt-[25px] float-right"
                  size="large"
                  onClick={() =>
                    navigate(`/prints/payment-list/:paymentListID`)
                  }
                >
                  Print List
                </CustomButton>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            {getPaymentsError ? (
              <GenericErrorDisplay />
            ) : (
              <Table
                dataSource={payments && payments?.data}
                columns={columns}
                loading={getPaymentsLoading}
              />
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PaymentsList;
