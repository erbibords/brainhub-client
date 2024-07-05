import React, { useCallback, useEffect, useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import { Row, Col, Card, Divider, Skeleton, Form, Table } from "antd";
import useProfile from "../../hooks/useStudentProfile";
import { useParams, useNavigate } from "react-router-dom";
import useMutation from "../../hooks/useMutation";
import { DEFAULT_BRANCH_ID } from "../../constants";
import Swal from "sweetalert2";
import { ArrowLeftOutlined } from "@ant-design/icons";

const StudentProfile = () => {
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

  const historyData = [
    {
      key: "1",
      reference: "hs2024-1",
      paymentAmount: "1500",
      paymentMethod: "Bank",
      paymentDate: "2024-06-30",
      attachment: "",
      courseOffering: "offering 1",
    },
  ];
  const columns = [
    { title: "Reference", dataIndex: "reference", key: "reference" },
    {
      title: "Payment Amount",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    { title: "Payment Date", dataIndex: "paymentDate", key: "paymentDate" },
    { title: "Attachment", dataIndex: "attachment", key: "attachment" },
    {
      title: "Course Offering",
      dataIndex: "courseOffering",
      key: "courseOffering",
    },
    { title: "Processed by", dataIndex: "processedBy", key: "processedBy" },
  ];

  return (
    <div>
      <CustomButton
        type="text"
        onClick={() => navigate("/students")}
        icon={<ArrowLeftOutlined />}
        className="mb-6"
      />

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
                  <h1 className="text-2xl mb-[2vh]">
                    {data.firstName} {data.middleName} {data.lastName}
                  </h1>
                </Col>
                <Col xs={24} sm={24} md={8} lg={6}>
                  <div className="text-right mb-5">
                    {isEditing ? (
                      <div className="flex justify-end">
                        <CustomButton
                          size="large"
                          className="mr-[10px]"
                          loading={updateStudentLoading}
                          disabled={updateStudentLoading}
                          onClick={handleCancel}
                        >
                          Cancel
                        </CustomButton>

                        <CustomButton
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
                        </CustomButton>
                      </div>
                    ) : (
                      <CustomButton
                        type="primary"
                        size="large"
                        className="w-auto bg-primary text-white"
                        disabled={(!data && isLoading) || !tempData}
                        onClick={() => {
                          handleEdit();
                        }}
                      >
                        Edit
                      </CustomButton>
                    )}
                  </div>
                </Col>
              </Row>
              <Divider />
              <Form name="update_student" layout="vertical" className="w-1/2">
                {isEditing && (
                  <>
                    <strong>First name:</strong>{" "}
                    <Form.Item
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your First Name",
                        },
                      ]}
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
                      rules={[
                        {
                          required: true,
                          message: "Please input your Middle Name",
                        },
                      ]}
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
                    <Form.Item
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your Last Name",
                        },
                      ]}
                    >
                      <CustomInput
                        name="lastName"
                        value={tempData.lastName}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                    <Divider />
                  </>
                )}
                <p>
                  <strong>School:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="school"
                      rules={[
                        { required: true, message: "Please select School" },
                      ]}
                    >
                      <CustomInput
                        name="school"
                        value={tempData.school.name}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  ) : (
                    data.school.name
                  )}
                </p>
                <Divider />
                <p>
                  <strong>Address:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Please inpu your Address",
                        },
                      ]}
                    >
                      <CustomInput
                        name="address"
                        value={tempData.address}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  ) : (
                    data.address
                  )}
                </p>
                <Divider />
                <p>
                  <strong>Contact No.:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="contactNumber"
                      rules={[
                        {
                          required: true,
                          message: "Please input Contact Number",
                        },
                      ]}
                    >
                      <CustomInput
                        name="contactNumber"
                        value={tempData.contactNumber}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  ) : (
                    data.contactNumber
                  )}
                </p>
                <Divider />
                <div className="mt-[15px] mb-[20px]">
                  <small>
                    <i className="mb-[2vh]">
                      Person to be notified in case of emergency:
                    </i>
                  </small>
                </div>
                <p>
                  <strong>Contact Name:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="emergencyContactName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your emergency contact name!",
                        },
                      ]}
                    >
                      <CustomInput
                        name="emergencyContactName"
                        value={tempData.emergencyContact.name}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  ) : (
                    data.emergencyContact.name
                  )}
                </p>
                <Divider />
                <p>
                  <strong>Relationship:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="emergencyContactRelationShip"
                      rules={[
                        {
                          required: true,
                          message:
                            "Please input your relation on your emergency contact!",
                        },
                      ]}
                    >
                      <CustomInput
                        name="emergencyContactRelationShip"
                        value={tempData.emergencyContact.relationship}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  ) : (
                    data.emergencyContact.relationship
                  )}
                </p>
                <Divider />
                <p>
                  <strong>Emergency Address:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="emergencyContactAddress"
                      rules={[
                        {
                          required: true,
                          message:
                            "Please input your emergency contact address!",
                        },
                      ]}
                    >
                      <CustomInput
                        name="emergencyContactAddress"
                        value={tempData.emergencyContact.address}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  ) : (
                    data.emergencyContact.address
                  )}
                </p>
                <Divider />
                <p>
                  <strong>Emergency Contact No.:</strong>{" "}
                  {isEditing ? (
                    <Form.Item
                      name="emergencyContactContactNumber"
                      rules={[
                        {
                          required: true,
                          message: "Please input your emergency contact no!",
                        },
                      ]}
                    >
                      <CustomInput
                        name="emergencyContactContactNumber"
                        value={tempData.emergencyContact.contactNumber}
                        onChange={handleInputChange}
                      />
                    </Form.Item>
                  ) : (
                    data.emergencyContact.contactNumber
                  )}
                </p>
              </Form>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Table
                    dataSource={historyData}
                    columns={columns}
                    title={() => <h2 className="text-2xl">Payments History</h2>}
                  />
                </Col>
              </Row>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default StudentProfile;
