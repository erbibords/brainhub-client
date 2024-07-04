import React, { useCallback, useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
import { Select, Table, Space, Row, Col, Button, Form } from "antd";
import { useNavigate } from "react-router-dom";
import { useStudentContext } from "../../contexts/students";
import useSchools from "../../hooks/useSchools";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import CustomButton from "../../components/Button/Button";
import { cleanParams } from "../../utils/formatting";
const { Option } = Select;

const StudentsList = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: schools, loading: schoolsLoading } = useSchools();
  const [searchParams, setSearchParams] = useState({
    studentName: undefined,
    schoolId: undefined,
  });
  const { students, studentDataLoading, getStudentError, setParams } =
    useStudentContext();

  const handleFilter = useCallback(() => {
    console.log(cleanParams(searchParams));
    setParams(cleanParams(searchParams));
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
      render: (_, record) => {
        return (
          <Space size="small">
            <CustomButton
              type="edit"
              onClick={() => {
                navigate(`/payments/add/${record?.id}`);
              }}
            >
              Add Payment
            </CustomButton>
            <CustomButton
              onClick={() => {
                handleViewStudent(record.id);
              }}
            >
              View
            </CustomButton>
          </Space>
        );
      },
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

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Students List</h1>
      <Form form={form}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Form.Item name="studentName">
              <p>Student Name: </p>
              <CustomInput
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    studentName: e.target.value,
                  })
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="school">
              <p>School: </p>
              <Select
                loading={schoolsLoading}
                disabled={schoolsLoading}
                size="large"
                onChange={(value, t) => {
                  setSearchParams({
                    ...searchParams,
                    schoolId: value,
                  });
                }}
                className="custom-select"
              >
                {schools &&
                  schools?.data?.map((school) => (
                    <Option value={school.id} key={school.id}>
                      {school.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4} className="flex items-center mb-1">
            <Button
              className="w-auto bg-primary text-white mr-2"
              size="large"
              htmlType="button"
              onClick={handleFilter}
            >
              Filter
            </Button>
            <Button
              className="w-auto text-primary"
              size="large"
              htmlType="button"
              onClick={() => {
                form.resetFields();
                setParams({
                  pageNo: 1,
                  pageSize: 25,
                });
                setSearchParams({
                  studentName: undefined,
                  schoolId: undefined,
                });
              }}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Form>

      <Col span={24}>
        {getStudentError ? (
          <GenericErrorDisplay className="!mt-5" />
        ) : (
          <Table
            dataSource={filteredData}
            columns={columns}
            loading={studentDataLoading}
          />
        )}
      </Col>
    </div>
  );
};

export default StudentsList;
