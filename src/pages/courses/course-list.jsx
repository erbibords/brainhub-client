import React, { useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import { Layout, Input, Table, Space, Row, Col, Button, Modal, Form } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import CustomInput from "../../components/Input/Input";

const { Content } = Layout;
const { Search } = Input;
const { TextArea } = Input;

const CourseList = () => {
  const initialMarginBottom = "2vh";
  const [searchName, setSearchCourse] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const data = [
    { key: '1', name: 'Information Technology', description: "WVSU"},
    { key: '2', name: 'Business Administration', description: "UI"},
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
   
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <button onClick={() => handleUpdateCourse(record.key)} title="Update Course" style={{ color: 'green' }}>
            <EditOutlined />
          </button>
          <button onClick={() => handleUpdateCourse(record.key)} title="Remove Course" style={{ color: 'red' }}>
            <DeleteOutlined  />
          </button>
        </Space>
      ),
    },
  ];

  const handleUpdateCourse = (studentId) => {
    alert('debugging...');
  };

  const searchByCourse = (value) => {
    setSearchCourse(value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSaveCourse = () => {
    // Add your Axios logic here for saving the course
    setIsModalVisible(false);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout className="site-layout">
        <Content style={{ margin: "25px 25px" }}>
          <div>
            <h1 style={{ fontSize: "2em", marginBottom: initialMarginBottom }}>Course List</h1>
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <Button type="primary" onClick={showModal} className="w-auto bg-primary text-white">Add Course</Button>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Search type="text" placeholder="Search by Course..." onChange={(e) => searchByCourse(e.target.value)} />
              </Col>
              <Col span={24}>
                <Table dataSource={data} columns={columns} />
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
      <Modal
        title="Add New Course"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSaveCourse}>
            Save
          </Button>,
        ]}
      >
        <Form>
          <Form.Item label="Course Name" name="courseName">
            <CustomInput type="text" name ="course" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={4} name="desription" />
           
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CourseList;
