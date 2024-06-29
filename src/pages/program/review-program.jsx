import React, { useState } from "react";
import axios from "axios"; // Import Axios
import Sidebar from "../../components/SideBar/Sidebar";
import { Layout, Input, Table, Space, Row, Col, Button, Modal, Form } from "antd";
import { EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import CustomInput from "../../components/Input/Input";
import AddProgramModal from "../../components/AddProgramModal/AddProgramModal";

const { Content } = Layout;
const { TextArea } = Input;

const ReviewProgram = () => {
  const [searchProgram, setSearchProgram] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reviewProgramData, setReviewProgram] = useState([
    { key: '1', reviewProgram: 'Insentive Program', description: "WVSU" },
    { key: '2', reviewProgram: 'Sensitive Program', description: "UI" },
  ]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const columns = [
    {
      title: 'Program',
      dataIndex: 'reviewProgram',
      key: 'reviewProgram',
      render: (text, record) => (
        editingKey === record.id ? (
          <Input
            value={record.reviewProgram}
            onChange={e => handleFieldChange(e, record.id, 'reviewProgram')}
          />
        ) : text
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => (
        editingKey === record.id ? (
          <TextArea
            value={record.description}
            onChange={e => handleFieldChange(e, record.id, 'description')}
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
            editingKey === record.id ? (
              <>
                <Button type="primary" className="w-auto bg-primary text-white" onClick={() => saveProgram(record.id)}>
                  Save
                </Button>

                <Button onClick={() => cancelEditing()}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button type="success" className="w-auto bg-success text-white" onClick={() => editProgram(record.id)}>
                  Update
                </Button>

                <Button type="secondary" className="w-auto bg-secondary text-white" onClick={() => confirmDeleteProgram(record.id, record.reviewProgram)}>
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
    const newData = [...reviewProgramData];
    const index = newData.findIndex(item => key === item.id);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, [field]: e.target.value });
      setReviewProgram(newData);
    }
  };

  const editProgram = (key) => {
    setEditingKey(key);
  };

  const cancelEditing = () => {
    setEditingKey('');
  };

  const saveProgram = (key) => {
    
  };

  const confirmDeleteProgram = (programId, name) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this program?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteProgram(programId, name);
      },
    });
  };

  const handleDeleteProgram = (programId, name) => {
    console.log('delete');
  };

  const searchByProgram = (value) => {
    setSearchProgram(value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSaveProgram = (values) => {
    console.log(values);
  };

  const filteredData = reviewProgramData.filter(program =>
    program.reviewProgram.toLowerCase().includes(searchProgram.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl">Review Program</h1>
      <div className="text-right">
        <Button type="primary" onClick={showModal} className="w-auto bg-primary text-white">Add Program</Button>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <CustomInput type="text" placeholder="Search by Program..." onChange={(e) => searchByProgram(e.target.value)} />
        </Col>
        <Col span={24}>
          <Table dataSource={filteredData} columns={columns} />
        </Col>
      </Row>

      <AddProgramModal
            isVisible={isModalVisible}
            handleCancel={handleCancel}
            handleSave={handleSaveProgram}
            form={form}
        />
    </div>
  );
};

export default ReviewProgram;
