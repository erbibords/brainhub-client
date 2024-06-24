import React, { useCallback, useEffect, useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
import { Select, Table, Space, Row, Col, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "../../contexts/students";
import useSchools from "../../hooks/useSchools";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import CustomButton from "../../components/Button/Button";
const { Option } = Select;

const StudentsList = () => {
  const navigate = useNavigate();
  const { data: schools, loading: schoolsLoading } = useSchools();
  const [searchParams, setSearchParams] = useState({
    studentName: undefined,
    school: undefined,
  });
  const [searchName, setSearchName] = useState("");
  const [searchSchool, setSearchSchool] = useState("");
  const { students, studentDataLoading, getStudentError, setParams } =
    useStudentContext();

  const handleFilter = useCallback(() => {
    setParams(searchParams);
  }, [setParams, searchParams]);

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
          <CustomButton>Add Payment</CustomButton>
          <CustomButton
            onClick={() => {
              handleViewStudent(record.id);
            }}
          >
            View
          </CustomButton>
        </Space>
      ),
    },
  ];

  const handleViewStudent = (studentId) => {
    navigate(`/students/${studentId}`);
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

  console.log(searchName, searchSchool);

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Students List</h1>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <p>Student Name: </p>
          <CustomInput
            onChange={(e) =>
              setSearchParams({
                ...searchParams,
                studentName: e.target.value,
              })
            }
          />
        </Col>
        <Col span={6}>
          <p>School: </p>
          <Select
            loading={schoolsLoading}
            disabled={schoolsLoading}
            size="large"
            onChange={(value) =>
              setSearchParams({
                ...searchParams,
                school: value,
              })
            }
            className="custom-select"
          >
            {schools &&
              schools?.data?.map((school) => (
                <Option value={school.id} key={school.id}>
                  {school.name}
                </Option>
              ))}
          </Select>
        </Col>
        <Col span={4} className="flex items-end mb-1">
          <Button
            className="w-auto bg-primary text-white mr-2"
            size="large"
            onClick={handleFilter}
          >
            Filter
          </Button>
          <Button
            className="w-auto text-primary"
            size="large"
            onClick={() => {
              setParams({
                studentName: undefined,
                school: undefined,
                pageNo: 1,
                pageSize: 25,
              });
            }}
          >
            Clear
          </Button>
        </Col>

        <Col span={24}>
          {getStudentError ? (
            <GenericErrorDisplay className="!mt-5" />
          ) : (
            <Table dataSource={filteredData} columns={columns} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default StudentsList;
