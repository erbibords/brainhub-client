import React, { useMemo, useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import dayjs from 'dayjs';
import {
  Typography,
  Row,
  Col,
  Card,
  Statistic,
  Space,
  Form,
  Select,
  DatePicker,
  Button,
  Table,
  Empty,
  Alert,
  message,
} from 'antd';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DownloadOutlined } from '@ant-design/icons';
import { useBranch } from '../../contexts/branch';
import useBranches from '../../hooks/useBranches';
import useAdminReporting from '../../hooks/useAdminReporting';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const EXPENSE_TYPE_OPTIONS = [
  { label: 'All expense types', value: '' },
  { label: 'General', value: 'GENERAL' },
  { label: 'Courses', value: 'COURSES' },
  { label: 'Program', value: 'PROGRAM' },
  { label: 'Offerings', value: 'OFFERINGS' },
];

const PAYMENT_METHOD_OPTIONS = [
  { label: 'All payment methods', value: undefined },
  { label: 'Cash', value: 'CASH' },
  { label: 'Bank Transfer', value: 'BANK' },
  { label: 'Gcash', value: 'GCASH' },
  { label: 'Check', value: 'CHECK' },
];

const formatCurrency = (value) =>
  `Php ${Number(value ?? 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const aggregateByDate = (payments = [], expenses = []) => {
  const map = new Map();

  payments.forEach((payment) => {
    const dateKey = moment(payment.createdAt).format('YYYY-MM-DD');
    if (!map.has(dateKey)) {
      map.set(dateKey, { date: dateKey, payments: 0, expenses: 0 });
    }
    const entry = map.get(dateKey);
    entry.payments += Number(payment.amountPaid ?? 0);
  });

  expenses.forEach((expense) => {
    const dateKey = moment(expense.date).format('YYYY-MM-DD');
    if (!map.has(dateKey)) {
      map.set(dateKey, { date: dateKey, payments: 0, expenses: 0 });
    }
    const entry = map.get(dateKey);
    entry.expenses += Number(expense.amount ?? 0);
  });

  return Array.from(map.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
};

const AdminReporting = () => {
  const { branchId: defaultBranchId } = useBranch();
  const { data: branchesData } = useBranches();

  const [selectedBranchId, setSelectedBranchId] = useState(defaultBranchId);
  const [selectedExpenseType, setSelectedExpenseType] = useState();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
  const [dateRange, setDateRange] = useState([
    moment().subtract(6, 'day').startOf('day'),
    moment().endOf('day'),
  ]);

  const nonCentralBranches = useMemo(
    () =>
      branchesData?.data?.filter((branch) => !branch.isCentral) ?? [],
    [branchesData]
  );

  useEffect(() => {
    if (
      !selectedBranchId ||
      !nonCentralBranches.some((branch) => branch.id === selectedBranchId)
    ) {
      const fallbackBranch = nonCentralBranches[0]?.id;
      if (fallbackBranch) {
        setSelectedBranchId(fallbackBranch);
      }
    }
  }, [nonCentralBranches, selectedBranchId]);

  const reportingParams = useMemo(() => {
    if (!selectedBranchId) {
      return null;
    }

    const [start, end] = dateRange || [];
    return {
      branchId: selectedBranchId,
      startDate: start ? start.clone().startOf('day') : undefined,
      endDate: end ? end.clone().endOf('day') : undefined,
      expenseType: selectedExpenseType || undefined,
      paymentMethod: selectedPaymentMethod || undefined,
    };
  }, [dateRange, selectedBranchId, selectedExpenseType, selectedPaymentMethod]);

  const { data, error, isLoading } = useAdminReporting(reportingParams);

  const branchOptions = useMemo(
    () =>
      nonCentralBranches.map((branch) => ({
        label: branch.name,
        value: branch.id,
      })),
    [nonCentralBranches]
  );

  const comparisonData = useMemo(() => {
    if (!data) {
      return [];
    }
    return aggregateByDate(data.payments, data.expenses);
  }, [data]);

  const handleExportPDF = useCallback(() => {
    if (!data) {
      message.warning('No data available to export.');
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text('Branch Reporting Summary', 14, 18);
    doc.setFontSize(12);
    doc.text(`Branch: ${data.branch?.name ?? ''}`, 14, 26);
    const formattedRange = [
      data.filters?.startDate
        ? moment(data.filters?.startDate).format('MMM DD, YYYY hh:mmA')
        : 'N/A',
      data.filters?.endDate
        ? moment(data.filters?.endDate).format('MMM DD, YYYY hh:mmA')
        : 'N/A',
    ].join(' – ');

    doc.text(`Date Range: ${formattedRange}`, 14, 34);
    doc.text(
          `Totals | Payments: ${formatCurrency(
        data.summary?.totalPayments ?? 0
      )} • Expenses: ${formatCurrency(
        data.summary?.totalExpenses ?? 0
      )} • Net: ${formatCurrency(data.summary?.net ?? 0)}`,
      14,
      42
    );

    autoTable(doc, {
      head: [
        [
          'Payment ID',
          'Student',
          'Course',
          'School Year',
          'Amount',
          'Method',
          'Reference',
          'Paid At',
        ],
      ],
      body: data.payments.map((payment) => [
        payment.id,
        payment?.enrollment?.student?.fullName ?? '',
        payment?.enrollment?.courseOffering?.course?.name ?? '',
        payment?.enrollment?.courseOffering?.yearOffered ?? '',
        formatCurrency(payment.amountPaid ?? 0),
        payment.paymentMethod ?? '',
        payment.referenceNo ?? '',
        payment.paidAt
          ? moment(payment.paidAt).format('MMM DD, YYYY hh:mmA')
          : '',
      ]),
      startY: 52,
      styles: { fontSize: 8 },
      theme: 'grid',
      headStyles: { fillColor: [22, 119, 255] },
    });

    autoTable(doc, {
      head: [
        ['Expense ID', 'Name', 'Description', 'Type', 'Amount', 'Date', 'Entity'],
      ],
      body: data.expenses.map((expense) => [
        expense.id,
        expense.name,
        expense.description ?? '',
        expense.type,
        formatCurrency(expense.amount ?? 0),
        expense.date
          ? moment(expense.date).format('MMM DD, YYYY hh:mmA')
          : '',
        expense.entityId ?? '',
      ]),
      startY: doc.lastAutoTable.finalY + 10,
      styles: { fontSize: 8 },
      theme: 'grid',
      headStyles: { fillColor: [82, 196, 26] },
    });

    doc.save(
      `branch-reporting-${data.branch?.name ?? 'report'}-${moment().format(
        'YYYYMMDDHHmmss'
      )}.pdf`
    );
  }, [data]);

  const paymentsColumns = useMemo(
    () => [
      {
        title: 'Student',
        dataIndex: ['enrollment', 'student', 'fullName'],
        key: 'student',
      },
      {
        title: 'Course',
        key: 'course',
        render: (_, record) =>
          record?.enrollment?.courseOffering?.course?.name ?? '',
      },
      {
        title: 'School Year',
        key: 'schoolYear',
        render: (_, record) =>
          record?.enrollment?.courseOffering?.yearOffered ?? '',
      },
      {
        title: 'Amount',
        dataIndex: 'amountPaid',
        key: 'amount',
        render: (value) => formatCurrency(value ?? 0),
      },
      {
        title: 'Payment Method',
        dataIndex: 'paymentMethod',
        key: 'paymentMethod',
      },
      {
        title: 'Reference No',
        dataIndex: 'referenceNo',
        key: 'referenceNo',
      },
      {
        title: 'Paid At',
        dataIndex: 'paidAt',
        key: 'paidAt',
        render: (value) =>
          value ? moment(value).format('MMM DD, YYYY hh:mmA') : '',
      },
    ],
    []
  );

  const expensesColumns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (value) => value ?? '-',
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        render: (value) => formatCurrency(value ?? 0),
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (value) =>
          value ? moment(value).format('MMM DD, YYYY hh:mmA') : '',
      },
      {
        title: 'Related Entity ID',
        dataIndex: 'entityId',
        key: 'entityId',
        render: (value) => value ?? '-',
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Title level={2} className="mb-0">
            Branch Reporting
          </Title>
          <Paragraph type="secondary" className="mb-0">
            Compare payments and expenses for any branch within a date range.
          </Paragraph>
        </div>
        <Space>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportPDF}
            disabled={!data}
          >
            Export PDF
          </Button>
        </Space>
      </div>

      <Form layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Form.Item label="Branch" required>
              <Select
                placeholder="Select a branch"
                value={selectedBranchId}
                onChange={setSelectedBranchId}
              >
                {branchOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={10}>
            <Form.Item label="Date Range">
              <RangePicker
                value={dateRange?.map((m) =>
                  m ? dayjs(m.toDate()) : null
                )}
                onChange={(value) =>
                  setDateRange(
                    value
                      ? value.map((d) =>
                          d ? moment(d.toDate()) : null
                        )
                      : []
                  )
                }
                allowClear={false}
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={3}>
            <Form.Item label="Expense Type">
              <Select
                value={selectedExpenseType}
                onChange={setSelectedExpenseType}
              >
                {EXPENSE_TYPE_OPTIONS.map((option) => (
                  <Option key={option.label} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={3}>
            <Form.Item label="Payment Method">
              <Select
                value={selectedPaymentMethod}
                onChange={setSelectedPaymentMethod}
              >
                {PAYMENT_METHOD_OPTIONS.map((option) => (
                  <Option key={option.label} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      {error && (
        <Alert
          type="error"
          showIcon
          message="Unable to load reporting data"
          description={error?.message ?? 'Please try again shortly.'}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Payments"
              value={formatCurrency(data?.summary?.totalPayments ?? 0)}
              loading={isLoading && !data}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={formatCurrency(data?.summary?.totalExpenses ?? 0)}
              loading={isLoading && !data}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Net"
              value={formatCurrency(data?.summary?.net ?? 0)}
              valueStyle={{
                color: (data?.summary?.net ?? 0) >= 0 ? '#3f8600' : '#cf1322',
              }}
              loading={isLoading && !data}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Payments vs Expenses">
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value ?? 0)),
              name === 'payments' ? 'Payments' : 'Expenses',
            ]}
            />
            <Legend formatter={(value) => (value === 'payments' ? 'Payments' : 'Expenses')} />
            <Bar dataKey="payments" fill="#1677ff" name="Payments" />
            <Bar dataKey="expenses" fill="#fa541c" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Payments">
        <Table
          rowKey="id"
          dataSource={data?.payments ?? []}
          columns={paymentsColumns}
          loading={isLoading && !data}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="No payments found" /> }}
        />
      </Card>

      <Card title="Expenses">
        <Table
          rowKey="id"
          dataSource={data?.expenses ?? []}
          columns={expensesColumns}
          loading={isLoading && !data}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="No expenses found" /> }}
        />
      </Card>
    </div>
  );
};

export default AdminReporting;
