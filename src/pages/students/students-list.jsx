import React, { useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
import { Layout, Input, Table, Space, Row, Col, Button } from "antd";
import { useStudentContext } from "../../contexts/students";

const StudentsList = () => {
  const initialMarginBottom = "2vh";

  const [searchName, setSearchName] = useState("");
  const [searchSchool, setSearchSchool] = useState("");
  const { students, studentDataLoading, getStudentError } = useStudentContext();

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "School", dataIndex: "school", key: "school" },
    { title: "Student Status", dataIndex: "status", key: "status" },
    { title: "Contact No.", dataIndex: "contactNumber", key: "contact" },
    { title: "Address.", dataIndex: "address", key: "address" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="small">
          <Button className="bg-green-600 text-white">Edit</Button>
          <Button className="bg-primary text-white">View Profile</Button>
        </Space>
      ),
    },
  ];

  const handleViewStudent = (studentId) => {
    window.location.href = `/students/profile/${studentId}`;
  };

  const searchByName = (value) => {
    setSearchName(value);
  };

  const searchBySchool = (value) => {
    setSearchSchool(value);
  };

  const filteredData = useMemo(() => {
    if (studentDataLoading || getStudentError) return;
    return students.data.map((student) => {
      return {
        ...student,
        name: `${student.firstName} ${student.middleName} ${student.lastName}`,
        school: student.school.name,
      };
    });
  }, [students, studentDataLoading, getStudentError]);

  console.log(filteredData);

  return (

          <div>
            <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>
              Students List
            </h1>
            <Row gutter={[16, 16]}>
              <Col span={4}>
                <CustomInput
                    placeholder="Search by name..."
                    onChange={(e) => searchBySchool(e.target.value)}
                    className="mb-4" 
                  />
              </Col>
              <Col span={4}>
                <CustomInput
                    placeholder="Search by school..."
                    onChange={(e) => searchBySchool(e.target.value)}
                    className="mb-4" 
                  />
              </Col>
              <Col span={3}>
                <Button className="w-auto bg-primary text-white mt-[2px]">
                  Search
                </Button>
              </Col>
              <Col span={24}>
                <Table dataSource={filteredData} columns={columns} />
              </Col>
            </Row>
          </div>
      
  );
};

export default StudentsList;