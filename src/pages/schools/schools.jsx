import React, { useState } from "react";
import { Table, Space, Row, Col } from "antd";
import CustomInput from "../../components/Input/Input";
import AddSchoolModal from "../../components/AddSchoolModal/AddSchoolModal";
import CustomButton from "../../components/Button/Button";

const SchoolList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const modalCancel = () => {
    setIsModalVisible(false);
  };

  const data = [
    { key: "1", school: "San Agustin" },
    { key: "2", school: "UI Phinma University" },
  ];
  const columns = [
    { title: "School", dataIndex: "school", key: "school" },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <CustomButton type="edit">Edit</CustomButton>
          <CustomButton type="delete">Delete</CustomButton>
        </Space>
      ),
    },
  ];

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
          <CustomInput type="text" />
        </Col>
        <Col span={24}>
          <Table dataSource={data} columns={columns} pagination={false} />
        </Col>
      </Row>

      <AddSchoolModal isVisible={isModalVisible} handleCancel={modalCancel} />
    </div>
  );
};

export default SchoolList;
