import React, { useState } from "react";
import Sidebar from "../../components/SideBar/Sidebar";
import { Layout, Input, Table, Space, Row, Col, Button, Modal, Form } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

import CustomInput from "../../components/Input/Input";

const { Content } = Layout;
const { Search } = Input;
const { TextArea } = Input;
const { confirm } = Modal;

const CourseList = () => {
  const initialMarginBottom = "2vh";
  const [searchCourse, setSearchCourse] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [courseData, setCourseData] = useState([
    { key: '1', course_name: 'Information Technology', description: "WVSU" },
    { key: '2', course_name: 'Business Administration', description: "UI" },
  ]);
  const [editingKey, setEditingKey] = useState('');

  const columns = [
    {
      title: 'Name',
      dataIndex: 'course_name',
      key: 'course_name',
      render: (text, record) => (
        editingKey === record.key ? (
          <Input
            value={record.course_name}
            onChange={e => handleFieldChange(e, record.key, 'course_name')}
          />
        ) : text
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        editingKey === record.key ? (
          <TextArea
            value={record.description}
            onChange={e => handleFieldChange(e, record.key, 'description')}
          />
        ) : text
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {
            editingKey === record.key ? (
              <button
                onClick={() => saveCourse(record.key)}
                title="Save Course"
                className="text-green-500"
              >
                <SaveOutlined />
              </button>
            ) : (
              <>
                <button
                  onClick={() => editCourse(record.key)}
                  title="Update Course"
                  className="text-green-500"
                >
                  <EditOutlined />
                </button>
                <button
                  onClick={() => confirmDeleteCourse(record.key, record.course_name)}
                  title="Remove Course"
                  className="text-red-500"
                >
                  <DeleteOutlined />
                </button>
              </>
            )
          }
        </Space>
      ),
    },
  ];

  const handleFieldChange = (e, key, field) => {
    const newData = [...courseData];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, [field]: e.target.value });
      setCourseData(newData);
    }
  };

  const editCourse = (key) => {
    setEditingKey(key);
  };

  const saveCourse = (key) => {
    setEditingKey('');
    // Add your save logic here (e.g., Axios call to save the updated course)
    alert('Course updated successfully');
  };

  const confirmDeleteCourse = (courseId, courseNAme) => {
    confirm({
      title: 'Are you sure you want to delete this course?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteCourse(courseId, courseNAme);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleDeleteCourse = (courseId, courseNAme) => {
    // Add your delete logic here (e.g., Axios call to delete the course)
    const newData = courseData.filter(item => item.key !== courseId);
    setCourseData(newData);
    alert(`Course ${courseNAme} has been deleted`);
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

  const filteredData = courseData.filter(course =>
    course.course_name.toLowerCase().includes(searchCourse.toLowerCase())
  );

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
                <Table dataSource={filteredData} columns={columns} />
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
            <CustomInput type="text" name="course" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <TextArea rows={4} name="description" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CourseList;
