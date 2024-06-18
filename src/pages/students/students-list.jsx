import React, { useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
<<<<<<< HEAD
import { Layout, Input, Table, Space, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "../../contexts/students";

const StudentsList = () => {
  const initialMarginBottom = "2vh";
  const navigate = useNavigate();
=======
import { Select, Table, Space, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "../../contexts/students";
import useSchools from "../../hooks/useSchools";
const { Option } = Select;
const StudentsList = () => {
  const initialMarginBottom = "2vh";
  const navigate = useNavigate();
  const {
    data: schools,
    loading: schoolsLoading,
    error: schoolsError,
  } = useSchools();
>>>>>>> master

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
<<<<<<< HEAD
          <Button className="bg-green-600 text-white">Edit</Button>
=======
>>>>>>> master
          <Button
            className="bg-primary text-white"
            onClick={() => {
              handleViewStudent(record.id);
            }}
          >
<<<<<<< HEAD
            View Profile
=======
            View
>>>>>>> master
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewStudent = (studentId) => {
<<<<<<< HEAD
    navigate(`/students/profile/${studentId}`);
=======
    navigate(`/students/${studentId}`);
>>>>>>> master
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

  return (
<<<<<<< HEAD
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
      
=======
    <div>
      <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>
        Students List
      </h1>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <p>Student Name: </p>
          <CustomInput onChange={(e) => searchBySchool(e.target.value)} />
        </Col>
        <Col span={6}>
          <p>School: </p>
          <Select
            loading={schoolsLoading}
            disabled={schoolsLoading}
            size="large"
            placeholder="Select School"
            onChange={(value) => setSelectedCourseId(value)}
            className="custom-select"
          >
            {schools &&
              schools?.map((school) => (
                <Option value={school.id}> {school.name} </Option>
              ))}
          </Select>
        </Col>
        <Col span={3} className="flex items-end mb-1">
          <Button className="w-auto bg-primary text-white" size="large">
            Search
          </Button>
        </Col>
        <Col span={24}>
          <Table dataSource={filteredData} columns={columns} />
        </Col>
      </Row>
    </div>
>>>>>>> master
  );
};

export default StudentsList;
