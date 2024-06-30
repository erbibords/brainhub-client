import React from "react";
import { Modal, Button, Form, Input } from "antd";
import CustomInput from "../Input/Input";

const { TextArea } = Input;

const CustomModal = ({
  isVisible,
  handleCancel,
  handleSave,
  form,
  buttonLoading,
}) => {
  return (
    <Modal
      title={<div className="mb-6 text-lg">Add New Program</div>}
      visible={isVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={buttonLoading}
          className="w-auto bg-primary text-white"
          onClick={() => form.submit()}
        >
          Save
        </Button>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the Review Program Name!",
            },
          ]}
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

export default CustomModal;