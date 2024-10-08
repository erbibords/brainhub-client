import React from "react";
import { Modal, Form, Input } from "antd";
import CustomInput from "../Input/Input";
import CustomButton from "../Button/Button";

const { TextArea } = Input;

const CourseModal = ({ isVisible, handleCancel, handleSave, form }) => {
  return (
    <Modal
      title={<div className="mb-6 text-lg">Add New Course</div>}
      visible={isVisible}
      onCancel={handleCancel}
      footer={[
        <CustomButton key="cancel" onClick={handleCancel}>
          Cancel
        </CustomButton>,
        <CustomButton
          key="submit"
          type="primary"
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
          label="Course Name"
          name="name"
          rules={[{ required: true, message: "Please input the Course Name!" }]}
        >
          <CustomInput type="text" name="name" />
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

export default CourseModal;
