import React, { useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import { Layout, Input, Table, Space, Row, Col, Button, Select, DatePicker } from "antd";
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Option } = Select;

const Enrollment = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const data = [
    { key: '1', name: 'Louie Martea', school: "WVSU", status: '1st Taker', course: "BSIT", semester: "1st", date: "2024-06-10"},
    { key: '2', name: 'Johny Seens', school: "UI", status: 'Re-Taker', course: "BSEM", semester: "2nd", date: "2024-05-22" },
  ];
  
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'School', dataIndex: 'school', key: 'school' },
    { title: 'Student Status', dataIndex: 'status', key: 'status' },
    { title: 'Course.', dataIndex: 'course', key: 'course' },
    { title: 'Semester', dataIndex: 'semester', key: 'semester' },
    { title: 'Date.', dataIndex: 'date', key: 'date' },
    
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <button onClick={() => handleViewEnrollment(record.key)} title="View">
            <EyeOutlined />
          </button>
        </Space>
      ),
    },
  ];

  const handleViewEnrollment = (studentId) => {
    alert('debugging...');
  };

  const searchEnrollent = () => {
    console.log("Search value:", searchValue);
    console.log("Selected semester:", selectedSemester);
    console.log("Selected year:", selectedYear);
    console.log("Date From:", dateFrom ? dateFrom.format("YYYY-MM-DD") : null);
    console.log("Date To:", dateTo ? dateTo.format("YYYY-MM-DD") : null);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px" }}>
          <div>
            <h1 style={{ fontSize: "2em", marginBottom: "2vh" }}>Enrollments</h1>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col span={4}>
                    <DatePicker
                      placeholder="Date From"
                      style={{ width: "100%", marginBottom: "10px" }}
                      value={dateFrom}
                      onChange={(date) => setDateFrom(date)}
                    />
                  </Col>
                  <Col span={4}>
                    <DatePicker
                      placeholder="Date To"
                      style={{ width: "100%", marginBottom: "10px" }}
                      value={dateTo}
                      onChange={(date) => setDateTo(date)}
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      placeholder="Name"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      style={{ marginBottom: "10px" }}
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      placeholder="Course"
                      style={{ marginBottom: "10px" }}
                    />
                  </Col>
                  <Col span={4}>
                    <Input
                      placeholder="School"
                      style={{ marginBottom: "10px" }}
                    />
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder="Select Semester"
                      style={{ width: "100%", marginBottom: "10px" }}
                      onChange={(value) => setSelectedSemester(value)}
                    >
                      <Option value="1st">1st</Option>
                      <Option value="2nd">2nd</Option>
                      <Option value="3rd">3rd</Option>
                    </Select>
                  </Col>
                  
                  <Col span={24}>
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={searchEnrollent}
                      style={{ marginBottom: "10px" }}
                    >
                      Search
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Table dataSource={data} columns={columns} />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Enrollment;
