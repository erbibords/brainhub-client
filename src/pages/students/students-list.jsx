// src/pages/StudentsList/StudentsList.jsx
import React, { useState } from "react";
import { Layout, Input, Table, Space, Row, Col, Button } from "antd";
import CustomInput from "../../components/Input/Input";
 
const { Search } = Input;

const StudentsList = () => {
 
  const [searchName, setSearchName] = useState("");
  const [searchSchool, setSearchSchool] = useState("");

  const data = [
    { key: "1", firstName: 'Louie', middleName: 'Emms', lastName: 'Emms', schoolId: "WVSU", takerType: "1st Taker", contactNumber: "09323232222", address: "North Molo" },
    { key: "2", firstName: 'Johny', middleName: 'S', lastName: 'Seens', schoolId: "UI", takerType: "Re-Taker", contactNumber: "09332133212", address: "South Lapaz" },
  ];

  const columns = [
    // { title: "Name", dataIndex: "name", key: "name" },
    { 
      title: 'Name', 
      dataIndex: ['firstName', 'middleName', 'lastName'],
      render: (text, record) => (
        <span>{record.firstName} {record.middleName} {record.lastName}</span>
      ) 
    },
    { title: "School", dataIndex: "schoolId", key: "schoolId" },
    { title: "Student Status", dataIndex: "takerType", key: "takerType" },
    { title: "Contact No.", dataIndex: "contactNumber", key: "contactNumber" },
    { title: "Address.", dataIndex: "address", key: "address" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleEditStudentProfile(record.key)}
            title="Edit Student Profile"
            className="w-auto bg-success text-white"
          >
            Edit
          </Button>

          <Button
            type="primary"
            onClick={() => handleViewStudentProfile(record.key)}
            title="View Profile"
            className="w-auto bg-primary text-white"
          >
            View Profile
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewStudentProfile = (studentId) => {
    window.location.href = `/students/profile/${studentId}`;
  };

  const handleEditStudentProfile = (studentId) => {
    // window.location.href = `/students/profile/${studentId}`;
    console.log($studentId);
  };

 
 

 

  return (
     
      <div>
        <h1 className="text-2xl mb-[2vh]">Students List</h1>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <CustomInput type="text" placeholder="Search by name..."/>
          </Col>
          <Col span={6}>
            <CustomInput type="text" placeholder="Search by school..."/>
          </Col>
          <Col span={6} className="pt-2">
          <Button
            type="primary"
            onClick={() => handleSearch()}
            title="Search"
            className="w-auto bg-primary text-white"
          >
            Search
          </Button>
          </Col>
          <Col span={24}>
            <Table dataSource={data} columns={columns} />
          </Col>
        </Row>
      </div>
  
  );
};

export default StudentsList;
