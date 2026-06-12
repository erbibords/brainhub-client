import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Col,
  Form,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import Swal from 'sweetalert2';
import axiosInstance from '../../utils/axiosInstance';
import useMutation from '../../hooks/useMutation';
import CustomButton from '../../components/Button/Button';
import CustomInput from '../../components/Input/Input';
import GenericErrorDisplay from '../../components/GenericErrorDisplay/GenericErrorDisplay';
import BankNameModal from '../../components/BankNameModal/BankNameModal';
import { BANK_NAMES_BASE_URL } from '../../constants';

const { Option } = Select;

const PAGE_SIZE = 25;

const BanksPage = () => {
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [filters, setFilters] = useState({
    name: undefined,
    code: undefined,
    isActive: undefined,
    pageNo: 1,
    pageSize: PAGE_SIZE,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: PAGE_SIZE,
    total: 0,
  });

  const bankNamesBaseUrl = useMemo(() => BANK_NAMES_BASE_URL(), []);

  const { mutate: createBank, loading: createLoading } = useMutation(
    bankNamesBaseUrl,
    'POST'
  );
  const { mutate: updateBank, loading: updateLoading } = useMutation(
    bankNamesBaseUrl,
    'PUT'
  );
  const { mutate: deleteBank, loading: deleteLoading } = useMutation(
    bankNamesBaseUrl,
    'DELETE'
  );

  const loadBanks = useCallback(
    async (nextFilters = filters) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(bankNamesBaseUrl, {
          params: {
            pageNo: nextFilters.pageNo,
            pageSize: nextFilters.pageSize,
            name: nextFilters.name || undefined,
            code: nextFilters.code || undefined,
            isActive:
              typeof nextFilters.isActive === 'boolean'
                ? nextFilters.isActive
                : undefined,
          },
        });

        setBanks(response.data?.data ?? []);
        setPagination({
          current: response.data?.meta?.pageNo ?? nextFilters.pageNo,
          pageSize: response.data?.meta?.pageSize ?? nextFilters.pageSize,
          total: response.data?.meta?.totalResults ?? 0,
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [bankNamesBaseUrl, filters]
  );

  useEffect(() => {
    loadBanks(filters);
  }, [filters, loadBanks]);

  const showCreateModal = useCallback(() => {
    setEditingBank(null);
    form.resetFields();
    form.setFieldsValue({
      code: '',
      name: '',
      isActive: true,
    });
    setIsModalVisible(true);
  }, [form]);

  const showEditModal = useCallback(
    (bank) => {
      setEditingBank(bank);
      form.setFieldsValue({
        code: bank.code ?? '',
        name: bank.name,
        isActive: bank.isActive,
      });
      setIsModalVisible(true);
    },
    [form]
  );

  const hideModal = useCallback(() => {
    setIsModalVisible(false);
    setEditingBank(null);
    form.resetFields();
  }, [form]);

  const handleSaveBank = useCallback(
    async (values) => {
      try {
        const payload = {
          code: values.code || null,
          name: values.name,
          isActive: values.isActive ?? true,
        };

        if (editingBank) {
          await updateBank(payload, `${bankNamesBaseUrl}/${editingBank.id}`);
          Swal.fire({
            icon: 'success',
            title: 'Bank Updated!',
            timer: 2000,
          });
        } else {
          await createBank(payload);
          Swal.fire({
            icon: 'success',
            title: 'Bank Added!',
            timer: 2000,
          });
        }

        hideModal();
        await loadBanks(filters);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Unable to save bank',
          text:
            err?.response?.data?.message ??
            'Please check the input and try again.',
        });
      }
    },
    [
      bankNamesBaseUrl,
      createBank,
      editingBank,
      filters,
      hideModal,
      loadBanks,
      updateBank,
    ]
  );

  const handleDeleteBank = useCallback(
    async (bank) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete the bank "${bank.name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        await deleteBank(undefined, `${bankNamesBaseUrl}/${bank.id}`);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Bank has been deleted.',
          timer: 2000,
        });

        const nextPage =
          banks.length === 1 && pagination.current > 1
            ? pagination.current - 1
            : pagination.current;

        setFilters((prev) => ({
          ...prev,
          pageNo: nextPage,
        }));
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Unable to delete bank',
          text:
            err?.response?.data?.message ??
            'Please try again later.',
        });
      }
    },
    [bankNamesBaseUrl, banks.length, deleteBank, pagination.current]
  );

  const handleFilterSubmit = useCallback((values) => {
    setFilters({
      name: values.name || undefined,
      code: values.code || undefined,
      isActive:
        values.isActive === 'all' || typeof values.isActive === 'undefined'
          ? undefined
          : values.isActive,
      pageNo: 1,
      pageSize: PAGE_SIZE,
    });
  }, []);

  const handleFilterReset = useCallback(() => {
    filterForm.resetFields();
    setFilters({
      name: undefined,
      code: undefined,
      isActive: undefined,
      pageNo: 1,
      pageSize: PAGE_SIZE,
    });
  }, [filterForm]);

  const columns = useMemo(
    () => [
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        render: (value) => value || 'N/A',
      },
      {
        title: 'Bank Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        render: (value) =>
          value ? <Tag color="green">Active</Tag> : <Tag color="default">Inactive</Tag>,
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <Space size="middle">
            <CustomButton
              type="edit"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            >
              Edit
            </CustomButton>
            <CustomButton
              type="delete"
              icon={<DeleteOutlined />}
              loading={deleteLoading}
              onClick={() => handleDeleteBank(record)}
            >
              Delete
            </CustomButton>
          </Space>
        ),
      },
    ],
    [deleteLoading, handleDeleteBank, showEditModal]
  );

  if (error) {
    return <GenericErrorDisplay />;
  }

  return (
    <div>
      <h1 className="text-2xl">Banks</h1>
      <div className="text-right mb-6">
        <CustomButton
          type="primary"
          onClick={showCreateModal}
          className="w-auto bg-primary text-white"
        >
          Add Bank
        </CustomButton>
      </div>

      <Form
        form={filterForm}
        layout="vertical"
        onFinish={handleFilterSubmit}
        className="mb-6"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item label="Bank Name" name="name">
              <CustomInput type="text" placeholder="Search by name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Bank Code" name="code">
              <CustomInput type="text" placeholder="Search by code" />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Status" name="isActive">
              <Select placeholder="All Statuses" allowClear>
                <Option value="all">All</Option>
                <Option value={true}>Active</Option>
                <Option value={false}>Inactive</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Space>
              <CustomButton
                type="primary"
                htmlType="submit"
                className="w-auto bg-primary text-white"
              >
                Search
              </CustomButton>
              <CustomButton onClick={handleFilterReset}>Clear</CustomButton>
            </Space>
          </Col>
        </Row>
      </Form>

      <Table
        rowKey="id"
        dataSource={banks}
        columns={columns}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={(nextPagination) => {
          setFilters((prev) => ({
            ...prev,
            pageNo: nextPagination.current,
            pageSize: nextPagination.pageSize,
          }));
        }}
      />

      <BankNameModal
        open={isModalVisible}
        title={editingBank ? 'Edit Bank' : 'Add Bank'}
        form={form}
        onCancel={hideModal}
        onSave={handleSaveBank}
        confirmLoading={createLoading || updateLoading}
      />
    </div>
  );
};

export default BanksPage;
