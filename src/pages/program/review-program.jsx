import React, { useState, useCallback, useMemo } from "react";
import { Table, Space, Row, Col, Modal, Form, Button } from "antd";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import AddProgramModal from "../../components/AddProgramModal/AddProgramModal";
import { REVIEW_PROGRAM_BASE_URL } from "../../constants";
import useMutation from "../../hooks/useMutation";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useProgramContext } from "../../contexts/programs";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";

const ReviewProgram = () => {
  const navigate = useNavigate();
  const [searchProgram, setSearchProgram] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { programs, getProgramsLoading, getProgramsError } =
    useProgramContext();

  const { mutate: addProgram, loading: addProgramLoading } = useMutation(
    REVIEW_PROGRAM_BASE_URL,
    "POST",
    "programs"
  );

  const columns = [
    {
      title: "Program",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <CustomButton onClick={() => navigate("/review-program/:programId")}>
            View
          </CustomButton>

          <CustomButton
            type="secondary"
            className="w-auto bg-secondary text-white"
            onClick={() =>
              confirmDeleteProgram(record.id, record.reviewProgram)
            }
          >
            Delete
          </CustomButton>
        </Space>
      ),
    },
  ];

  const confirmDeleteProgram = (programId, name) => {
    Modal.confirm({
      title: "Are you sure you want to delete this program?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteProgram(programId, name);
      },
    });
  };

  const handleDeleteProgram = (programId, name) => {
    console.log("Program deleted");
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleAddProgram = useCallback(
    async (values) => {
      try {
        const res = await addProgram(values);
        if (res) {
          form.resetFields();
          setIsModalVisible(false);
          Swal.fire({
            icon: "success",
            title: "Review Program Added",
            timer: 2000,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          text: "It looks like there might be an encoding issue or a conflict with your entries. Please review and try again.",
        });
      }
    },
    [addProgram]
  );

  const filteredData = useMemo(() => {
    if (getProgramsError) return [];
    if (!programs) return [];
    if (!searchProgram) return programs?.data;
    return programs?.data?.filter((program) =>
      program.name.toLowerCase().includes(searchProgram.toLowerCase())
    );
  }, [searchProgram, programs, getProgramsError]);

  return (
    <div>
      <h1 className="text-2xl">Review Program</h1>
      <div className="text-right"></div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <CustomInput
            type="text"
            placeholder="Search by Program..."
            onChange={(e) => {
              setSearchProgram(e.target.value);
            }}
          />
        </Col>

        <Col span={16}>
          <div className="text-right">
            <CustomButton
              type="primary"
              onClick={showModal}
              className="w-auto bg-primary text-white float-right mt-[3vh]"
              size="large"
            >
              Add Program
            </CustomButton>
          </div>
        </Col>

        <Col span={24}>
          {getProgramsError ? (
            <GenericErrorDisplay className="mt-10" />
          ) : (
            <Table
              dataSource={filteredData}
              columns={columns}
              pagination={false}
              loading={getProgramsLoading}
            />
          )}
        </Col>
      </Row>

      <AddProgramModal
        isVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSave={handleAddProgram}
        form={form}
        buttonLoading={addProgramLoading}
      />
    </div>
  );
};

export default ReviewProgram;
