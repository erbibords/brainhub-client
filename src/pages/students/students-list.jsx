import React, { useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
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
          <Button
            className="bg-primary text-white"
            onClick={() => {
              handleViewStudent(record.id);
            }}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewStudent = (studentId) => {
    navigate(`/students/${studentId}`);
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
  );
};

export default StudentsList;
