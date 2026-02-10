import React, { useEffect, useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { Button, Row, Col, Card, Divider, Skeleton, Form, Select } from "antd";
import useProfile from "../../hooks/useStudentProfile";
import useSchools from "../../hooks/useSchools";
import { useParams, useNavigate } from "react-router-dom";
import useMutation from "../../hooks/useMutation";
import Swal from "sweetalert2";
import { STUDENT_BASE_URL } from "../../constants";
import { useBranch } from "../../contexts/branch";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { StudentEnrollments } from "./student-enrollments";
import { PaymentHistory } from "./payment-history";

const StudentProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  if (!params?.studentId) {
    navigate("/students");
  }

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const { branchId } = useBranch();

  const { data, error, isLoading, refetch } = useProfile(params?.studentId);
  const {
    data: schools,
    error: isSchoolError,
    isLoading: isSchoolsLoading,
  } = useSchools();

  if (error || isSchoolError) {
    navigate("/students");
  }

  const STUDENT_ENTITY_URL = useMemo(() => {
    return `${STUDENT_BASE_URL()}/${params.studentId}`;
  }, [branchId, params?.studentId]);
  const { mutate: updateStudentProfile, loading: updateStudentLoading } =
    useMutation(STUDENT_ENTITY_URL, "PUT", "students");

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        schoolId: data.school.id,
      });
    }
  }, [data]);

  const onFormFailed = (errorInfo) => {
    Swal.fire({
      icon: "error",
      title: "Student Information Update Error",
      text: JSON.stringify(errorInfo),
    });
  };

  const onFormSubmission = async (values) => {
    try {
      const res = await updateStudentProfile(values);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Student information updated!",
          timer: 2000,
        });
        setIsEditing(false);
        refetch();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Student Information Update Error",
        text: "There might be some error in your entries. Please double check and try again!",
      });
    }
  };

  return (
    <div>
      <CustomButton
        type="text"
        onClick={() => navigate("/students")}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={36} lg={36}>
          {!data || (isLoading && isSchoolsLoading) ? (
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
                      {data.firstName} {data?.middleName ?? ""} {data.lastName}
                    </h1>
                  </Col>
                </Row>
                <Divider />
                <div layout="vertical" className="w-1/2">
                  {isEditing && (
                    <>
                      <strong>First name:</strong>{" "}
                      <Form.Item
                        name="firstName"
                        rules={[
                          {
                            required: true,
                            message: "Please input your First Name",
                          },
                        ]}
                      >
                        <CustomInput />
                      </Form.Item>
                      <Divider />
                    </>
                  )}
                  {isEditing && (
                    <>
                      <strong>Middle name:</strong>{" "}
                      <Form.Item name="middleName">
                        <CustomInput />
                      </Form.Item>
                      <Divider />
                    </>
                  )}
                  {isEditing && (
                    <>
                      <strong>Last name:</strong>{" "}
                      <Form.Item
                        name="lastName"
                        rules={[
                          {
                            required: true,
                            message: "Please input your Last Name",
                          },
                        ]}
                      >
                        <CustomInput />
                      </Form.Item>
                      <Divider />
                    </>
                  )}
                  <p>
                    <strong>School:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name="schoolId">
                        <Select
                          options={schools.data.map((school) => ({
                            value: school.id,
                            label: school?.name,
                          }))}
                        />
                      </Form.Item>
                    ) : (
                      data.school?.name
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Address:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name="address">
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      data.address
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Contact No.:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name="contactNumber">
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      data.contactNumber
                    )}
                  </p>
                  <Divider />
                  <div style={{ marginTop: "15px", marginBottom: "20px" }}>
                    <small>
                      <i className="mb-[2vh]">
                        Person to be notified in case of emergency:
                      </i>
                    </small>
                  </div>
                  <p>
                    <strong>Contact Name:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name={["emergencyContact", "name"]}>
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      data.emergencyContact?.name
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Relationship:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name={["emergencyContact", "relationship"]}>
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      data.emergencyContact?.relationship
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Emergency Address:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name={["emergencyContact", "address"]}>
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      data.emergencyContact?.address
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Emergency Contact No.:</strong>{" "}
                    {isEditing ? (
                      <Form.Item name={["emergencyContact", "contactNumber"]}>
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      data.emergencyContact?.contactNumber
                    )}
                  </p>
                </div>
                <Col xs={24} sm={24} md={8} lg={12}>
                  <div style={{ textAlign: "right", marginTop: "20px" }}>
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
                        disabled={!data && isLoading}
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </Col>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
      <Divider />
      <StudentEnrollments enrollments={data?.enrollments ?? []} />
      <Divider />
      <PaymentHistory payments={data?.payments ?? []} />
    </div>
  );
};

export default StudentProfile;
