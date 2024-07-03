import React from "react";
import { Modal, Form, Input } from "antd";
import CustomInput from "../Input/Input";
import CustomButton from "../Button/Button";

const { TextArea } = Input;

const SchoolModal = ({ isVisible, handleCancel, handleSave, form }) => {
  return (
    <Modal
      title={<div className="mb-6 text-lg">Add School</div>}
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
          label="School Name"
          name="name"
          rules={[{ required: true, message: "Please input the School Name!" }]}
        >
          <CustomInput type="text" name="name" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SchoolModal;
