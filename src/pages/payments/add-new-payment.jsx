import React, { useState, useCallback, useEffect } from "react";
import CustomInput from "../../components/Input/Input";
import { useParams } from "react-router-dom";
import { Layout, Select, Form, Image, DatePicker } from "antd";
import useProfile from "../../hooks/useStudentProfile";
import CustomButton from "../../components/Button/Button";
import { PROCESSED_BY } from "../../constants";
const { Content } = Layout;
const { Option } = Select;

const AddNewPayment = () => {
  const params = useParams();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [imagePreview, setImagePreview] = useState(null);
  if (!params?.studentId) {
    navigate("/students");
  }

  const {
    data: student,
    error: studentError,
    isLoading: studentLoading,
  } = useProfile(params?.studentId);

  console.log(params.studentId, student, studentError, studentLoading);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const course_offering = [
    { key: "1", name: "Information Technology" },
    { key: "2", name: "Business Administration" },
    { key: "3", name: "Marine Engineering" },
  ];

  const onFinish = useCallback(async (values) => {
    console.log("Received values of form: ", values);
    // Handle form submission
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Content style={{ paddingRight: screenWidth <= 1024 ? 0 : "45%" }}>
      <Form
        name="payments"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <div>
          <h1 className="text-2xl mb-[2vh]">Add Payments</h1>
          <p>Student Name: </p>
          <h1 className="text-2xl mb-7">
            {student?.firstName} {student?.middleName} {student?.lastName}
          </h1>

          <Form.Item
            className="mb-[32px]"
            label="Offering:"
            name="courseId"
            rules={[{ required: true, message: "Please select offering" }]}
          >
            <Select
              className="w-full"
              size="large"
              placeholder="Course Offering"
            >
              {course_offering.map((course) => (
                <Option key={course.key} value={course.name}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Amount:"
            name="amount"
            rules={[{ required: true, message: "Please input payment amount" }]}
          >
            <CustomInput
              type="number"
              placeholder="Payment"
              className=" w-full"
            />
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Payment Method:"
            name="paymentMethod"
            rules={[
              { required: true, message: "Please select a payment method." },
            ]}
          >
            <Select className="w-full" size="large">
              <Option value="BANK_TRANSFER">Bank Transfer</Option>
              <Option value="CASH">Cash</Option>
              <Option value="GCASH">Gcash</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mb-[32px]" label="Reference:" name="reference">
            <CustomInput size="large" type="text" className="" />
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Attachment:"
            name="attachment"
          >
            <input type="file" onChange={handleFileChange} />
            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <Image
                  src={imagePreview}
                  alt="Selected"
                  className="max-h-[300px] w-[200px] object-contain"
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Payment Date:"
            name="paymentDate"
            rules={[
              { required: true, message: "Please select a payment date." },
            ]}
          >
            <DatePicker className="w-full" size="large" />
          </Form.Item>

          <Form.Item
            className="mb-[32px]"
            label="Processed By:"
            name="reference"
            rules={[{ required: true, message: "Please select processed by." }]}
          >
            <Select className="w-full" size="large">
              {PROCESSED_BY.map((processedBy) => (
                <Option key={processedBy} value={processedBy}>
                  {processedBy}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div className="text-center mb-[20px]">
            <Form.Item>
              <CustomButton
                type="primary"
                htmlType="submit"
                size="large"
                className="w-auto bg-primary text-white"
              >
                Submit
              </CustomButton>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Content>
  );
};

export default AddNewPayment;
