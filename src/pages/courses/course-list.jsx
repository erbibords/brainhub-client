import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Input, Table, Space, Row, Col, Form } from "antd";
import CustomInput from "../../components/Input/Input";
import AddCourseModal from "../../components/AddCourseModal/AddCourseModal";
import useMutation from "../../hooks/useMutation";
import { COURSE_BASE_URL } from "../../constants";
import { useCourse } from "../../contexts/courses";
import Swal from "sweetalert2";
import CustomButton from "../../components/Button/Button";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const CourseList = () => {
  const navigate = useNavigate();
  const [searchCourse, setSearchCourse] = useState("");
  const { courses, coursesLoading, coursesError } = useCourse();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(undefined);
  const {
    mutate: addCourse,
    loading: addCourseLoading,
    error: addCourseError,
  } = useMutation(COURSE_BASE_URL, "POST", COURSE_BASE_URL);

  const {
    mutate: deleteCourse,
    loading: deleteCourseLoading,
    error: deleteCourseError,
  } = useMutation(
    `${COURSE_BASE_URL}/${selectedCourse?.id}`,
    "DELETE",
    COURSE_BASE_URL
  );

  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    console.log(selectedCourse);
  }, [selectedCourse]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) =>
        editingKey === record.key ? (
          <Input
            value={record.course_name}
            onChange={(e) => handleFieldChange(e, record.key, "name")}
          />
        ) : (
          text
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) =>
        editingKey === record.id ? (
          <TextArea
            value={record.description}
            onChange={(e) => handleFieldChange(e, record.id, "description")}
          />
        ) : (
          text
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <CustomButton onClick={() => navigate(`${record.id}`)}>
            View
          </CustomButton>
        </Space>
      ),
    },
  ];

  const handleFieldChange = (e, key, field) => {
    const newData = [...courseData];
    const index = newData.findIndex((item) => key === item.key);
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
    setEditingKey("");
  };

  const handleDeleteCourse = useCallback(() => {
    console.log(selectedCourse);
    if (!selectedCourse) {
      alert("SELECTED COURSE NOT FOUND");
      return;
    }
    // try {
    //   const res = await deleteCourse();
    //   if (res) {
    //     Swal.fire({
    //       icon: "success",
    //       title: "Course Deleted",
    //       timer: 2000,
    //     });
    //     setSelectedCourse(undefined);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   setSelectedCourse(undefined);
    // }
  }, [selectedCourse]);

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

  const handleSaveCourse = useCallback(
    async (values) => {
      try {
        const res = await addCourse(values);

        if (res) {
          form.resetFields();
          setIsModalVisible(false);
          Swal.fire({
            icon: "success",
            title: "Course Added",
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
    [addCourse]
  );

  const filteredData = useMemo(() => {
    if (coursesError) return [];
    if (!courses) return [];
    if (!searchCourse) return courses?.data;
    return courses?.data?.filter((course) =>
      course.name.toLowerCase().includes(searchCourse.toLowerCase())
    );
  }, [searchCourse, courses, coursesError]);

  return (
    <div>
      <h1 className="text-2xl">Course List</h1>
      <div className="text-right">
        <CustomButton
          type="primary"
          onClick={showModal}
          className="w-auto bg-primary text-white"
        >
          Add Course
        </CustomButton>
      </div>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <p>Course: </p>
          <CustomInput
            type="text"
            onChange={(e) => searchByCourse(e.target.value)}
          />
        </Col>
        <Col span={24}>
          <Table
            dataSource={courses && courses.data && filteredData}
            columns={columns}
            pagination={false}
            loading={coursesLoading || addCourseLoading || deleteCourseLoading}
          />
        </Col>
      </Row>

      <AddCourseModal
        isVisible={isModalVisible}
        handleCancel={handleCancel}
        handleSave={handleSaveCourse}
        form={form}
      />
    </div>
  );
};

export default CourseList;
