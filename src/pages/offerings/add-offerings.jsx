import React, { useCallback, useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { Select, Form, DatePicker } from "antd";
import { useCourse } from "../../contexts/courses";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { DateTime } from "luxon";
import useMutation from "../../hooks/useMutation";
import { DEFAULT_BRANCH_ID, SEMESTER, YEAR } from "../../constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useProgramContext } from "../../contexts/programs";
import { ArrowLeftOutlined } from "@ant-design/icons";
const { Option } = Select;

const AddOfferings = () => {
  const navigate = useNavigate();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();
  const [selectedCourseId, setSelectedCourseId] = useState(undefined);
  const { mutate: AddOffering, loading: AddOfferingLoading } = useMutation(
    `branches/${DEFAULT_BRANCH_ID}/courses/${selectedCourseId}/offerings`,
    "POST",
    "offerings"
  );
  const { programs, getProgramsLoading, getProgramsError } =
    useProgramContext();

  if (getCoursesError) {
    return <GenericErrorDisplay />;
  }

  const onFinish = (values) => {
    const formattedPaymentDeadline = DateTime.fromJSDate(
      values.paymentDeadline.toDate()
    ).toISO({
      includeOffset: false,
    });
    const formattedStartDate = DateTime.fromJSDate(
      values.startDate.toDate()
    ).toISO({
      includeOffset: false,
    });

    const updatedValues = {
      ...values,
      paymentDeadline: formattedPaymentDeadline,
      startDate: formattedStartDate,
      yearOffered: values.yearOffered,
      enrollmentCapacity: 0,
    };

    delete updatedValues.courseId;

    handleAddOffering(updatedValues);
  };

  const handleAddOffering = useCallback(
    async (values) => {
      if (!selectedCourseId) {
        Swal.fire({
          icon: "warning",
          title: "Please select course for this offering.",
          timer: 2000,
        });
      }
      try {
        const res = await AddOffering(values);
        if (res) {
          navigate("/offerings");
          Swal.fire({
            icon: "success",
            title: "Offering successfully added!",
            timer: 2000,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title:
            "Something went wrong on adding offering, Please try again later!",
          timer: 2000,
        });
      }
    },
    [selectedCourseId, AddOffering]
  );

  return (
    <div className="w-1/2">
      <CustomButton
        type="text"
        onClick={() => navigate("/offerings")}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />
      <h1 className="text-2xl mb-[2vh]">Add Offerings</h1>
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          program: "INTENSIVE",
          semester: "FIRST_SEMESTER",
          yearOffered: "2024-2025",
        }}
      >
        <Form.Item
          label="Course"
          name="courseId"
          rules={[{ required: true, message: "Please select course!" }]}
        >
          <Select
            loading={getCoursesLoading}
            disabled={getCoursesLoading}
            placeholder="Select Course"
            onChange={(value) => setSelectedCourseId(value)}
            className="h-[40px] w-full mb-[10px]"
          >
            {courses &&
              courses?.data.map((course) => {
                return (
                  <Option key={course.id} value={course.id}>
                    {" "}
                    {course.name}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>

        <Form.Item
          label="Review Program"
          name="reviewProgramId"
          rules={[{ required: true, message: "Please select review program!" }]}
        >
          <Select
            className="h-[40px] w"
            name="reviewProgramId"
            disabled={getProgramsError || getProgramsLoading}
            loading={getProgramsLoading}
          >
            {programs &&
              programs?.data?.map((program) => (
                <Option value={program.id} key={program.id}>
                  {program.name}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Semester Offered"
          name="semester"
          rules={[{ required: true, message: "Please select semester!" }]}
        >
          <Select name="semester" className="h-[40px] w">
            {SEMESTER.map((sem) => (
              <Option value={sem.value} key={sem.value}>
                {sem.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="School Year"
          name="yearOffered"
          rules={[{ required: true, message: "Please select year!" }]}
        >
          <Select placeholder="Year" className="h-[40px] w-full">
            {YEAR.map((y) => (
              <Option value={y?.toString()} key={y}>
                {y}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select start date!" }]}
        >
          <DatePicker className="w-full" size="large" />
        </Form.Item>

        <Form.Item
          label="Payment Deadline"
          name="paymentDeadline"
          rules={[
            { required: true, message: "Please select payment deadline!" },
          ]}
        >
          <DatePicker className="w-full" size="large" />
        </Form.Item>

        <Form.Item
          label="Review Fee"
          name="reviewCost"
          rules={[{ required: true, message: "Please input review cost!" }]}
        >
          <CustomInput type="text" className="w-full h-[40px]" />
        </Form.Item>

        <div className="text-right mb-5">
          <Form.Item>
            <CustomButton
              type="primary"
              htmlType="submit"
              size="large"
              loading={AddOfferingLoading}
              disabled={AddOfferingLoading}
            >
              Submit
            </CustomButton>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default AddOfferings;
