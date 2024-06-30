import React, { useState, useCallback, useMemo } from "react";
import { Table, Space, Row, Col, Button, Modal, Form } from "antd";
import CustomInput from "../../components/Input/Input";
import AddProgramModal from "../../components/AddProgramModal/AddProgramModal";
import { REVIEW_PROGRAM_BASE_URL } from "../../constants";
import useMutation from "../../hooks/useMutation";
import Swal from "sweetalert2";
import { useProgramContext } from "../../contexts/programs";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";

const ReviewProgram = () => {
  const [searchProgram, setSearchProgram] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reviewProgramData, setReviewProgram] = useState();
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
          <Button
            type="success"
            className="w-auto bg-success text-white"
            onClick={() => editProgram(record.id)}
          >
            Edit
          </Button>

          <Button
            type="secondary"
            className="w-auto bg-secondary text-white"
            onClick={() =>
              confirmDeleteProgram(record.id, record.reviewProgram)
            }
          >
            Delete
          </Button>
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
      <div className="text-right">
        <Button
          type="primary"
          onClick={showModal}
          className="w-auto bg-primary text-white"
        >
          Add Program
        </Button>
      </div>
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
        <Col span={24}>
          {getProgramsError ? (
            <GenericErrorDisplay className="mt-10" />
          ) : (
            <Table
              dataSource={filteredData}
              columns={columns}
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