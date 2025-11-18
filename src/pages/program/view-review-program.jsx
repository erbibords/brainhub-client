import { useEffect, useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { Row, Col, Card, Divider, Form, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import useMutation from "../../hooks/useMutation";
import { useProgramContext } from "../../contexts/programs";
import Swal from "sweetalert2";
import { getDataById } from "../../utils/mappings";
import { REVIEW_PROGRAM_BASE_URL } from "../../constants";
import { useCourse } from "../../contexts/courses";
import useSchools from "../../hooks/useSchools";
import StudentsTable from "./students-table";
import { useBranch } from "../../contexts/branch";
const { Option } = Select;

const ViewReviewProgram = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();
  const { programs, getProgramsError } = useProgramContext();
  const { courses } = useCourse();
  const { data: schools } = useSchools();
  const { branchId } = useBranch();

  const id = params?.programId;

  const reviewProgramBaseUrl = useMemo(() => REVIEW_PROGRAM_BASE_URL(), [branchId]);
  const programsCacheKey = useMemo(() => {
    return `programs-${branchId ?? 'unknown'}`;
  }, [branchId]);

  const { mutate: updateProgram } = useMutation(
    reviewProgramBaseUrl,
    "PUT",
    programsCacheKey
  );

  const currentProgram = useMemo(() => {
    if (!programs) return null;

    return getDataById(programs?.data, id);
  }, [programs]);

  const [isEditing, setIsEditing] = useState(false);

  const onFormSubmission = async (val) => {
    const res = await updateProgram(val, `${reviewProgramBaseUrl}/${id}`);
    if (res) {
      Swal.fire({
        icon: "success",
        title: "Review program updated!",
        timer: 2000,
      });
      setIsEditing(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error updating review program!",
        timer: 2000,
      });
    }
  };

  useEffect(() => {
    if (programs && id && !getProgramsError) {
      form.setFieldsValue({
        ...currentProgram,
      });
    } else {
      navigate("/review-program");
    }
  }, [programs, id, getProgramsError]);

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
          <Card>
            <Form form={form} name="update_program" onFinish={onFormSubmission}>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={16} lg={18}>
                  <h1 className="text-2xl mb-[2vh]">
                    Manage {currentProgram?.name}
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
                        onClick={() => setIsEditing(true)}
                      >
                        Edit
                      </CustomButton>
                    )}
                  </div>
                </Col>
              </Row>
              <Divider />
              <div className="w-1/2">
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
                    currentProgram?.name
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
                    currentProgram?.description
                  )}
                </p>

                <Divider />
                <p>
                  <strong>Course:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="courseId"
                      rules={[
                        {
                          required: true,
                          message: "Please select course",
                        },
                      ]}
                    >
                      <Select name="courseId">
                        {courses?.data?.map((course) => (
                          <Option
                            key={course?.id}
                            value={course?.id}
                            id={course?.id}
                          >
                            {course?.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    currentProgram?.course?.name
                  )}
                </p>

                <Divider />
                <p>
                  <strong>School:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="schoolId"
                      rules={[
                        {
                          required: true,
                          message: "Please select school",
                        },
                      ]}
                    >
                      <Select name="schoolId">
                        {schools?.data?.map((school) => (
                          <Option
                            key={school?.id}
                            value={school?.id}
                            id={school?.id}
                          >
                            {school?.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  ) : (
                    currentProgram?.school?.name
                  )}
                </p>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Students Table Component */}
      <StudentsTable
        programId={id}
        programName={currentProgram?.name}
        programData={currentProgram}
      />
    </div>
  );
};

export default ViewReviewProgram;
