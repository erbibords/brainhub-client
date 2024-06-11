import React, { useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import { Layout, Input, Table, Space, Row, Col, Button, Select, DatePicker } from "antd";
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import CustomInput from "../../components/Input/Input";

const { Content } = Layout;
const { Option } = Select;

const Enrollment = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const data = [
    { key: '1', firstName: 'Louie', middleName: 'M', lastName: 'Emms', schoolId: "WVSU", takerType: '1st Taker', courseId: "BSIT", semester: "1st", date: "2024-06-10"},
    { key: '2', firstName: 'Johny', middleName: 'S', lastName: 'Seens',  schoolId: "UI", takerType: 'Re-Taker', courseId: "BSEM", semester: "2nd", date: "2024-05-22" },
  ];
  
  const columns = [
    // { title: 'Name', dataIndex: 'name', key: 'name' },
    { 
      title: 'Name', 
      dataIndex: ['firstName', 'middleName', 'lastName'],
      render: (text, record) => (
        <span>{record.firstName} {record.middleName} {record.lastName}</span>
      ) 
    },
    { title: 'School', dataIndex: 'schoolId', key: 'schoolId' },
    { title: 'Student Status', dataIndex: 'takerType', key: 'takerType' },
    { title: 'Course.', dataIndex: 'courseId', key: 'courseId' },
    { title: 'Semester', dataIndex: 'semester', key: 'semester' },
    { title: 'Date.', dataIndex: 'date', key: 'date' },
    
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleViewEnrollment(record.key)} title="View" className="w-auto bg-primary text-white">View</Button>
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
     
          <div>
            <h1 className="text-2xl mb-[2vh]">Enrollments</h1>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  
                  <Col span={4}>
                    <CustomInput
                      placeholder="Student Name"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="mb-4" 
                    />
                  </Col>
                  <Col span={4}>
                    <CustomInput
                      placeholder="Course"
                      className="mb-4"
                    />
                  </Col>
                  <Col span={8}>
                    <CustomInput
                      placeholder="School"
                      className="mb-4"
                    />
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder="Semester"
                      className="w-full mb-4 h-[40px]"
                      onChange={(value) => setSelectedSemester(value)}
                    >
                      <Option value="1st">1st</Option>
                      <Option value="2nd">2nd</Option>
                      <Option value="3rd">3rd</Option>
                    </Select>
                  </Col>

                  <Col span={4}>
                    <Select
                      placeholder="Year"
                      className="w-full mb-4 h-[40px]"
                      onChange={(value) => setSelectedSemester(value)}
                    >
                      <Option value="2020">2020</Option>
                      <Option value="2021">2021</Option>
                      <Option value="2022">2022</Option>
                      <Option value="2023">2023</Option>
                      <Option value="2024">2024</Option>
                    </Select>
                  </Col>

                  <Col span={4}>
                    <DatePicker
                      placeholder="Date From"
                      className="w-full mb-4 h-[40px]"
                      value={dateFrom}
                      onChange={(date) => setDateFrom(date)}
                    />
                  </Col>
                  <Col span={4}>
                    <DatePicker
                      placeholder="Date To"
                      className="w-full mb-4 h-[40px]"
                      value={dateTo}
                      onChange={(date) => setDateTo(date)}
                    />
                  </Col>
                  
                  <Col span={4}>
                    <Button
                      type="primary"
                      className="w-auto bg-primary text-white mb-4"
                      icon={<SearchOutlined />}
                      onClick={searchEnrollent}
                      
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
       
  );
};

export default Enrollment;
