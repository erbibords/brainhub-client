import { useState, useCallback, useMemo } from "react";
import { Table, Space, Row, Col, Form } from "antd";
import CustomInput from "../../components/Input/Input";
import CustomButton from "../../components/Button/Button";
import AddProgramModal from "../../components/AddProgramModal/AddProgramModal";
import { REVIEW_PROGRAM_BASE_URL } from "../../constants";
import useMutation from "../../hooks/useMutation";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import usePrograms from "../../hooks/usePrograms";
import GenericErrorDisplay from "../../components/GenericErrorDisplay/GenericErrorDisplay";
import { useBranch } from "../../contexts/branch";
const ReviewProgram = () => {
  const navigate = useNavigate();
  const [searchProgram, setSearchProgram] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { programs, isLoading: getProgramsLoading, error: getProgramsError } =
    usePrograms();
  const { branchId } = useBranch();
  const reviewProgramBaseUrl = useMemo(
    () => REVIEW_PROGRAM_BASE_URL(),
    [branchId]
  );
  const programsCacheKey = useMemo(() => {
    return `programs-${branchId ?? "unknown"}`;
  }, [branchId]);

  const { mutate: addProgram, loading: addProgramLoading } = useMutation(
    reviewProgramBaseUrl,
    "POST",
    programsCacheKey
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
      title: "Course",
      dataIndex: "course",
      render: (data) => data?.name,
    },
    {
      title: "School",
      dataIndex: "school",
      render: (data) => data?.name,
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <CustomButton
            onClick={() => navigate(`/review-program/${record?.id}`)}
          >
            View
          </CustomButton>
        </Space>
      ),
    },
  ];

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
      <h1 className="text-2xl mb-[6vh]">Review Program</h1>
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
