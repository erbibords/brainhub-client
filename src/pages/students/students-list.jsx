import React, { useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import { Layout, Input, Table, Space,Row, Col } from "antd";
import { EyeOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Search } = Input;

const StudentsList = () => {
  const initialMarginBottom = "2vh";
  
  const [searchValue, setSearchValue] = useState('');
  
  const data = [
    { key: '1', name: 'Louie Martea', school: "WVSU", status: '1st Taker', contact: "09323232222", address: "North Molo" },
    { key: '2', name: 'Johny Seens', school: "UI", status: 'Re-Taker', contact: "09332133212", address: "South Lapaz" },
 
  ];
  
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'School', dataIndex: 'school', key: 'school' },
    { title: 'Student Status', dataIndex: 'status', key: 'status' },
    { title: 'Contact No.', dataIndex: 'contact', key: 'contact' },
    { title: 'Address.', dataIndex: 'address', key: 'address' },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <button onClick={() => handleViewStudent(record.key)} title="View Student Profile">
            <EyeOutlined />
          </button>
        </Space>
      ),
    },
  ];

  const handleViewStudent = (studentId) => {
    window.location.href = `/students/profile/${studentId}`;
  };

  const searchStudent = (value) => {
    setSearchValue(value);
  };

  const filteredData = data.filter(student =>
    student.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.school.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.status.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.contact.toLowerCase().includes(searchValue.toLowerCase())
  );
  

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px" }}>
          <div>
            <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>Students List</h1>
            <Row gutter={[16, 16]}>
              <Col span={4}>
                <Search type="text" placeholder="Search..." onChange={(e) => searchStudent(e.target.value)} />
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
