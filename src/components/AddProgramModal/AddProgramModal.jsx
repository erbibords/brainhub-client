import React from "react";
import { Modal, Form, Input, Select } from "antd";
import CustomInput from "../Input/Input";
import CustomButton from "../Button/Button";
import { useCourse } from "../../contexts/courses";
import useSchools from "../../hooks/useSchools";

const { TextArea } = Input;

const CustomModal = ({
  isVisible,
  handleCancel,
  handleSave,
  form,
  buttonLoading,
}) => {
  const { courses, getCoursesLoading, getCoursesError } = useCourse();
  const {
    data: schools,
    error: schoolsError,
    isLoading: schoolsLoading,
  } = useSchools();

  return (
    <Modal
      title={<div className="mb-6 text-lg">Add New Program</div>}
      visible={isVisible}
      onCancel={handleCancel}
      footer={[
        <CustomButton key="cancel" onClick={handleCancel}>
          Cancel
        </CustomButton>,
        <CustomButton
          key="submit"
          type="primary"
          loading={buttonLoading}
          className="w-auto bg-primary text-white"
          onClick={() => form.submit()}
        >
          Save
        </CustomButton>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          label="Program"
          layout="vertical"
          className="w-full"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the Review Program Name!",
            },
          ]}
        >
          <Select
            className="w-full mb=[2vh]"
            size="large"
            defaultValue="ENHANCEMENT"
          >
            <Option value="ENHANCEMENT">Enhancement</Option>
            <Option value="INTENSIVE">Intensive</Option>
            <Option value="INTENSIFIED">Intensified</Option>
            <Option value="NCLEX">NCLEX</Option>
            <Option value="NSG_INHOUSE">NSG Inhouse</Option>
            <Option value="RT_INHOUSE">RT Inhouse</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Course"
          name="courseId"
          rules={[{ required: true, message: "Please select course." }]}
        >
          <Select
            name="courseId"
            className="w-full"
            loading={courses}
            disabled={getCoursesLoading || getCoursesError}
          >
            {courses &&
              courses?.data?.map((course) => (
                <Option key={course.id} value={course.id}>
                  {course.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="School"
          name="schoolId"
          rules={[{ required: true, message: "Please select school." }]}
        >
          <Select
            className="w-full"
            loading={schoolsLoading}
            disabled={schoolsLoading || schoolsError}
          >
            {schools &&
              schools?.data?.map((school) => (
                <Option key={school.id} value={school.id}>
                  {school.name}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input the Description!" }]}
        >
          <TextArea rows={4} name="description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomModal;
