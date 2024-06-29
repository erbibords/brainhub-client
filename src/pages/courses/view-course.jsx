import React, { useEffect, useState } from "react";
import CustomInput from "../../components/Input/Input";
import { Button, Row, Col, Card, Divider, Skeleton, Form } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import useMutation from "../../hooks/useMutation";
import useCourse from "../../hooks/useCourse";
import Swal from "sweetalert2";
import { COURSE_BASE_URL } from "../../constants";

const ViewCourse = () => {
  const navigate = useNavigate();
  const params = useParams();

  if (!params?.courseId) {
    navigate("/courses");
  }

  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const { data, error, isLoading } = useCourse(params.courseId);

  if (error) {
    navigate("/courses");
  }

  const COURSE_ENTITY_URL = `${COURSE_BASE_URL}/${params.courseId}`;
  const { mutate: updateCourse, loading: updateStudentLoading } = useMutation(
    COURSE_ENTITY_URL,
    "PUT",
    "courses"
  );

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
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
      const res = await updateCourse(values);
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
          {!data || isLoading ? (
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
                    <h1 className="text-2xl mb-[2vh]">{data.name}</h1>
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
                          disabled={!data && isLoading}
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
                    <strong>Name:</strong>{" "}
                    {isEditing ? (
                      <Form.Item
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: "Please input course name",
                          },
                        ]}
                      >
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      data.name
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Description:</strong>{" "}
                    {isEditing ? (
                      <Form.Item
                        name="description"
                        rules={[
                          {
                            required: true,
                            message: "Please input course description",
                          },
                        ]}
                      >
                        <CustomInput />
                      </Form.Item>
                    ) : (
                      data.description
                    )}
                  </p>
                </div>
              </Form>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ViewCourse;
