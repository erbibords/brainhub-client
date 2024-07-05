import React, { useEffect, useState } from "react";
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
import { formatSemester } from "../../utils/formatting";
import { REVIEW_PROGRAM, SEMESTER, YEAR } from "../../constants";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";

const ViewOffering = () => {
  const navigate = useNavigate();
  const params = useParams();

  console.log("parameters", params);

  if (!params?.offeringId) {
    navigate("/courses");
  }

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const { courses, coursesLoading, coursesError } = useCourse();
  const {
    data: offering,
    isLoading,
    error: offeringError,
  } = useOffering(params.offeringId);

  if (coursesError || offeringError) {
    Swal.fire({
      icon: "Error",
      title: "Error viewing course offering. Please try again later",
      timer: 2000,
    });
    navigate("/courses");
  }

  console.log("courses", courses);
  console.log("offering", offering);

  const OFFERING_ENTITY_URL = `${OFFERING_BASE_URL}/${params.offeringId}`;
  const { mutate: updateOffering, loading: updateStudentLoading } = useMutation(
    OFFERING_ENTITY_URL,
    "PUT",
    OFFERING_ENTITY_URL
  );

  useEffect(() => {
    if (offering) {
      form.setFieldsValue({
        ...offering,
        testDate: DateTime.fromISO(offering.startDate).toJSDate(),
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

  const onFormSubmission = async (values) => {
    console.log(values);
    const { course, ...body } = values;
    try {
      const res = await updateOffering({
        ...body,
        courseId: course.id,
        startDate: offering.startDate,
        paymentDeadline: offering.paymentDeadline,
      });
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Course information updated!",
          timer: 2000,
        });
        setIsEditing(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Course Information Update Error",
        text: "There might be some error in your entries. Please double check and try again!",
      });
    }
  };

  const studentListData = [
    {
      key: "1",
      name: "Louie Doooao",
      school: "Ui",
      year: "2024",
      semester: "1st",
      enrollmentDate: "2024-06-30",
    },
    {
      key: "2",
      name: "Johnny Papa",
      school: "San ag",
      year: "2024",
      semester: "2nd",
      enrollmentDate: "2024-06-29",
    },
  ];
  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "School", dataIndex: "school", key: "school" },
    { title: "Year", dataIndex: "year", key: "year" },
    { title: "Semester", dataIndex: "semester", key: "semester" },
    {
      title: "Enrollment Date",
      dataIndex: "enrollmentDate",
      key: "enrollmentDate",
    },
  ];

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
                      <Form.Item name="program">
                        <Select
                          options={REVIEW_PROGRAM.map((program) => ({
                            value: program.value,
                            label: program.value,
                          }))}
                        />
                      </Form.Item>
                    ) : (
                      offering.program
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
                        <DatePicker className="w-full" size="large" />
                      </Form.Item>
                    ) : (
                      offering.startDate
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Payment Deadline:</strong>{" "}
                    {isEditing ? (
                      <Form.Item>
                        <DatePicker className="w-full" size="large" />
                      </Form.Item>
                    ) : (
                      offering.paymentDeadline
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Capacity:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name="enrollmentCapacity">
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      offering.enrollmentCapacity
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Review cost:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name="reviewCost">
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      offering.reviewCost
                    )}
                  </p>
                  <Divider />

                  <p>
                    <strong>Budget proposal:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name="budgetProposal">
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      offering.budgetProposal
                    )}
                  </p>
                  <Divider />
                </div>
              </Form>

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Table
                    dataSource={studentListData}
                    columns={columns}
                    title={() => (
                      <h2 className="text-2xl">Enrolled Student List</h2>
                    )}
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
