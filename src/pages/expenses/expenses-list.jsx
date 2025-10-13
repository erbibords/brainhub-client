import { useState, useCallback, useMemo } from 'react';
import {
  Table,
  Space,
  Row,
  Col,
  Form,
  Select,
  DatePicker,
  InputNumber,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { Image } from 'antd';
import CustomInput from '../../components/Input/Input';
import CustomButton from '../../components/Button/Button';
import ExpenseModal from '../../components/ExpenseModal/ExpenseModal';
import GenericErrorDisplay from '../../components/GenericErrorDisplay/GenericErrorDisplay';
import useExpenses from '../../hooks/useExpenses';
import useMutation from '../../hooks/useMutation';
import { EXPENSE_BASE_URL, EXPENSE_TYPES } from '../../constants';
import { formatAmount, formatDate } from '../../utils/formatting';
import { DateTime } from 'luxon';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ExpensesList = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  // State management
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [filterParams, setFilterParams] = useState({
    name: undefined,
    type: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    minAmount: undefined,
    maxAmount: undefined,
    pageNo: 1,
    pageSize: 200,
  });

  // Fetch expenses using custom hook
  const {
    data: expenses,
    isLoading,
    error,
    mutate,
  } = useExpenses(filterParams);

  // Mutations
  const { mutate: createExpense, loading: createLoading } = useMutation(
    EXPENSE_BASE_URL,
    'POST',
    `expenses-${JSON.stringify(filterParams)}`
  );

  const { mutate: updateExpense, loading: updateLoading } = useMutation(
    selectedExpense ? `${EXPENSE_BASE_URL}/${selectedExpense.id}` : '',
    'PUT',
    `expenses-${JSON.stringify(filterParams)}`
  );

  const { mutate: deleteExpense, loading: deleteLoading } = useMutation(
    selectedExpense ? `${EXPENSE_BASE_URL}/${selectedExpense.id}` : '',
    'DELETE',
    `expenses-${JSON.stringify(filterParams)}`
  );

  // Handlers
  const showCreateModal = useCallback(() => {
    form.resetFields();
    setIsCreateModalVisible(true);
  }, [form]);

  const hideCreateModal = useCallback(() => {
    setIsCreateModalVisible(false);
    form.resetFields();
  }, [form]);

  const showEditModal = useCallback(
    (expense) => {
      setSelectedExpense(expense);
      form.setFieldsValue({
        name: expense.name,
        description: expense.description || '',
        type: expense.type,
        amount: expense.amount,
        date: dayjs(expense.date),
        entityId: expense.entityId || '',
        attachment: expense.attachment || '',
      });
      setIsEditModalVisible(true);
    },
    [form]
  );

  const hideEditModal = useCallback(() => {
    setIsEditModalVisible(false);
    setSelectedExpense(null);
    form.resetFields();
  }, [form]);

  const handleCreateExpense = useCallback(
    async (values) => {
      try {
        console.log('🔍 Frontend values:', values);
        console.log('🔍 selectedFile in values:', values.selectedFile);
        console.log('🔍 selectedFile type:', typeof values.selectedFile);

        // Create FormData for file upload support
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description || '');
        formData.append('type', values.type);
        formData.append('amount', parseFloat(values.amount));
        formData.append('date', values.date.toISOString());

        // Only include entityId if type is not GENERAL
        const entityId =
          values.type === 'GENERAL' ? null : values.entityId || null;
        if (entityId) {
          formData.append('entityId', entityId);
        }

        // Handle file upload
        if (values.selectedFile) {
          console.log(
            '🔍 Appending selectedFile to FormData:',
            values.selectedFile
          );
          formData.append('file', values.selectedFile);
        } else if (values.attachment) {
          formData.append('attachment', values.attachment);
        }

        console.log('🔍 FormData entries:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        const res = await createExpense(formData);

        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Expense Created!',
            timer: 2000,
          });
          hideCreateModal();
          mutate();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to create expense. Please try again!',
        });
      }
    },
    [createExpense, mutate, hideCreateModal]
  );

  const handleUpdateExpense = useCallback(
    async (values) => {
      try {
        // Create FormData for file upload support
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description || '');
        formData.append('type', values.type);
        formData.append('amount', parseFloat(values.amount));
        formData.append('date', values.date.toISOString());

        // Only include entityId if type is not GENERAL
        const entityId =
          values.type === 'GENERAL' ? null : values.entityId || null;
        if (entityId) {
          formData.append('entityId', entityId);
        }

        // Handle file upload
        if (values.selectedFile) {
          formData.append('file', values.selectedFile);
        } else if (values.attachment) {
          formData.append('attachment', values.attachment);
        }

        const res = await updateExpense(formData);

        if (res) {
          Swal.fire({
            icon: 'success',
            title: 'Expense Updated!',
            timer: 2000,
          });
          hideEditModal();
          mutate();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update expense. Please try again!',
        });
      }
    },
    [updateExpense, mutate, hideEditModal]
  );

  const handleDeleteExpense = useCallback(
    async (expense) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete the expense "${expense.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        try {
          setSelectedExpense(expense);
          const res = await deleteExpense();
          if (res !== undefined) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Expense has been deleted.',
              timer: 2000,
            });
            mutate();
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete expense. Please try again!',
          });
        } finally {
          setSelectedExpense(null);
        }
      }
    },
    [deleteExpense, mutate]
  );

  const handleFilter = useCallback(() => {
    const values = filterForm.getFieldsValue();
    setCurrentPage(1);
    setFilterParams({
      name: values.name || undefined,
      type: values.type || undefined,
      dateFrom: values.dateFrom || undefined,
      dateTo: values.dateTo || undefined,
      minAmount: values.minAmount || undefined,
      maxAmount: values.maxAmount || undefined,
      pageNo: 1,
      pageSize: 10000,
    });
  }, [filterForm]);

  const handleClearFilters = useCallback(() => {
    filterForm.resetFields();
    setCurrentPage(1);
    setPageSize(25);
    setFilterParams({
      name: undefined,
      type: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      minAmount: undefined,
      maxAmount: undefined,
      pageNo: 1,
      pageSize: 200,
    });
  }, [filterForm]);

  const handleDateRangeChange = (dates) => {
    if (dates) {
      const [startDate, endDate] = dates;
      filterForm.setFieldsValue({
        dateFrom: DateTime.fromJSDate(startDate.toDate()).toISO({
          includeOffset: false,
        }),
        dateTo: DateTime.fromJSDate(endDate.toDate()).toISO({
          includeOffset: false,
        }),
      });
    } else {
      filterForm.setFieldsValue({
        dateFrom: undefined,
        dateTo: undefined,
      });
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      render: (text) => text || '-',
    },
    {
      title: 'Type',
      dataIndex: 'typeLabel',
      key: 'typeLabel',
      width: 150,
    },
    {
      title: 'Related To',
      dataIndex: 'entityName',
      key: 'entityName',
      width: 200,
      render: (text) => text || '-',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => formatAmount(amount),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date) => formatDate(date),
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: 150,
      render: (branch) => branch?.name || '-',
    },
    {
      title: 'Attachment',
      dataIndex: 'attachment',
      key: 'attachment',
      width: 150,
      render: (attachment) => {
        if (attachment) {
          const filename = attachment.split('/').pop();
          const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(filename);

          if (isImage) {
            return (
              <div className="flex flex-col items-center gap-1">
                <Image
                  src={attachment}
                  alt={filename}
                  width={40}
                  height={40}
                  className="object-cover rounded border"
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                  preview={{
                    mask: <div className="text-white text-xs">Preview</div>,
                  }}
                />
                <span
                  className="text-xs text-gray-500 truncate max-w-[80px]"
                  title={filename}
                >
                  {filename}
                </span>
              </div>
            );
          } else {
            return (
              <div className="flex flex-col items-center gap-1">
                <PaperClipOutlined className="text-gray-600 text-lg" />
                <a
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs truncate max-w-[80px]"
                  title={filename}
                >
                  {filename}
                </a>
              </div>
            );
          }
        }
        return '-';
      },
    },
    {
      title: 'Action',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <CustomButton
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="w-auto bg-blue-500 text-white"
          />
          <CustomButton
            type="delete"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteExpense(record)}
            className="w-auto bg-red-500 text-white"
            loading={deleteLoading && selectedExpense?.id === record.id}
          />
        </Space>
      ),
    },
  ];

  // Client-side pagination
  const paginatedData = useMemo(() => {
    if (!expenses?.data) return [];
    return expenses.data.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [expenses?.data, currentPage, pageSize]);

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl mb-[2vh]">Expenses</h1>

        <div className="text-right mb-4">
          <CustomButton
            type="primary"
            onClick={showCreateModal}
            className="w-auto bg-primary text-white"
            size="large"
          >
            Create Expense
          </CustomButton>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <Form form={filterForm}>
          {/* First Row - Name and Type */}
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={12}>
              <Form.Item name="name" label="Expense Name">
                <CustomInput
                  placeholder="Search by name"
                  onChange={(e) =>
                    filterForm.setFieldsValue({ name: e.target.value })
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item name="type" label="Expense Type">
                <Select
                  placeholder="Select type"
                  size="large"
                  allowClear
                  onChange={(value) =>
                    filterForm.setFieldsValue({ type: value })
                  }
                >
                  {EXPENSE_TYPES.map((type) => (
                    <Option value={type.value} key={type.value}>
                      {type.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Second Row - Date Range and Amount Filters */}
          <Row gutter={[16, 16]} className="mb-4">
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Date Range">
                <RangePicker
                  className="w-full"
                  size="large"
                  onChange={handleDateRangeChange}
                />
              </Form.Item>
            </Col>

            <Col xs={12} sm={6} md={4}>
              <Form.Item name="minAmount" label="Min Amount">
                <InputNumber
                  className="w-full"
                  size="large"
                  min={0}
                  placeholder="Min"
                  onChange={(value) =>
                    filterForm.setFieldsValue({ minAmount: value })
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={12} sm={6} md={4}>
              <Form.Item name="maxAmount" label="Max Amount">
                <InputNumber
                  className="w-full"
                  size="large"
                  min={0}
                  placeholder="Max"
                  onChange={(value) =>
                    filterForm.setFieldsValue({ maxAmount: value })
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Filter Buttons */}
          <Row>
            <Col span={24}>
              <Space>
                <CustomButton
                  type="primary"
                  size="large"
                  onClick={handleFilter}
                >
                  Filter
                </CustomButton>
                <CustomButton
                  size="large"
                  onClick={handleClearFilters}
                  className="text-primary"
                >
                  Clear
                </CustomButton>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>

      {/* Table */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col span={24}>
          {error ? (
            <GenericErrorDisplay />
          ) : (
            <Table
              dataSource={paginatedData}
              columns={columns}
              loading={isLoading}
              rowKey="id"
              scroll={{ x: 'max-content', y: 500 }}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: expenses?.data?.length || 0,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${
                    expenses?.data?.length || 0
                  } items`,
                pageSizeOptions: ['10', '25', '50', '100'],
                onChange: (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
              }}
            />
          )}
        </Col>
      </Row>

      {/* Create Modal */}
      <ExpenseModal
        isVisible={isCreateModalVisible}
        handleCancel={hideCreateModal}
        handleSave={handleCreateExpense}
        form={form}
        buttonLoading={createLoading}
        isEditMode={false}
      />

      {/* Edit Modal */}
      <ExpenseModal
        isVisible={isEditModalVisible}
        handleCancel={hideEditModal}
        handleSave={handleUpdateExpense}
        form={form}
        buttonLoading={updateLoading}
        isEditMode={true}
      />
    </div>
  );
};

export default ExpensesList;
