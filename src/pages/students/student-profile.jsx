import React, { useCallback, useEffect, useState } from "react";
import CustomInput from "../../components/Input/Input";
import { Layout, Button, Row, Col, Card, Divider, Skeleton } from "antd";
import useProfile from "../../hooks/useStudentProfile";
import { useParams, useNavigate } from "react-router-dom";
import useMutation from "../../hooks/useMutation";
import { DEFAULT_BRANCH_ID } from "../../constants";
import Swal from "sweetalert2";
const { Content } = Layout;

const StudentProfile = () => {
  const initialMarginBottom = "2vh";
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  if (!params?.studentId) {
    navigate("/students");
  }
  const { data, error, isLoading } = useProfile(params?.studentId);

  if (error) {
    navigate("/students");
  }

  const [tempData, setTempData] = useState();

  const {
    mutate: updateStudentProfile,
    loading: updateStudentLoading,
    error: updateStudentError,
  } = useMutation(
    `branches/${DEFAULT_BRANCH_ID}/students/${params?.studentId}`,
    "PUT"
  );

  useEffect(() => {
    if (data && !isLoading && !error) {
      setTempData(data);
    }
  }, [setTempData, data, isLoading, error]);

  const handleEdit = useCallback(() => {
    if (!tempData) return;
    setIsEditing(true);
  }, [tempData]);

  const handleCancel = () => {
    setTempData(data);
    setIsEditing(false);
  };

  const handleSave = useCallback(async () => {
    const updatedData = {
      firstName: tempData?.firstName,
      middleName: tempData?.middleName,
      lastName: tempData?.lastName,
      schoolId: "3e2374a3-47d5-4908-af02-057742d68208",
      address: tempData?.address,
      contactNumber: tempData?.contactNumber,
      email: "test1@test.com",
      age: 0,
      emergencyContact: {
        name: tempData?.emergencyContact?.name,
        address: tempData?.emergencyContact?.address,
        relationship: tempData?.emergencyContact?.relationship,
        contactNumber: tempData?.emergencyContact?.contactNumber,
      },
    };

    try {
      const res = await updateStudentProfile(updatedData);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Student information updated!",
          timer: 2000,
        });
        setIsEditing(false);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Student Information Update Error",
        text: "There might be some error in your entries. Please double check and try again!",
      });
    }
  }, [updateStudentProfile, tempData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "school") {
      setTempData({
        ...tempData,
        school: {
          ...tempData.school,
          name: value,
        },
      });
    } else if (name === "emergencyContactName") {
      setTempData({
        ...tempData,
        emergencyContact: {
          ...tempData.emergencyContact,
          name: value,
        },
      });
    } else if (name === "emergencyContactRelationShip") {
      setTempData({
        ...tempData,
        emergencyContact: {
          ...tempData.emergencyContact,
          relationship: value,
        },
      });
    } else if (name === "emergencyContactAddress") {
      setTempData({
        ...tempData,
        emergencyContact: {
          ...tempData.emergencyContact,
          address: value,
        },
      });
    } else if (name === "emergencyContactContactNumber") {
      setTempData({
        ...tempData,
        emergencyContact: {
          ...tempData.emergencyContact,
          contactNumber: value,
        },
      });
    } else {
      setTempData({ ...tempData, [name]: value });
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px" }}>
          <div>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={36} lg={36}>
                {isLoading ? (
                  <Card>
                    <Skeleton />
                  </Card>
                ) : (
                  <Card>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={24} md={16} lg={18}>
                        <h1
                          style={{
                            fontSize: "2em",
                            marginBottom: initialMarginBottom,
                          }}
                        >
                          {data.firstName} {data.middleName} {data.lastName}
                        </h1>
                      </Col>
                      <Col xs={24} sm={24} md={8} lg={6}>
                        <div
                          style={{ textAlign: "right", marginBottom: "20px" }}
                        >
                          {isEditing ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                size="large"
                                style={{ marginRight: "10px" }}
                                className="mr-[10px]"
                                loading={updateStudentLoading}
                                disabled={updateStudentLoading}
                                onClick={handleCancel}
                              >
                                Cancel
                              </Button>

                              <Button
                                size="large"
                                type="primary"
                                className="w-auto bg-primary text-white"
                                loading={updateStudentLoading}
                                disabled={updateStudentLoading}
                                onClick={() => {
                                  handleSave();
                                }}
                              >
                                Save
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="primary"
                              size="large"
                              className="w-auto bg-primary text-white"
                              disabled={(!data && isLoading) || !tempData}
                              onClick={() => {
                                handleEdit();
                              }}
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Divider />
                    <Form
                        name="update_student"
                        
                        layout="vertical"
                        className="w-1/2"
                      >
                    {isEditing && (
                      <>
                        <strong>First name:</strong>{" "}
                        <Form.Item
                         
                          name="firstName"
                          rules={[{ required: true, message: "Please input your First Name" }]}
                        >
                          <CustomInput
                            name="firstName"
                            value={tempData.firstName}
                            onChange={handleInputChange}
                          />
                        </Form.Item>
                       
                        <Divider />
                      </>
                    )}

                    {isEditing && (
                      <>
                        <strong>Middle name:</strong>{" "}
                        <Form.Item
                         
                         name="middleName"
                         rules={[{ required: true, message: "Please input your Middle Name" }]}
                       >
                         <CustomInput
                           name="middleName"
                           value={tempData.middleName}
                           onChange={handleInputChange}
                         />
                       </Form.Item>
                       
                        <Divider />
                      </>
                    )}

                    {isEditing && (
                      <>
                        <strong>Last name:</strong>{" "}
                        <CustomInput
                          name="lastName"
                          value={tempData.lastName}
                          onChange={handleInputChange}
                        />
                        <Divider />
                      </>
                    )}
                    <p>
                      <strong>School:</strong>{" "}
                      {isEditing ? (
                        <CustomInput
                          name="school"
                          value={tempData.school.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        data.school.name
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
                        data.address
                      )}
                    </p>
                    <Divider />
                    <p>
                      <strong>Contact No.:</strong>{" "}
                      {isEditing ? (
                        <CustomInput
                          name="contactNumber"
                          value={tempData.contactNumber}
                          onChange={handleInputChange}
                        />
                      ) : (
                        data.contactNumber
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
                          name="emergencyContactName"
                          value={tempData.emergencyContact.name}
                          onChange={handleInputChange}
                        />
                      ) : (
                        data.emergencyContact.name
                      )}
                    </p>
                    <Divider />
                    <p>
                      <strong>Relationship:</strong>{" "}
                      {isEditing ? (
                        <CustomInput
                          name="emergencyContactRelationShip"
                          value={tempData.emergencyContact.relationship}
                          onChange={handleInputChange}
                        />
                      ) : (
                        data.emergencyContact.relationship
                      )}
                    </p>
                    <Divider />
                    <p>
                      <strong>Emergency Address:</strong>{" "}
                      {isEditing ? (
                        <CustomInput
                          name="emergencyContactAddress"
                          value={tempData.emergencyContact.address}
                          onChange={handleInputChange}
                        />
                      ) : (
                        data.emergencyContact.address
                      )}
                    </p>
                    <Divider />
                    <p>
                      <strong>Emergency Contact No.:</strong>{" "}
                      {isEditing ? (
                        <CustomInput
                          name="emergencyContactContactNumber"
                          value={tempData.emergencyContact.contactNumber}
                          onChange={handleInputChange}
                        />
                      ) : (
                        data.emergencyContact.contactNumber
                      )}
                    </p>
                    </Form>
                  </Card>
                )}
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentProfile;
