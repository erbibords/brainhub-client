import { Form, Modal, Switch } from 'antd';
import CustomButton from '../Button/Button';
import CustomInput from '../Input/Input';

const BankNameModal = ({
  open,
  title,
  form,
  onCancel,
  onSave,
  confirmLoading,
  showIsActive = true,
  saveLabel = 'Save',
}) => {
  return (
    <Modal
      title={<div className="mb-2 text-lg">{title}</div>}
      open={open}
      onCancel={onCancel}
      footer={[
        <CustomButton key="cancel" onClick={onCancel}>
          Cancel
        </CustomButton>,
        <CustomButton
          key="submit"
          type="primary"
          loading={confirmLoading}
          className="w-auto bg-primary text-white"
          onClick={() => form.submit()}
        >
          {saveLabel}
        </CustomButton>,
      ]}
      width={700}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Form.Item label="Bank Code" name="code">
          <CustomInput type="text" name="code" placeholder="BPI, PNB" />
        </Form.Item>

        <Form.Item
          label="Bank Name"
          name="name"
          rules={[{ required: true, message: 'Please input the bank name!' }]}
        >
          <CustomInput
            type="text"
            name="name"
            placeholder="Bank of the Philippine Islands"
          />
        </Form.Item>

        {showIsActive ? (
          <Form.Item
            label="Active"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  );
};

export default BankNameModal;
