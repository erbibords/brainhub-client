import React, { useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import CustomInput from "../../components/Input/Input";
import { Layout, Input, Button, Space, Row, Col, Card, Avatar, Divider, Modal, Form, Select} from "antd";
 

const { Content } = Layout;
const { Option } = Select;
const { Search } = Input;
const { TextArea } = Input;

const StudentProfile = () => {
  const initialMarginBottom = "2vh";
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [formData, setFormData] = useState({}); // State to store form data

  // Function to show modal
  const showModal = () => {
    setIsModalVisible(true);
   
    setFormData(profileData);
  };

  // Function to handle form submission
  const updateButton = () => {
    setIsModalVisible(false);
    
  };

  
  const handleCancel = () => {
    setIsModalVisible(false);
  };
 
  const profileData = {
    first_name: "Johnny",
    middle_name: "Lee",
    last_name: "Seens",
    school: "UI",
    address: "South Lapaz",
    phone: "123-456-7890",
    student_status: "Re-Taker",
    emergency_contact: "Mia Khulafu",
    relationship: "Sister",
    emergency_address: "South Lapaz",
    emergency_contact_no: "099323221322",
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px" }}>
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={36} lg={36}>
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={16} lg={18}>
                      <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>
                        {profileData.first_name} {profileData.middle_name} {profileData.last_name}
                      </h1>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={6}>
                      <div style={{ textAlign: "right", marginBottom: "20px" }}>
                        <Button type="primary" onClick={showModal}>Update</Button>
                      </div>
                    </Col>
                  </Row>
                  <Divider />
                  <p><strong>School:</strong> {profileData.school}</p>
                  <Divider />
                  <p><strong>Address:</strong> {profileData.address}</p>
                  <Divider />
                  <p><strong>Contact No.:</strong> {profileData.phone}</p>
                  <Divider />
                  <p><strong>Status:</strong> {profileData.student_status}</p>
                  <Divider />
                  <div style={{ marginTop: "15px", marginBottom: "20px" }}>
                    <small><i style={{ marginBottom: initialMarginBottom }}>Person to be notified in case of emergency:</i></small>
                  </div>
                  <p><strong>Contact Name:</strong> {profileData.emergency_contact}</p>
                  <Divider />
                  <p><strong>Relationship:</strong> {profileData.relationship}</p>
                  <Divider />
                  <p><strong>Emergency Address:</strong> {profileData.emergency_address}</p>
                  <Divider />
                  <p><strong>Emergency Contact No.:</strong> {profileData.emergency_contact_no}</p>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
      <Modal
        title=""
        visible={isModalVisible}
        onOk={updateButton}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={updateButton}>
            Submit
          </Button>,
        ]}
        width={700} 
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          layout="vertical"
          initialValues={formData} 
          onFinish={updateButton}  
        >
     
          <Form.Item label="First Name" name="first_name">
            <CustomInput />
          </Form.Item>
          <Form.Item label="Middle Name" name="middle_name">
            <CustomInput />
          </Form.Item>
          <Form.Item label="Last Name" name="last_name">
            <CustomInput />
          </Form.Item>
          <Form.Item label="School" name="school">
            <CustomInput />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <TextArea />
          </Form.Item>
          <Form.Item label="Contact No." name="phone">
            <CustomInput />
          </Form.Item>
          <Form.Item label="Status" name="student_status">
          <Select
            style={{ width: "100%", marginBottom: initialMarginBottom }}
            size="large"
            defaultValue={profileData.status}
            onChange={(value) => setFormData((prevState) => ({ ...prevState, [key]: value }))}
            required
          >
            <Option value="1st Taker">1st Taker</Option>
            <Option value="Re-Taker">Re-Taker</Option>
            <Option value="Summer">Summer</Option>
          </Select>
          </Form.Item>
          <Divider />
          <div style={{ marginTop: "15px", marginBottom: "20px" }}>
            <small><i style={{ marginBottom: initialMarginBottom }}>Person to be notified in case of emergency:</i></small>
          </div>
          <Form.Item label="Contact Name" name="emergency_contact">
            <CustomInput />
          </Form.Item>
          <Form.Item label="Relationship" name="relationship">
            <CustomInput />
          </Form.Item>
          <Form.Item label="Emergency Address" name="emergency_address">
            <TextArea />
          </Form.Item>
          <Form.Item label="Emergency Contact No." name="emergency_contact_no">
            <CustomInput />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default StudentProfile;
