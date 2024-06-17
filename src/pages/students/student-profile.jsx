import React, { useState } from "react";
import axios from "axios"; 
import CustomInput from "../../components/Input/Input";
import { Layout, Input, Button, Row, Col, Card, Divider, Select, Form } from "antd";
 
const { Option } = Select;

const StudentProfile = () => {
  const initialMarginBottom = "2vh";
  const [isEditing, setIsEditing] = useState(false);  
  const [profileData, setProfileData] = useState({
    firstName: "Johnny",
    middleName: "Lee",
    lastName: "Seens",
    schoolId: "UI",
    address: "South Lapaz",
    contactNumber: "123-456-7890",
    takerType: "Re-Taker",
    emergencyContactName: "Mia Khulafu",
    relationship: "Sister",
    emergencyAddress: "South Lapaz",
    emergencyContactNo: "099323221322",
  }); 
  const [tempData, setTempData] = useState(profileData);  

  // Function to handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Function to handle save button click
  const handleSave = () => {
    console.log(tempData);
     
  };

  // Function to handle cancel button click
  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  return (
    
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={36} lg={36}>
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={16} lg={18}>
                      <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>
                        {profileData.firstName} {profileData.middleName} {profileData.lastName}
                      </h1>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={6}>
                        <div style={{ textAlign: "right", marginBottom: "20px" }}>
                          {isEditing ? (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Button style={{ marginRight: "10px" }} onClick={handleCancel}>
                                Cancel
                              </Button>

                              <Button type="primary" className="w-auto bg-primary text-white" onClick={handleSave}>
                                Save
                              </Button>
                            </div>
                          ) : (
                            <Button type="primary" className="w-auto bg-primary text-white" onClick={handleEdit}>
                              Update
                            </Button>
                          )}
                        </div>
                      </Col>
                  </Row>
                  <Divider />
                  <Form
                    name="updateStudentProfile"
                    layout="vertical"
                  >
                    <p><strong>First Name:</strong> {isEditing ? (
                      <Form.Item name="firstName">
                        <CustomInput name="firstName" value={tempData.firstName} />
                      </Form.Item>
                    ) : (
                      profileData.firstName
                    )}</p>
                    <Divider />
                    <p><strong>Middle Name:</strong> {isEditing ? (
                      <Form.Item name="middleName">
                        <CustomInput name="middleName" value={tempData.middleName} />
                      </Form.Item>
                    ) : (
                      profileData.middleName
                    )}</p>
                    <Divider />
                    <p><strong>Last Name:</strong> {isEditing ? (
                      <Form.Item name="lastName">
                        <CustomInput name="lastName" value={tempData.lastName} />
                      </Form.Item>
                    ) : (
                      profileData.lastName
                    )}</p>
                    <Divider />
                    <p><strong>School:</strong> {isEditing ? (
                      <Form.Item name="schoolId">
                        <CustomInput name="schoolId" value={tempData.schoolId} />
                      </Form.Item>
                    ) : (
                      profileData.schoolId
                    )}</p>
                    <Divider />
                    <p><strong>Address:</strong> {isEditing ? (
                      <Form.Item name="address">
                        <CustomInput name="address" value={tempData.address} />
                      </Form.Item>
                    ) : (
                      profileData.address
                    )}</p>
                    <Divider />
                    <p><strong>Contact No.:</strong> {isEditing ? (
                      <Form.Item name="contactNumber">
                        <CustomInput name="contactNumber" value={tempData.contactNumber} />
                      </Form.Item>
                    ) : (
                      profileData.contactNumber
                    )}</p>
                    <Divider />
                    <p><strong>Status:</strong> {isEditing ? (
                      <Form.Item name="takerType">
                        <Select
                          style={{ width: "100%", marginBottom: initialMarginBottom }}
                          size="large"
                          defaultValue={tempData.takerType}
                        
                          required
                        >
                          <Option value="1st Taker">1st Taker</Option>
                          <Option value="Re-Taker">Re-Taker</Option>
                          <Option value="Summer">Summer</Option>
                        </Select>
                      </Form.Item>
                    ) : (
                      profileData.takerType
                    )}</p>
                    <Divider />
                    <div style={{ marginTop: "15px", marginBottom: "20px" }}>
                      <small><i style={{ marginBottom: initialMarginBottom }}>Person to be notified in case of emergency:</i></small>
                    </div>
                    <p><strong>Contact Name:</strong> {isEditing ? (
                      <Form.Item name="name">
                        <CustomInput name="emergencyContactName" value={tempData.emergencyContactName} />
                      </Form.Item>
                    ) : (
                      profileData.emergencyContactName
                    )}</p>
                    <Divider />
                    <p><strong>Relationship:</strong> {isEditing ? (
                      <Form.Item name="relationship">
                        <CustomInput name="relationship" value={tempData.relationship} />
                      </Form.Item>
                    ) : (
                      profileData.relationship
                    )}</p>
                    <Divider />
                    <p><strong>Emergency Address:</strong> {isEditing ? (
                      <Form.Item name="emergencyAddress">
                        <CustomInput name="emergencyAddress" value={tempData.emergencyAddress} />
                      </Form.Item>
                    ) : (
                      profileData.emergencyAddress
                    )}</p>
                    <Divider />
                    <p><strong>Emergency Contact No.:</strong> {isEditing ? (
                      <Form.Item name="emergencyContactNo">
                        <CustomInput name="emergencyContactNo" value={tempData.emergencyContactNo} />
                      </Form.Item>
                    ) : (
                      profileData.emergencyContactNo
                    )}</p>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
       
  );
};

export default StudentProfile;
