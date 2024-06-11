import React, { useMemo, useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import { Layout, Input, Table, Space, Row, Col, Button } from "antd";
import { useStudentContext } from "../../contexts/students";

const { Content } = Layout;
const { Search } = Input;

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
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px" }}>
          <div>
            <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>
              Students List
            </h1>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Search
                  type="text"
                  placeholder="Search by name..."
                  onChange={(e) => searchByName(e.target.value)}
                />
              </Col>
              <Col span={6}>
                <Search
                  type="text"
                  placeholder="Search by school..."
                  onChange={(e) => searchBySchool(e.target.value)}
                />
              </Col>
              <Col span={24}>
                <Table dataSource={filteredData} columns={columns} />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentsList;
