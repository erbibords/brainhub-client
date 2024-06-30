import React, { useState, useCallback, useEffect } from "react";
import CustomInput from "../../components/Input/Input";
import { Layout, Select, Button, Form } from "antd";
import { SEMESTER } from "../../constants";
const { Content } = Layout;
const { Option } = Select;

const AddNewPayment = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const student_data = [
    {
      key: "1",
      name: "Louie Martea",
      school: "WVSU",
      status: "1st Taker",
      course_offering: "Information Technology",
      payments: "6000",
      semester: "1st",
      year: "2024",
      add_payments: "0",
    },
    {
      key: "2",
      name: "Johny Seens",
      school: "UI",
      status: "Re-Taker",
      course_offering: "",
      payments: "0",
      semester: "",
      year: "",
      add_payments: "0",
    },
  ];

  const course_offering = [
    { key: "1", name: "Information Technology" },
    { key: "2", name: "Business Administration" },
    { key: "3", name: "Marine Engineering" },
  ];

  const sortedStudentData = student_data
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [saveButtonVisible, setSaveButtonVisible] = useState(false);

  const handleSelectChange = (value) => {
    const student = student_data.find((student) => student.name === value);
    setSelectedStudent(student);
    setSaveButtonVisible(student); // Show the save button if a student is selected
  };

  const onFinish = useCallback(async (values) => {
    console.log("Received values of form: ", values);
    // Add Axios logic here to save the payment data
  }, []);

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
          <span>Student Name:</span>
          <Form.Item name="student_name">
            <Select
              className="w-full mb-[2vh]"
              size="large"
              placeholder="Select Student"
              onChange={handleSelectChange}
              showSearch={true}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {sortedStudentData.map((student) => (
                <Option key={student.key} value={student.name}>
                  {student.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Render fields based on selected student */}
          {selectedStudent && (
            <>
              <span>Course Offering:</span>
              <Form.Item
                name="courseId"
                rules={[
                  {
                    required: true,
                    message: "Please input your Course Offering",
                  },
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
              <span>Semester:</span>
              <Form.Item
                name="semester"
                rules={[
                  { required: true, message: "Please select a Semester" },
                ]}
              >
                <Select
                  className="w-full mb-[2vh]"
                  size="large"
                  placeholder="Semester"
                >
                  {SEMESTER.map((sem) => (
                    <Option value={sem.value} key={sem.value}>
                      {sem.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <span>Year:</span>
              <Form.Item
                name="year"
                rules={[{ required: true, message: "Please input the Year" }]}
              >
                <Select
                  className="w-full mb-[2vh]"
                  size="large"
                  placeholder="Year"
                >
                  {[...Array(8)].map((_, index) => {
                    const year = 2023 + index;
                    return (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                name="payments"
                rules={[
                  { required: true, message: "Please input the Payment" },
                ]}
              >
                <CustomInput
                  type="text"
                  name="add_payment"
                  placeholder="Payment"
                  className="mb-[2vh]"
                />
              </Form.Item>
              <Form.Item
                name="add_payment"
                rules={[
                  { required: true, message: "Please input the Payment" },
                ]}
              >
                <CustomInput
                  type="text"
                  name="add_payment"
                  placeholder="Additional Payment"
                  className="mb-[2vh]"
                />
              </Form.Item>
            </>
          )}

          {/* Save button */}
          {saveButtonVisible && (
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
          )}
        </div>
      </Form>
    </Content>
  );
};

export default AddNewPayment;
