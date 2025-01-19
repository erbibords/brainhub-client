import React, { useCallback, useEffect } from "react";
import CustomButton from "../../components/Button/Button";
import { Table, Space, Row, Col, Button, Select, Form } from "antd";
import { useNavigate } from "react-router";
import { useOfferingsContext } from "../../contexts/offerings";
import { useCourse } from "../../contexts/courses";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { DateTime } from "luxon";
import { formatSemester, formatAmount } from "../../utils/formatting";
import { SEMESTER, YEAR } from "../../constants";
import { useProgramContext } from "../../contexts/programs";
import { cleanParams } from "../../utils/formatting";
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
  const { programs, getProgramsLoading, getProgramsError } =
    useProgramContext();

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
      dataIndex: "reviewProgram",
      key: "reviewProgram",
      render: (data) => data?.name,
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
      title: "Enrollee Type",
      dataIndex: "offeringType",
      key: "enrolleeType",
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
    const params = cleanParams(values);
    console.log("filtering courses by", params);
    setParams({
      ...params,
      pageNo: 1,
      pageSize: 25,
    });
  };

  const handleClear = useCallback(() => {
    form.resetFields();
    setParams({
      pageNo: 1,
      pageSize: 25,
    });
  }, [form]);

  console.log("UPDATED OFFERINGS", offerings);

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Offerings</h1>
      <Form form={form} onFinish={onSearch}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item
              name="courseId"
              label="Course: "
              layout="vertical"
              className="w-full h-[70px]"
            >
              <Select
                className="h-[40px] w-full"
                disabled={getCoursesLoading || getCoursesError}
                loading={getCoursesLoading}
                name="courseId"
              >
                {courses?.data?.map((course) => (
                  <Option value={course.id} key={course.id}>
                    {course.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="reviewProgramName"
              label="Program :"
              layout="vertical"
              className="w-full"
            >
              <Select
                className="h-[40px] w-full"
                name="reviewProgramName"
                disabled={getProgramsError || getProgramsLoading}
                loading={getProgramsLoading}
              >
                {programs &&
                  Array.from(
                    new Set(programs?.data.map((pg) => pg.name) ?? [])
                  ).map((pg, index) => (
                    <Option value={pg} key={index}>
                      {pg}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="yearOffered"
              label="Year : "
              layout="vertical"
              className="w-full"
            >
              <Select className="h-[40px] w-full" name="yearOffered">
                {YEAR.map((y) => (
                  <Option value={y} key={y}>
                    {y}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="semester"
              layout="vertical"
              className="w-full"
              label="Semester: "
            >
              <Select className="h-[40px] w-full" name="semester">
                {SEMESTER.map((sem) => (
                  <Option value={sem.value} key={sem.value}>
                    {sem.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="offeringType"
              layout="vertical"
              className="w-full"
              label="Enrollee Type: "
            >
              <Select className="h-[40px] w-full" name="offeringType">
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

          <Col span={8} className="flex items-end" style={{ paddingTop: 30 }}>
            <Form.Item label="">
              <CustomButton type="primary" className="mr-2" htmlType="submit">
                Filter
              </CustomButton>
              <CustomButton
                type="primary"
                htmlType="button"
                onClick={handleClear}
              >
                Clear
              </CustomButton>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[12, 24]}>
          <Col span={24}>
            <CustomButton
              className="w-auto bg-primary text-white float-right mt-[3vh]"
              size="large"
              onClick={() => {
                navigate(`/offerings/add`);
              }}
            >
              Add Offerings
            </CustomButton>
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
      </Form>
    </div>
  );
};

export default Offerings;
