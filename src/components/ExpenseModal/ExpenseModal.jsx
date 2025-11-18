import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Image,
} from 'antd';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UploadOutlined, PaperClipOutlined } from '@ant-design/icons';
import CustomInput from '../Input/Input';
import CustomButton from '../Button/Button';
import { EXPENSE_TYPES } from '../../constants';
import { useCourse } from '../../contexts/courses';
import { useProgramContext } from '../../contexts/programs';
import { useOfferingsContext } from '../../contexts/offerings';
import { useAuth } from '../../contexts/auth';

const { TextArea } = Input;
const { Option } = Select;

const ExpenseModal = ({
  isVisible,
  handleCancel,
  handleSave,
  form,
  buttonLoading,
  isEditMode = false,
}) => {
  const [selectedType, setSelectedType] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [existingAttachment, setExistingAttachment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useAuth();
  const isSuperAdmin = Boolean(user?.isSuperAdmin);

  // Fetch entities based on type
  const { courses, getCoursesLoading } = useCourse();
  const { programs, getProgramsLoading } = useProgramContext();
  const { data: offerings, getOfferingsLoading } = useOfferingsContext();

  // Watch for form type changes and modal visibility
  useEffect(() => {
    if (isVisible) {
      const type = isSuperAdmin ? 'GENERAL' : form.getFieldValue('type');
      form.setFieldsValue({ type: type || 'GENERAL' });
      setSelectedType(type || 'GENERAL');

      // Handle existing attachment for edit mode
      const attachment = form.getFieldValue('attachment');
      if (attachment && isEditMode) {
        setExistingAttachment(attachment);
        // Extract filename from URL for display
        const filename = attachment.split('/').pop();
        setFileList([
          {
            uid: '-1',
            name: filename,
            status: 'done',
            url: attachment,
          },
        ]);
      } else {
        setExistingAttachment(null);
        setFileList([]);
      }
    } else {
      setSelectedType(null);
      setFileList([]);
      setExistingAttachment(null);
      setSelectedFile(null);
    }
  }, [form, isVisible, isEditMode, isSuperAdmin]);

  const handleTypeChange = (value) => {
    setSelectedType(value);
    // Clear entityId when type changes
    form.setFieldValue('entityId', undefined);
  };

  // File upload handlers
  const handleFileChange = ({ fileList: newFileList }) => {
    console.log('🔍 Modal file change:', newFileList);
    setFileList(newFileList);

    // Set the file in state (following payments pattern)
    if (newFileList.length > 0) {
      console.log('🔍 Setting selectedFile:', newFileList[0].originFileObj);
      setSelectedFile(newFileList[0].originFileObj);
    } else {
      setSelectedFile(null);
    }
  };

  const handleRemoveFile = () => {
    setFileList([]);
    setExistingAttachment(null);
    setSelectedFile(null);
    form.setFieldValue('attachment', null);
  };

  // Upload props
  const uploadProps = {
    beforeUpload: () => false, // Prevent auto upload
    onChange: handleFileChange,
    onRemove: handleRemoveFile,
    fileList,
    maxCount: 1,
    accept: '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx',
  };
  return (
    <Modal
      title={
        <div className="mb-6 text-lg">
          {isEditMode ? 'Edit Expense' : 'Create New Expense'}
        </div>
      }
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
          onClick={() => {
            const formValues = form.getFieldsValue();
            handleSave({ ...formValues, selectedFile });
          }}
        >
          {isEditMode ? 'Update' : 'Save'}
        </CustomButton>,
      ]}
      width={700}
    >
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          label="Expense Name"
          name="name"
          rules={[
            { required: true, message: 'Please input the Expense Name!' },
          ]}
        >
          <CustomInput
            type="text"
            name="name"
            placeholder="Enter expense name"
          />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea
            rows={3}
            name="description"
            placeholder="Enter expense description (optional)"
          />
        </Form.Item>

        <Form.Item
          label="Expense Type"
          name="type"
          rules={
            isSuperAdmin
              ? []
              : [{ required: true, message: 'Please select an Expense Type!' }]
          }
        >
          {isSuperAdmin ? (
            <Input value="General Expense" disabled size="large" />
          ) : (
            <Select
              placeholder="Select expense type"
              size="large"
              onChange={handleTypeChange}
            >
              {EXPENSE_TYPES.map((type) => (
                <Option value={type.value} key={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        {/* Conditional Entity Selection based on Expense Type */}
        {!isSuperAdmin && selectedType === 'COURSES' && (
          <Form.Item
            label="Related Course"
            name="entityId"
            rules={[
              { required: true, message: 'Please select a related course!' },
            ]}
          >
            <Select
              placeholder="Select a course"
              size="large"
              loading={getCoursesLoading}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {courses?.data?.map((course) => (
                <Option value={course.id} key={course.id}>
                  {course.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {!isSuperAdmin && selectedType === 'PROGRAM' && (
          <Form.Item
            label="Related Program"
            name="entityId"
            rules={[
              { required: true, message: 'Please select a related program!' },
            ]}
          >
            <Select
              placeholder="Select a program"
              size="large"
              loading={getProgramsLoading}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {programs?.data?.map((program) => (
                <Option value={program.id} key={program.id}>
                  {program.name} - {program.description}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        {!isSuperAdmin && selectedType === 'OFFERINGS' && (
          <Form.Item
            label="Related Course Offering"
            name="entityId"
            rules={[
              {
                required: true,
                message: 'Please select a related course offering!',
              },
            ]}
          >
            <Select
              placeholder="Select a course offering"
              size="large"
              loading={getOfferingsLoading}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {offerings?.data?.map((offering) => (
                <Option value={offering.id} key={offering.id}>
                  {offering.course?.name} - {offering.semester} (
                  {offering.yearOffered})
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please input the Amount!' }]}
        >
          <InputNumber
            className="w-full"
            size="large"
            min={0}
            precision={2}
            placeholder="0.00"
            formatter={(value) =>
              `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/₱\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: 'Please select a Date!' }]}
        >
          <DatePicker className="w-full" size="large" format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item label="Attachment (Optional)" name="attachment">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} size="large" className="w-full">
              Click to Upload Receipt or Document
            </Button>
          </Upload>
          {existingAttachment && (
            <div className="mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <PaperClipOutlined />
                <span>Current attachment:</span>
              </div>
              <div className="flex items-center gap-3">
                {(() => {
                  const filename = existingAttachment.split('/').pop();
                  const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(
                    filename
                  );

                  if (isImage) {
                    return (
                      <>
                        <Image
                          src={existingAttachment}
                          alt={filename}
                          width={60}
                          height={60}
                          className="object-cover rounded border"
                          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                          preview={{
                            mask: (
                              <div className="text-white text-xs">Preview</div>
                            ),
                          }}
                        />
                        <a
                          href={existingAttachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {filename}
                        </a>
                      </>
                    );
                  } else {
                    return (
                      <a
                        href={existingAttachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        <PaperClipOutlined />
                        {filename}
                      </a>
                    );
                  }
                })()}
              </div>
            </div>
          )}
          <div className="mt-1 text-xs text-gray-500">
            Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX (Max 20MB)
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

ExpenseModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  buttonLoading: PropTypes.bool,
  isEditMode: PropTypes.bool,
};

ExpenseModal.defaultProps = {
  buttonLoading: false,
  isEditMode: false,
};

export default ExpenseModal;
