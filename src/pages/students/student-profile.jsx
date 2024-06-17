import React, { useState } from "react";
import CustomInput from "../../components/Input/Input";
import { Layout, Input, Button, Row, Col, Card, Divider, Select } from "antd";

const { Content } = Layout;
const { Option } = Select;

const StudentProfile = () => {
  const initialMarginBottom = "2vh";
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
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
  });
  const [tempData, setTempData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px" }}>
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={36} lg={36}>
                <Card>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={16} lg={18}>
                      <h1
                        style={{
                          fontSize: "2em",
                          marginBottom: initialMarginBottom,
                        }}
                      >
                        {profileData.first_name} {profileData.middle_name}{" "}
                        {profileData.last_name}
                      </h1>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={6}>
                      <div style={{ textAlign: "right", marginBottom: "20px" }}>
                        {isEditing ? (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              style={{ marginRight: "10px" }}
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>

                            <Button
                              type="primary"
                              className="w-auto bg-primary text-white"
                              onClick={handleSave}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="primary"
                            className="w-auto bg-primary text-white"
                            onClick={handleEdit}
                          >
                            Update
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Divider />
                  <p>
                    <strong>First Name:</strong>{" "}
                    {isEditing ? (
                      <CustomInput
                        name="first_name"
                        value={tempData.first_name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      profileData.first_name
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Middle Name:</strong>{" "}
                    {isEditing ? (
                      <CustomInput
                        name="middle_name"
                        value={tempData.middle_name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      profileData.middle_name
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Last Name:</strong>{" "}
                    {isEditing ? (
                      <CustomInput
                        name="last_name"
                        value={tempData.last_name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      profileData.last_name
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>School:</strong>{" "}
                    {isEditing ? (
                      <CustomInput
                        name="school"
                        value={tempData.school}
                        onChange={handleInputChange}
                      />
                    ) : (
                      profileData.school
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Address:</strong>{" "}
                    {isEditing ? (
                      <CustomInput
                        name="address"
                        value={tempData.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      profileData.address
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Contact No.:</strong>{" "}
                    {isEditing ? (
                      <CustomInput
                        name="phone"
                        value={tempData.phone}
                        onChange={handleInputChange}
                      />
                    ) : (
                      profileData.phone
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Status:</strong>{" "}
                    {isEditing ? (
                      <Select
                        style={{
                          width: "100%",
                          marginBottom: initialMarginBottom,
                        }}
                        size="large"
                        defaultValue={tempData.student_status}
                        onChange={handleInputChange}
                        required
                      >
                        <Option value="1st Taker">1st Taker</Option>
                        <Option value="Re-Taker">Re-Taker</Option>
                        <Option value="Summer">Summer</Option>
                      </Select>
                    ) : (
                      profileData.student_status
                    )}
                  </p>
                  <Divider />
                  <div style={{ marginTop: "15px", marginBottom: "20px" }}>
                    <small>
                      <i style={{ marginBottom: initialMarginBottom }}>
                        Person to be notified in case of emergency:
                      </i>
                    </small>
                  </div>
                  <p>
                    <strong>Contact Name:</strong>{" "}
                    {isEditing ? (
                      <CustomInput
                        name="emergency_contact"
                        value={tempData.emergency_contact}
                        onChange={handleInputChange}
                      />
                    ) : (
                      profileData.emergency_contact
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Relationship:</strong>{" "}
                    {isEditing ? (
                      <CustomInput
                        name="relationship"
                        value={tempData.relationship}
                        onChange={handleInputChange}
                      />
                    ) : (
                      profileData.relationship
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Emergency Address:</strong>{" "}
                    {isEditing ? (
                      <CustomInput
                        name="emergency_address"
                        value={tempData.emergency_address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      profileData.emergency_address
                    )}
                  </p>
                  <Divider />
                  <p>
                    <strong>Emergency Contact No.:</strong>{" "}
                    {isEditing ? (
                      <CustomInput
                        name="emergency_contact_no"
                        value={tempData.emergency_contact_no}
                        onChange={handleInputChange}
                      />
                    ) : (
                      profileData.emergency_contact_no
                    )}
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentProfile;
