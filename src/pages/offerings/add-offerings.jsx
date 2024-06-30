import React, { useCallback, useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { Select, Form, DatePicker } from "antd";
import { useCourse } from "../../contexts/courses";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { DateTime } from "luxon";
import useMutation from "../../hooks/useMutation";
import { DEFAULT_BRANCH_ID } from "../../constants";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const AddOfferings = () => {
  const navigate = useNavigate();
  const { courses, getCoursesLoading, getCoursesError } = useCourse();
  const [selectedCourseId, setSelectedCourseId] = useState(undefined);
  const { mutate: AddOffering, loading: AddOfferingLoading } = useMutation(
    `branches/${DEFAULT_BRANCH_ID}/courses/${selectedCourseId}/offerings`,
    "POST"
  );
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
      yearOffered: parseInt(values.yearOffered),
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
      <h1 className="text-2xl mb-[2vh]">Add Offerings</h1>
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          program: "INTENSIVE",
          semester: "FIRST_SEMESTER",
          yearOffered: 2024,
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
          name="program"
          rules={[{ required: true, message: "Please select review program!" }]}
        >
          <Select
            defaultValue="INTENSIVE"
            className="h-[40px] w-full mb-[10px]"
          >
            <Option value="INTENSIVE">Intensive</Option>
            <Option value="ENHANCEMENT">Enhancement-Intensive</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Semester Offered"
          name="semester"
          rules={[{ required: true, message: "Please select semester!" }]}
        >
          <Select placeholder="Semester" className="h-[40px] w-full mb-[10px]">
            <Option value="FIRST_SEMESTER">1st</Option>
            <Option value="SECOND_SEMESTER">2nd</Option>
            <Option value="SUMMER">Summer</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Year Offered"
          name="yearOffered"
          rules={[{ required: true, message: "Please select year!" }]}
        >
          <Select
            placeholder="Year"
            defaultValue="2024"
            className="h-[40px] w-full"
          >
            <Option value={2023}>2023</Option>
            <Option value={2024}>2024</Option>
            <Option value={2025}>2025</Option>
            <Option value={2026}>2026</Option>
            <Option value={2027}>2027</Option>
            <Option value={2028}>2028</Option>
            <Option value={2029}>2029</Option>
            <Option value={2030}>2030</Option>
            <Option value={2031}>2031</Option>
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
          label="Capacity"
          name="enrollmentCapacity"
          rules={[{ required: true, message: "Please input capacity!" }]}
        >
          <CustomInput type="number" className="w-full" />
        </Form.Item>

        <Form.Item
          label="Review Cost"
          name="reviewCost"
          rules={[{ required: true, message: "Please input review cost!" }]}
        >
          <CustomInput type="text" className="w-full h-[40px]" />
        </Form.Item>

        <Form.Item
          label="Budget Proposal"
          name="budgetProposal"
          rules={[{ required: true, message: "Please input budget proposal!" }]}
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