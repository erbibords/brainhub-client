import React, { useEffect } from "react";
import CustomButton from "../../components/Button/Button";
import { Table, Space, Row, Col, Button, Select, Form } from "antd";
import { useNavigate } from "react-router";
import { useOfferingsContext } from "../../contexts/offerings";
import { useCourse } from "../../contexts/courses";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { DateTime } from "luxon";
import { formatSemester, formatAmount } from "../../utils/formatting";
import { REVIEW_PROGRAM, SEMESTER, YEAR } from "../../constants";
const { Option } = Select;

const Offerings = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();
  const {
    data: offerings,
    getOfferingsLoading,
    getOfferingsError,
    setParams,
  } = useOfferingsContext();

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
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      render: (value) => {
        return formatSemester(value);
      },
    },
    { title: "School Year", dataIndex: "yearOffered", key: "yearOffered" },
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
      title: "Enrollees",
      dataIndex: "enrollmentCapacity",
    },
    {
      title: "Review Fee",
      dataIndex: "reviewFee",
      render: (value) => formatAmount(value),
    },
    {
      title: "Total Collectibles",
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

  const onSearch = (values) => {
    console.log("Form values on search:", values); // Log form values for debugging
    // Apply filtering logic here using setParams or any other method
  };
  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Offerings</h1>
      <Form
        form={form}
        className="w-full"
        onFinish={onSearch}
        initialValues={{
          course: "",
          program: "",
          year: "",
          semester: "FIRST_SEMESTER",
        }}
      >
        <Row gutter={[12, 12]}>
          <Col span={5}>
            <Form.Item name="course">
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
            </Form.Item>
            {getCoursesError && (
              <label className="text-secondary">Unable to fetch courses.</label>
            )}
          </Col>

          <Col span={5}>
            <Form.Item name="program">
              <p>Program: </p>
              <Select className="h-[40px] w-full">
                {REVIEW_PROGRAM.map((program) => (
                  <Option value={program.value} key={program.value}>
                    {program.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={4}>
            <Form.Item name="year">
              <p>Year Offered: </p>
              <Select className="h-[40px] w-full">
                {YEAR.map((y) => (
                  <Option value={y} key={y}>
                    {y}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="semester">
              <p>Semester Offered: </p>
              <Select
                className="h-[40px] w-full"
                onChange={(val) => console.log(val)}
              >
                {SEMESTER.map((sem) => (
                  <Option value={sem.value} key={sem.value}>
                    {sem.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} className="flex items-center">
            <CustomButton type="primary" className="mr-2" htmlType="submit">
              Filter
            </CustomButton>
            <CustomButton
              type="primary"
              htmlType="button"
              onClick={() => {
                form.resetFields();
                console.log(form.getFieldsValue());
              }}
            >
              Clear
            </CustomButton>
          </Col>
        </Row>
      </Form>
      <Row gutter={[12, 24]}>
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
