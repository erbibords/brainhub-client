import React, { useEffect, useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { Button, Row, Col, Card, Divider, Skeleton, Form } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import useMutation from "../../hooks/useMutation";
import usePrograms from "../../hooks/usePrograms";

import Swal from "sweetalert2";

const ViewReviewProgram = () => {
  const navigate = useNavigate();

  const params = useParams();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <CustomButton
        type="text"
        onClick={() => navigate("/review-program")}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={36} lg={36}>
          {/* {!data || isLoading ? (
            <Card>
              <Skeleton />
            </Card>
        //   ) : ( */}
          <Card>
            <Form
              //   form={form}
              name="update_program"
              // onFinish={onFormSubmission}
              // onFinishFailed={onFormFailed}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={16} lg={18}>
                  <h1 className="text-2xl mb-[2vh]">Program 1</h1>
                </Col>
                <Col xs={24} sm={24} md={8} lg={6}>
                  <div className="text-right mb-[20px]">
                    {isEditing ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        <CustomButton
                          size="large"
                          className="mr-[10px]"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </CustomButton>

                        <CustomButton
                          size="large"
                          type="primary"
                          className="w-auto bg-primary text-white"
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
                        // disabled={isLoading}
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
                  <strong>Name:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Please input program name",
                        },
                      ]}
                    >
                      <CustomInput />
                    </Form.Item>
                  ) : (
                    ""
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
                          message: "Please input program description",
                        },
                      ]}
                    >
                      <CustomInput />
                    </Form.Item>
                  ) : (
                    ""
                  )}
                </p>

                <Divider />
                <p>
                  <strong>Course:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="course"
                      rules={[
                        {
                          required: true,
                          message: "Please input course",
                        },
                      ]}
                    >
                      <CustomInput />
                    </Form.Item>
                  ) : (
                    ""
                  )}
                </p>

                <Divider />
                <p>
                  <strong>School:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="school"
                      rules={[
                        {
                          required: true,
                          message: "Please input school",
                        },
                      ]}
                    >
                      <CustomInput />
                    </Form.Item>
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </Form>
          </Card>
          {/* //   )} */}
        </Col>
      </Row>
    </div>
  );
};

export default ViewReviewProgram;
