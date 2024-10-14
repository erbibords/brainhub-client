import React, { useCallback, useState, useMemo } from 'react';
import { Table, Space, Row, Col, Button, Form } from 'antd';
import CustomInput from '../../components/Input/Input';
import AddSchoolModal from '../../components/AddSchoolModal/AddSchoolModal';
import useMutation from '../../hooks/useMutation';
import Swal from 'sweetalert2';
import CustomButton from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import useSchools from '../../hooks/useSchools';
import GenericErrorDisplay from '../../components/GenericErrorDisplay/GenericErrorDisplay';
import { SCHOOLS_BASE_URL } from '../../constants';

const SchoolList = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data: schools, isLoading, error } = useSchools();
  const [searchSchoolText, setSearchSchoolText] = useState('');
  const { mutate: addSchool, loading: addSchoolLoading } = useMutation(
    SCHOOLS_BASE_URL,
    'POST',
    'schools'
  );
  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const handleAddSchool = useCallback(
    async (data) => {
      try {
        const res = await addSchool(data);
        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'School Added!',
            timer: 2000,
          });
          hideModal();
          form.resetFields();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title:
            'Error adding school! It may be due to input, please try again later!',
          timer: 2000,
        });
      }
    },
    [addSchool]
  );

  const columns = [
    { title: 'School', dataIndex: 'name' },
    {
      title: 'Total Collectibles',
      dataIndex: 'totalCollectibles',
      render: (data) => data?.totalCollectibles,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <CustomButton onClick={() => navigate(`/schools/${record?.id}`)}>
            View
          </CustomButton>
          {/* <CustomButton type="delete" onClick={() => navigate(`${record.id}`)}>
            Delete
          </CustomButton> */}
        </Space>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    if (error) return [];
    if (!schools?.data) return [];
    if (!searchSchoolText) return schools?.data;
    return schools?.data?.filter((school) =>
      school.name.toLowerCase().includes(searchSchoolText?.toLowerCase())
    );
  }, [searchSchoolText, schools, error]);

  return (
    <div>
      <h1 className="text-2xl">Schools</h1>
      <div className="text-right">
        <CustomButton
          type="primary"
          onClick={showModal}
          className="w-auto bg-primary text-white"
        >
          Add School
        </CustomButton>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <p>School: </p>
          <CustomInput
            type="text"
            onChange={(e) => setSearchSchoolText(e.target.value)}
          />
        </Col>
        <Col span={24}>
          {error ? (
            <GenericErrorDisplay />
          ) : (
            <Table
              dataSource={filteredData}
              columns={columns}
              pagination={false}
              isLoading={isLoading}
            />
          )}
        </Col>
      </Row>

      <AddSchoolModal
        isVisible={isModalVisible}
        handleCancel={hideModal}
        handleSave={handleAddSchool}
        form={form}
        buttonLoading={addSchoolLoading}
      />
    </div>
  );
};

export default SchoolList;
