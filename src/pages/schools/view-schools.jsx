import React, { useEffect, useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { Row, Col, Card, Divider, Form } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import useMutation from "../../hooks/useMutation";
import useSchools from "../../hooks/useSchools";
import Swal from "sweetalert2";
import { getDataById } from "../../utils/mappings";
import { SCHOOLS_BASE_URL } from "../../constants";
const ViewSchools = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const { data, error } = useSchools();
  const [isEditing, setIsEditing] = useState(false);
  const id = params?.schoolId;
  const { mutate: updateSchool, loading: updateSchoolLoading } = useMutation(
    `${SCHOOLS_BASE_URL}/${id}`,
    "PUT",
    "schools"
  );

  const currentSchool = useMemo(() => {
    if (!data | !id || error) {
      navigate("/schools");
    }
    return getDataById(data?.data, id);
  }, [data, id]);

  useEffect(() => {
    if (data && id) {
      form.setFieldsValue({
        ...currentSchool,
      });
    }
  }, [id, currentSchool]);

  const onFormSubmission = async (val) => {
    updateSchool(val);
    const res = await updateSchool(val);
    if (res) {
      Swal.fire({
        icon: "success",
        title: "School updated!",
        timer: 2000,
      });
      setIsEditing(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error updating school!",
        timer: 2000,
      });
    }
  };

  return (
    <div>
      <CustomButton
        type="text"
        onClick={() => navigate("/schools")}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={36} lg={36}>
          <Card>
            <Form onFinish={onFormSubmission} form={form}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={16} lg={18}>
                  <h1 className="text-2xl mb-[2vh]">
                    Manage {currentSchool?.name}
                  </h1>
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
                          disabled={updateSchoolLoading}
                        >
                          Cancel
                        </CustomButton>

                        <CustomButton
                          size="large"
                          type="primary"
                          className="w-auto bg-primary text-white"
                          htmlType="submit"
                          disabled={updateSchoolLoading}
                        >
                          Save
                        </CustomButton>
                      </div>
                    ) : (
                      <CustomButton
                        type="primary"
                        size="large"
                        className="w-auto bg-primary text-white"
                        disabled={updateSchoolLoading}
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
                          message: "Please input school name",
                        },
                      ]}
                    >
                      <CustomInput />
                    </Form.Item>
                  ) : (
                    currentSchool?.name
                  )}
                </p>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ViewSchools;
