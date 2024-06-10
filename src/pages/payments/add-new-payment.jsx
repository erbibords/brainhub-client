import React, { useState, useCallback, useEffect } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import CustomInput from "../../components/Input/Input";
import { Layout, Select, Button, Form } from "antd";
const { Content } = Layout;
const { Option } = Select;

const AddNewPayment = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const initialMarginBottom = "2vh";

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
    { key: '1', name: 'Louie Martea', school: "WVSU", status: '1st Taker', course_offering: "Information Technology", payments: "6000", semester: "1st", year: "2024", add_payments: "0" },
    { key: '2', name: 'Johny Seens', school: "UI", status: 'Re-Taker', course_offering: "", payments: "0", semester: "", year: "", add_payments: "0" },
  ];

  const course_offering = [
    { key: '1', name: 'Information Technology' },
    { key: '2', name: 'Business Administration' },
    { key: '3', name: 'Marine Engineering' },
  ];

  const sortedStudentData = student_data.slice().sort((a, b) => a.name.localeCompare(b.name));

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [saveButtonVisible, setSaveButtonVisible] = useState(false);

  const handleSelectChange = (value) => {
    const student = student_data.find(student => student.name === value);
    setSelectedStudent(student);
    setSaveButtonVisible(student); // Show the save button if a student is selected
  };

  const onFinish = useCallback(async (values) => {
    console.log("Received values of form: ", values);
    // Add Axios logic here to save the payment data
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px", paddingRight: screenWidth <= 1024 ? 0 : "45%" }}>
          <Form
            name="payments"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <div>
              <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>Add Payments</h1>
              <span>Student Name:</span>
              <Form.Item name="student_name">
                <Select
                  style={{ width: "100%", marginBottom: initialMarginBottom }}
                  size="large"
                  placeholder="Select Student"
                  onChange={handleSelectChange}
                  showSearch={true}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {sortedStudentData.map(student => (
                    <Option key={student.key} value={student.name}>{student.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Render fields based on selected student */}
              {selectedStudent && selectedStudent.course_offering && (
                <>
                  <span>Course Offering:</span>
                  <Form.Item name="course_offering" rules={[{ required: true, message: "Please input your Course Offering" }]}>
                    <Select style={{ width: "100%", marginBottom: initialMarginBottom }} size="large" placeholder="Course Offering">
                      {course_offering.map(course => (
                        <Option key={course.key} value={course.name}>{course.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <span>Semester:</span>
                  <Form.Item name="semester" rules={[{ required: true, message: "Please select a Semester" }]}>
                    <Select style={{ width: "100%", marginBottom: initialMarginBottom }} size="large" placeholder="Semester">
                      <Option value="1st">1st</Option>
                      <Option value="2nd">2nd</Option>
                    </Select>
                  </Form.Item>
                  <span>Year:</span>
                  <Form.Item name="year" rules={[{ required: true, message: "Please input the Year" }]}>
                    <Select style={{ width: "100%", marginBottom: initialMarginBottom }} size="large" placeholder="Year">
                      <Option value="2023">2023</Option>
                      <Option value="2024">2024</Option>
                      <Option value="2025">2025</Option>
                      <Option value="2026">2026</Option>
                      <Option value="2027">2027</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="payments" rules={[{ required: true, message: "Please input the Payment" }]}>
                    <CustomInput type="text" name="add_payment" placeholder="Payment" style={{ marginBottom: initialMarginBottom }} />
                  </Form.Item>
                  <Form.Item name="add_payment" rules={[{ required: true, message: "Please input the Payment" }]}>
                    <CustomInput type="text" name="add_payment" placeholder="Additional Payment" style={{ marginBottom: initialMarginBottom }} />
                  </Form.Item>
                </>
              )}

              {/* Save button */}
              {saveButtonVisible && (
                <div style={{ textAlign: "right", marginBottom: "20px" }}>
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
      </Layout>
    </Layout>
  );
};

export default AddNewPayment;
