import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Select,
  Row,
  Col,
  Card,
  Divider,
  Skeleton,
  Form,
  DatePicker,
  Table,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import useMutation from "../../hooks/useMutation";
import { useCourse } from "../../contexts/courses";
import Swal from "sweetalert2";
import { OFFERING_BASE_URL } from "../../constants";
import useOffering from "../../hooks/useOffering";
import {
  formatAmount,
  formatDate,
  formatSemester,
} from "../../utils/formatting";
import { SEMESTER, YEAR } from "../../constants";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { getDataById, getSchoolById } from "../../utils/mappings";
import useSchools from "../../hooks/useSchools";
import { useProgramContext } from "../../contexts/programs";
import dayjs from "dayjs";

const ViewOffering = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data: schools } = useSchools();

  if (!params?.offeringId) {
    navigate("/offerings");
  }

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [searchAmount, setSearchAmount] = useState({
    min: 0,
    max: 10000,
  });
  const [enrollments, setEnrollments] = useState([]);
  const { courses, coursesError } = useCourse();
  const {
    data: offering,
    isLoading,
    error: offeringError,
  } = useOffering(params.offeringId);
  const { programs, getProgramsLoading, getProgramsError } =
    useProgramContext();

  useEffect(() => {
    if (offering && offering?.enrollments?.length) {
      setEnrollments(offering?.enrollments);
    }
  }, [offering]);

  if (coursesError || offeringError) {
    Swal.fire({
      icon: "Error",
      title: "Error viewing course offering. Please try again later",
      timer: 2000,
    });
    navigate("/offerings");
  }

  const OFFERING_ENTITY_URL = `${OFFERING_BASE_URL}/${params.offeringId}`;
  const { mutate: updateOffering, loading: updateStudentLoading } = useMutation(
    OFFERING_ENTITY_URL,
    "PUT",
    "offerings"
  );

  console.log(offering);

  useEffect(() => {
    if (offering) {
      form.setFieldsValue({
        ...offering,
        startDate: dayjs(offering?.startDate),
        paymentDeadline: dayjs(offering?.paymentDeadline),
      });
    }
  }, [offering]);

  const onFormFailed = (errorInfo) => {
    Swal.fire({
      icon: "error",
      title: "Student Information Update Error",
      text: JSON.stringify(errorInfo),
    });
  };

  console.log(dayjs(offering?.startDate));

  const onFormSubmission = async (values) => {
    const { course, ...body } = values;
    try {
      const res = await updateOffering({
        ...body,
        courseId: course.id,
        startDate: offering.startDate,
        paymentDeadline: offering.paymentDeadline,
        reviewCost: values?.reviewFee,
      });
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Offering information updated!",
          timer: 2000,
        });
        setIsEditing(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Offering Information Update Error",
        text: "There might be some error in your entries. Please double check and try again!",
      });
    }
  };

  const columns = [
    { title: "Name", dataIndex: ["student", "fullName"], key: "name" },
    {
      title: "School",
      dataIndex: ["student", "schoolId"],
      key: "school",
      render: (data) => {
        const school = getSchoolById(schools?.data, data);
        return school?.name ?? "";
      },
    },
    {
      title: "Review Fee",
      dataIndex: "reviewFee",
      key: "reviewFee",
      render: (data) => formatAmount(data),
    },
    {
      title: "Discount Amount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (data) => formatAmount(data),
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "reviewFee",
    },
    {
      title: "Total Amount Paid",
      dataIndex: "totalAmountPaid",
      key: "totalAmountPaid",
      render: (data) => formatAmount(data),
    },
    {
      title: "Remaining Balance",
      dataIndex: "remainingBalance",
      key: "remainingBalance",
      render: (data) => formatAmount(data),
    },
    {
      title: "Enrollment Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) => formatDate(data),
    },
    {
      title: "Processed By",
      dataIndex: "processedBy",
      key: "processedBy",
    },
  ];

  const filterEnrollment = useCallback(() => {
    if (!searchAmount.min && !searchAmount.max)
      return offering?.enrollments || [];
    if (!offering?.enrollments) return [];

    if (searchAmount?.min >= searchAmount?.max) {
      Swal.fire({
        icon: "error",
        title: "min amount cannot be greater than or equal to max amount!",
      });
      return offering?.enrollments || [];
    }

    const data = offering.enrollments.filter(
      (record) =>
        record.remainingBalance >= searchAmount.min &&
        record.remainingBalance <= searchAmount.max
    );
    setEnrollments(data);
  }, [searchAmount, offering?.enrollments, setEnrollments]);

  const reviewProgram = useMemo(() => {
    if (!programs?.data || !offering?.reviewProgramId) return null;
    return getDataById(programs?.data, offering?.reviewProgramId);
  }, [programs, offering?.reviewProgramId]);

  return (
    <div>
      <CustomButton
        type="text"
        onClick={() => navigate("/offerings")}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={36} lg={36}>
          {!offering || isLoading ? (
            <Card>
              <Skeleton />
            </Card>
          ) : (
            <Card>
              <Form
                form={form}
                name="update_student"
                onFinish={onFormSubmission}
                onFinishFailed={onFormFailed}
                className="mb-10"
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={16} lg={18}>
                    <h1 className="text-2xl mb-[2vh]">
                      {offering.course.name}:{" "}
                      {formatSemester(offering.semester)}
                      {" semester of "}
                      {offering.yearOffered}
                    </h1>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={6}>
                    <div className="text-right mb-5">
                      {isEditing ? (
                        <div className="flex justify-end">
                          <CustomButton
                            size="large"
                            className="mr-[10px]"
                            loading={updateStudentLoading}
                            disabled={updateStudentLoading}
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </CustomButton>

                          <CustomButton
                            size="large"
                            type="primary"
                            className="w-auto bg-primary text-white"
                            loading={updateStudentLoading}
                            disabled={updateStudentLoading}
                            htmlType="submit"
                          >
                            Save
                          </CustomButton>
                        </div>
                      ) : (
                        <CustomButton
                          type="primary"
                          size="large"
                          className="w-auto bg-primary text-white"
                          disabled={!offering && isLoading}
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </CustomButton>
                      )}
                    </div>
                  </Col>
                </Row>
                <Divider />
                <div layout="vertical" className="w-1/2">
                  <p>
                    <strong>Course:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name={["course", "id"]}>
                        <Select
                          options={courses.data.map((course) => ({
                            value: course.id,
                            label: course.name,
                          }))}
                        />
                      </Form.Item>
                    ) : (
                      offering.course.name
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Review program:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name="reviewProgramId">
                        <Select
                          disabled={getProgramsError || getProgramsLoading}
                          options={
                            programs &&
                            programs?.data.map((program) => ({
                              value: program.id,
                              label: program.name,
                            }))
                          }
                        />
                      </Form.Item>
                    ) : (
                      reviewProgram?.name
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Semester Offered:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name="semester">
                        <Select
                          options={SEMESTER.map((semester) => ({
                            value: semester.value,
                            label: semester.value,
                          }))}
                        />
                      </Form.Item>
                    ) : (
                      formatSemester(offering.semester)
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>School Year:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name="yearOffered">
                        <Select
                          options={YEAR.map((year) => ({
                            value: year,
                            label: year,
                          }))}
                        />
                      </Form.Item>
                    ) : (
                      offering.yearOffered
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Start date:</strong>{" "}
                    {isEditing ? (
                      <Form.Item>
                        <DatePicker
                          className="w-full"
                          size="large"
                          defaultValue={dayjs(offering?.startDate)}
                        />
                      </Form.Item>
                    ) : (
                      formatDate(offering.startDate)
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Payment Deadline:</strong>{" "}
                    {isEditing ? (
                      <Form.Item>
                        <DatePicker
                          className="w-full"
                          size="large"
                          defaultValue={dayjs(offering?.paymentDeadline)}
                        />
                      </Form.Item>
                    ) : (
                      formatDate(offering.paymentDeadline)
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Capacity:</strong> {offering.enrollmentCapacity}
                  </p>
                  <Divider />

                  <p>
                    <strong>Review cost:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name="reviewFee">
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      offering.reviewFee
                    )}
                  </p>
                  <Divider />
                </div>
              </Form>

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <h2 className="text-2xl mb-5 mt-10">
                    Enrolled Student List ({enrollments?.length})
                  </h2>
                  <div className="flex flex-col gap-[6px]">
                    <label> Amount paid (min - max):</label>
                    <div className="flex gap-[6px]">
                      <CustomInput
                        type="number"
                        placeholder="min amount"
                        className="w-full"
                        value={searchAmount?.min}
                        onChange={(val) => {
                          setSearchAmount({
                            ...searchAmount,
                            min: val,
                          });
                        }}
                      />
                      <CustomInput
                        type="number"
                        value={searchAmount?.max}
                        placeholder="max amount"
                        className="w-full"
                        onChange={(val) => {
                          setSearchAmount({
                            ...searchAmount,
                            max: val,
                          });
                        }}
                      />
                      <CustomButton
                        onClick={() => {
                          filterEnrollment();
                        }}
                      >
                        Search
                      </CustomButton>
                    </div>
                  </div>
                </Col>
                <Col span={24}>
                  <Table
                    dataSource={enrollments && enrollments}
                    columns={columns}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ViewOffering;
