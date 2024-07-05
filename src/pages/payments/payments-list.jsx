import React, { useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import useSchools from "../../hooks/useSchools";
import { useCourse } from "../../contexts/courses";
import { Table, Row, Col, Button, Select, DatePicker, Image } from "antd";
import { SEMESTER, MEDIA_BASE_URL } from "../../constants";
import { usePaymentsContext } from "../../contexts/payments";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { getCourseOfferingName } from "../../utils/mappings";

const { Option } = Select;
const { RangePicker } = DatePicker;

const PaymentsList = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const { payments, getPaymentsLoading, getPaymentsError } =
    usePaymentsContext();

  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();

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
  ];

  const searchPaymentList = () => {
    console.log("Search value:", searchValue);
    console.log("Selected semester:", selectedSemester);
    console.log("Selected year:", selectedYear);
    console.log("Date From:", dateFrom ? dateFrom.format("YYYY-MM-DD") : null);
    console.log("Date To:", dateTo ? dateTo.format("YYYY-MM-DD") : null);
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
                {SEMESTER.map((sem) => (
                  <Option value={sem.value} key={sem.value}>
                    {sem.label}
                  </Option>
                ))}
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
                size="large"
              >
                Print List
              </Button>
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
    </div>
  );
};

export default PaymentsList;
