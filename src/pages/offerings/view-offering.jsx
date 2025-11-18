import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Select,
  Row,
  Col,
  Card,
  Divider,
  Skeleton,
  Form,
  DatePicker,
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
import { useBranch } from "../../contexts/branch";

const ViewOffering = () => {
  const navigate = useNavigate();
  const params = useParams();

  if (!params?.offeringId) {
    navigate("/offerings");
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
    navigate("/offerings");
  }

  const { branchId } = useBranch();
  const offeringBaseUrl = useMemo(() => OFFERING_BASE_URL(), [branchId]);
  const OFFERING_ENTITY_URL = `${offeringBaseUrl}/${params.offeringId}`;
  const { mutate: updateOffering, loading: updateStudentLoading } = useMutation(
    OFFERING_ENTITY_URL,
    "PUT",
    "offerings"
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

  return (
    <div>
      <Button
        type="text"
        onClick={() => navigate("/courses")}
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
                    <div style={{ textAlign: "right", marginBottom: "20px" }}>
                      {isEditing ? (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            size="large"
                            style={{ marginRight: "10px" }}
                            className="mr-[10px]"
                            loading={updateStudentLoading}
                            disabled={updateStudentLoading}
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>

                          <Button
                            size="large"
                            type="primary"
                            className="w-auto bg-primary text-white"
                            loading={updateStudentLoading}
                            disabled={updateStudentLoading}
                            htmlType="submit"
                          >
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="primary"
                          size="large"
                          className="w-auto bg-primary text-white"
                          disabled={!offering && isLoading}
                          onClick={() => setIsEditing(true)}
                        >
                          Edit
                        </Button>
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
                    <strong>Year Offered:</strong>{" "}
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
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ViewOffering;
