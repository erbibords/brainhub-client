import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Input, Table, Space, Row, Col, Button, Modal, Form } from 'antd';
import CustomInput from '../../components/Input/Input';
import AddSchoolModal from '../../components/AddSchoolModal/AddSchoolModal';
import useMutation from '../../hooks/useMutation';
import Swal from 'sweetalert2';
import CustomButton from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const SchoolList = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
      };
    
     const modalCancel = () => {
        setIsModalVisible(false); 
    };


    const data = [
        { key: '1', school: 'San Agustin',  description: 'lorem ipsum dole'},
        { key: '2', school: 'UI Phinma University', description: 'Dolorem Solome'},
       
      ];
     const columns = [
        { title: 'School', dataIndex: 'school', key: 'school' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                <CustomButton onClick={() => navigate(`${record.id}`)}>
                  View
                </CustomButton>
              </Space>
            ),
        },
     ];
 
   

  return (
    <div>
      <h1 className="text-2xl">Schools</h1>
      <div className="text-right">
        <Button
          type="primary"
          onClick={showModal}
          className="w-auto bg-primary text-white"
        >
          Add School
        </Button>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <p>School: </p>
          <CustomInput
            type="text"
          />
        </Col>
        <Col span={24}>
            <Table dataSource={data} columns={columns} />
        </Col>
      </Row>

      <AddSchoolModal
        isVisible={isModalVisible}
        handleCancel={modalCancel}
      />
    </div>
  );
};

export default SchoolList;