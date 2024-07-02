import React, { useState, useCallback, useEffect } from "react";
import CustomInput from "../../components/Input/Input";
import { Layout, Select, Button, Form, Image, DatePicker } from "antd";
const { Content } = Layout;
const { Option } = Select;

const AddNewPayment = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [imagePreview, setImagePreview] = useState(null);

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
          <span>Student Name: </span>
          <CustomInput value="Louie" className="mb-[2vh]" disabled />

          <Form.Item
            label="Course Offering:"
            name="courseId"
            rules={[
              { required: true, message: "Please input your Course Offering" },
            ]}
          >
            <Select
              className="w-full mb-[2vh]"
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
            label="Amount:"
            name="amount"
            rules={[{ required: true, message: "Please input Amount" }]}
          >
            <CustomInput
              type="text"
              placeholder="Payment"
              className="mb-[2vh]"
            />
          </Form.Item>

          <Form.Item
            label="Payment Method:"
            name="paymentMethod"
            rules={[
              { required: true, message: "Please select a Payment Method" },
            ]}
          >
            <Select className="w-full mb-[2vh]" size="large">
              <Option value="GCASH">Gcash</Option>
              <Option value="BANK_TRANSFER">Bank Transfer</Option>
              <Option value="CASH">Cash</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Reference:" name="reference">
            <CustomInput type="text" className="mb-[2vh]" />
          </Form.Item>

          <Form.Item label="Attachment:" name="attachment">
            <input
              type="file"
              onChange={handleFileChange}
              className="mb-[2vh]"
            />
            {imagePreview && (
              <div style={{ marginTop: "10px" }}>
                <Image
                  width={200}
                  src={imagePreview}
                  alt="Selected"
                  style={{ maxHeight: "300px", objectFit: "contain" }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            label="Payment Date:"
            name="paymentDate"
            rules={[
              { required: true, message: "Please select a Payment Date" },
            ]}
          >
            <DatePicker className="mb-[2vh]" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Processed By:"
            name="reference"
            rules={[{ required: true, message: "Please input proccessed by" }]}
          >
            <CustomInput type="text" className="mb-[2vh]" />
          </Form.Item>

          <div className="text-right mb-[20px]">
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-auto bg-primary text-white"
              >
                Save
              </Button>
            </Form.Item>
          </div>
        </div>
      </Form>
    </Content>
  );
};

export default AddNewPayment;
