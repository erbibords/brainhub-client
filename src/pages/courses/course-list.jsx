import React, { useState } from "react";
import axios from "axios"; // Import Axios
import Sidebar from "../../components/SideBar/Sidebar";
import { Layout, Input, Table, Space, Row, Col, Button, Modal, Form } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import CustomInput from "../../components/Input/Input";
import CustomModal from "../../components/CustomModal/CustomModal";

const { Content } = Layout;
const { TextArea } = Input;

const CourseList = () => {
  const [searchCourse, setSearchCourse] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [courseData, setCourseData] = useState([
    { key: '1', course_name: 'Information Technology', description: "WVSU" },
    { key: '2', course_name: 'Business Administration', description: "UI" },
  ]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

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
              <>
                <Button type="primary" className="w-auto bg-primary text-white" onClick={() => saveCourse(record.key)}>
                  Save
                </Button>

                <Button onClick={() => cancelEditing()}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="success" className="w-auto bg-success text-white" onClick={() => editCourse(record.key)}>
                  Update
                </Button>

                <Button type="secondary" className="w-auto bg-secondary text-white" onClick={() => confirmDeleteCourse(record.key, record.course_name)}>
                  Delete
                </Button>
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

  const cancelEditing = () => {
    setEditingKey('');
  };

  const saveCourse = (key) => {
    const course = courseData.find(course => course.key === key);
    axios.post('/api/courses/update', course)
      .then(response => {
        setEditingKey('');
      })
      .catch(error => {
        console.error('There was an error updating the course!', error);
      });
  };

  const confirmDeleteCourse = (courseId, courseName) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this course?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteCourse(courseId, courseName);
      },
    });
  };

  const handleDeleteCourse = (courseId, courseName) => {
    console.log(courseId)
    // axios.delete(`/api/courses/${courseId}`)
    //   .then(response => {
    //     const newData = courseData.filter(item => item.key !== courseId);
    //     setCourseData(newData);
    //     alert(`Course ${courseName} has been deleted`);
    //   })
    //   .catch(error => {
    //     console.error('There was an error deleting the course!', error);
    //   });
  };

  const searchByCourse = (value) => {
    setSearchCourse(value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSaveCourse = (values) => {
    console.log(values);
  };

  const filteredData = courseData.filter(course =>
    course.course_name.toLowerCase().includes(searchCourse.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl">Course List</h1>
      <div className="text-right">
        <Button type="primary" onClick={showModal} className="w-auto bg-primary text-white">Add Course</Button>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <CustomInput type="text" placeholder="Search by Course..." onChange={(e) => searchByCourse(e.target.value)} />
        </Col>
        <Col span={24}>
          <Table dataSource={filteredData} columns={columns} />
        </Col>
      </Row>

      <CustomModal
            isVisible={isModalVisible}
            handleCancel={handleCancel}
            handleSave={handleSaveCourse}
            form={form}
        />
    </div>
  );
};

export default CourseList;
