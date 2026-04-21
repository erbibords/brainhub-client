import { useMemo, useState } from 'react';
import { Button, Col, DatePicker, Form, Row, Select, Table } from 'antd';
import { DateTime } from 'luxon';
import CustomInput from '../../components/Input/Input';
import CustomButton from '../../components/Button/Button';
import useAuditLogs from '../../hooks/useAuditLogs';
import GenericErrorDisplay from '../../components/GenericErrorDisplay/GenericErrorDisplay';
import { formatDate } from '../../utils/formatting';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AUDIT_ACTIONS = ['CREATE', 'UPDATE', 'DELETE'];
const AUDIT_ENTITIES = ['ENROLLMENT', 'PAYMENT', 'COURSE', 'EXPENSE'];

const AuditLogsList = () => {
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filters, setFilters] = useState({
    action: undefined,
    entityType: undefined,
    search: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const params = useMemo(
    () => ({
      pageNo: currentPage,
      pageSize,
      ...filters,
    }),
    [currentPage, pageSize, filters]
  );

  const { data: auditLogs, isLoading, error } = useAuditLogs(params);

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => formatDate(value) ?? value,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Entity',
      dataIndex: 'entityType',
      key: 'entityType',
    },
    {
      title: 'Name / Ref',
      dataIndex: 'entityName',
      key: 'entityName',
      render: (value) => value || '-',
    },
    {
      title: 'Entity ID',
      dataIndex: 'entityId',
      key: 'entityId',
    },
    {
      title: 'Actor',
      dataIndex: 'actorEmail',
      key: 'actorEmail',
      render: (value, row) => value || row.actorUserId || '-',
    },
    {
      title: 'Route',
      dataIndex: 'route',
      key: 'route',
      render: (value) => value || '-',
    },
  ];

  const handleDateRangeChange = (dates) => {
    if (!dates) {
      setFilters((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
      return;
    }

    const [startDate, endDate] = dates;
    setFilters((prev) => ({
      ...prev,
      startDate: DateTime.fromJSDate(startDate.toDate()).toISO({
        includeOffset: false,
      }),
      endDate: DateTime.fromJSDate(endDate.toDate()).toISO({
        includeOffset: false,
      }),
    }));
    setCurrentPage(1);
  };

  if (error) return <GenericErrorDisplay />;

  return (
    <div>
      <h1 className="text-2xl mb-[2vh]">Audit Logs</h1>
      <Form form={form}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <p>Action</p>
            <Select
              allowClear
              size="large"
              onChange={(value) => {
                setFilters((prev) => ({ ...prev, action: value }));
                setCurrentPage(1);
              }}
            >
              {AUDIT_ACTIONS.map((action) => (
                <Option key={action} value={action}>
                  {action}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <p>Entity</p>
            <Select
              allowClear
              size="large"
              onChange={(value) => {
                setFilters((prev) => ({ ...prev, entityType: value }));
                setCurrentPage(1);
              }}
            >
              {AUDIT_ENTITIES.map((entity) => (
                <Option key={entity} value={entity}>
                  {entity}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <p>Date Range</p>
            <RangePicker
              className="h-[50px] w-full"
              onChange={handleDateRangeChange}
            />
          </Col>
          <Col span={4}>
            <p>Search</p>
            <CustomInput
              placeholder="ID, name, email, route"
              onChange={(e) => {
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value || undefined,
                }));
              }}
            />
          </Col>
          <Col span={24}>
            <CustomButton
              type="primary"
              className="bg-primary text-white"
              onClick={() => setCurrentPage(1)}
            >
              Apply Filters
            </CustomButton>
            <Button
              className="w-auto text-primary ms-2"
              htmlType="button"
              onClick={() => {
                form.resetFields();
                setCurrentPage(1);
                setPageSize(25);
                setFilters({
                  action: undefined,
                  entityType: undefined,
                  search: undefined,
                  startDate: undefined,
                  endDate: undefined,
                });
              }}
            >
              Clear
            </Button>
          </Col>
          <Col span={24}>
            <Table
              dataSource={auditLogs?.data || []}
              rowKey="id"
              columns={columns}
              loading={isLoading}
              pagination={{
                current: currentPage,
                pageSize,
                total: auditLogs?.meta?.totalResults || 0,
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['10', '25', '50', '100'],
              }}
              onChange={(pagination) => {
                setCurrentPage(pagination.current);
                setPageSize(pagination.pageSize);
              }}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AuditLogsList;
