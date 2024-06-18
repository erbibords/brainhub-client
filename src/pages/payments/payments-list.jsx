import React, { useState } from "react";
 
import CustomInput from "../../components/Input/Input";
import { Layout, Input, Table, Space, Row, Col, Button, Select, DatePicker } from "antd";
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PaymentsList = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const data = [
    { key: '1', reference: 'Reference 02131',  firstName: 'Louie', middleName: 'Emms', lastName: 'Emms', schoolId: "WVSU", takerType: '1st Taker', courseId: "BSIT", semester: "1st", date: "2024-06-10", payments: "7500"},
    { key: '2', reference: 'Reference 32131', firstName: 'Johny', middleName: 'S', lastName: 'Seens', schoolId: "UI", takerType: 'Re-Taker', courseId: "BSEM", semester: "2nd", date: "2024-05-22", payments: "6000" },
  ];
  
  const columns = [
    { title: 'Reference', dataIndex: 'reference', key: 'reference' },
    { 
      title: 'Name', 
      dataIndex: ['firstName', 'middleName', 'lastName'],
      render: (text, record) => (
        <span>{record.firstName} {record.middleName} {record.lastName}</span>
      ) 
    },
    { title: 'School', dataIndex: 'schoolId', key: 'schoolId' },
    { title: 'Student Status', dataIndex: 'takerType', key: 'takerType' },
    { title: 'Course.', dataIndex: 'courseId', key: 'course' },
    { title: 'Semester', dataIndex: 'semester', key: 'semester' },
    { title: 'Date.', dataIndex: 'date', key: 'date' },
    { title: 'Payments', dataIndex: 'payments', key: 'payments' },
    
    // {
    //   title: 'Action',
    //   key: 'action',
    //   render: (text, record) => (
    //     <Space size="middle">
    //       <Button type="primary" onClick={() => handleViewPaymentList(record.key)} title="View" className="w-auto bg-primary text-white">View</Button>
    //     </Space>
    //   ),
    // },
  ];

  const handleViewPaymentList = (studentId) => {
    alert('debugging...');
  };

  const searchPaymentList = () => {
    console.log("Search value:", searchValue);
    console.log("Selected semester:", selectedSemester);
    console.log("Selected year:", selectedYear);
    console.log("Date From:", dateFrom ? dateFrom.format("YYYY-MM-DD") : null);
    console.log("Date To:", dateTo ? dateTo.format("YYYY-MM-DD") : null);
  };

  const printPaymentList = () => {
    alert("..");
  }

  return (
 
          <div>
            <h1 className="text-2xl mb-[2vh]">Payment Lists</h1>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Row gutter={[16, 16]}>

                <Col span={4}>
                    <CustomInput
                      placeholder="Reference"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className = "mb-[10px]"
                    />
                  </Col>
                  
                  <Col span={4}>
                    <CustomInput
                      placeholder="Student Name"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className = "mb-[10px]"
                    />
                  </Col>
                  <Col span={4}>
                    <CustomInput
                      placeholder="Course"
                      className = "mb-[10px]"
                    />
                  </Col>
                  <Col span={8}>
                    <CustomInput
                      placeholder="School"
                      className = "mb-[10px]"
                    />
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder="Semester"
                      onChange={(value) => setSelectedSemester(value)}
                      className="h-[50px] w-full mb-[10px]"
                    >
                      <Option value="FIRST_SEMESTER">1st</Option>
                      <Option value="SECOND_SEMESTER">2nd</Option>
                      <Option value="SUMMER">Summer</Option>
            
                    </Select>
                  </Col>

                  <Col span={4}>
                    <Select
                      placeholder="Year"
               
                      onChange={(value) => setSelectedYear(value)}
                      className="h-[50px] w-full mb-[10px]"
                    >
                      <Option value="2020">2020</Option>
                      <Option value="2021">2021</Option>
                      <Option value="2022">2022</Option>
                      <Option value="2023">2023</Option>
                      <Option value="2024">2024</Option>
                    </Select>
                  </Col>

                  <Col span={4}>
                  
                    
                    <RangePicker placeholder={['Date From', 'Date To']} className="h-[50px]" />
                  </Col>
                
                  
                  <Col span={4}>
                    <Button
                      type="primary"
                      className="bg-primary text-white w-auto mt-[10px]"
                      icon={<SearchOutlined />}
                      onClick={searchPaymentList}
                       
                    >
                      Search
                    </Button>
 
                    
                  </Col>


                  <Col span={24}>
                    <Button
                      type="primary"
                      className="w-auto bg-success text-white mb-[10px] float-right"
                      onClick={printPaymentList}
         
                    >
                      Print List
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

export default PaymentsList;
