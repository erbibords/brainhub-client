import React, { useMemo, useState } from "react";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button"
import AddOfferingsModal from "../../components/AddOfferingsModal/AddOfferingsModal";
import {  Table, Space, Row, Col, Button , Select} from "antd";
import { useNavigate } from "react-router";

const Option = {Select}

const Offerings = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false); 
    const showPageOfferingInsert = () => {
        navigate(`/offerings/add`);
     };
   
     const handleCancel = () => {
       setIsModalVisible(false);
       form.resetFields();
     };


    const data = [
        { key: '1', courseId: 'Information Technology', enrollmentCapacity: "45", semester: '1st', yeadOffered: "2024", startDate: "2024-06-17",  },
        { key: '2', courseId: 'Computer Science', enrollmentCapacity: "50", semester: '2nd', yeadOffered: "2024", startDate: "2024-06-24", },
        ];
    const columns = [
        { title: "Course", dataIndex: "courseId", key: "courseId" },
        { title: "Enrollment Capacity", dataIndex: "enrollmentCapacity", key: "enrollmentCapacity" },
        { title: "Semester", dataIndex: "semester", key: "semester" },
        { title: "Year", dataIndex: "yeadOffered", key: "yeadOffered" },
        
        { title: "Start Date.", dataIndex: "startDate", key: "startDate" },
        {
        title: "Action",
        key: "action",
        render: (text, record) => (
            <Space size="small">
            <CustomButton type = "edit">Edit</CustomButton>
            <CustomButton type = "delete">Delete</CustomButton>
            </Space>
        ),
        },
    ];
 
 
  return (
          <div>
            <h1 className="text-2xl mb-[2vh]">
              Offerings
            </h1>
            <Row gutter={[16, 16]}>
              <Col span={4}>
                <CustomInput
                    placeholder="Search by course.."
                    onChange={(e) => searchByOfferings(e.target.value)}
                    className="mb-4" 
                  />
              </Col>

              <Col span={4}>
                 
                   <Select
                      placeholder="Year"
               
                      onChange={(value) => setSelectedYear(value)}
                      className="h-[40px] w-full mb-[10px]"
                    >
                      <Option value="2020">2020</Option>
                      <Option value="2021">2021</Option>
                      <Option value="2022">2022</Option>
                      <Option value="2023">2023</Option>
                      <Option value="2024">2024</Option>
                    </Select>
              </Col>
              <Col span={4}>
                 
                 <Select
                    placeholder="Semester"
             
                    onChange={(value) => setSelectedSemester(value)}
                    className="h-[40px] w-full mb-[10px]"
                  >
                    <Option value="1st">1st</Option>
                    <Option value="2nd">2nd</Option>
                    <Option value="Summer">Summer</Option>
                  </Select>
            </Col>
              <Col span={3}>
                <CustomButton type = "primary">
                  Search
                </CustomButton>
              </Col>

              <Col span={8}>
                <Button  className="w-auto bg-primary text-white float-right" size="large" onClick={showPageOfferingInsert}>
                  Add Offerings
                </Button>
              </Col>
              <Col span={24}>
                <Table dataSource={data} columns={columns} />
              </Col>
            </Row>


         

          </div>

          
      
  );
};

export default Offerings;
