import React, { useMemo, useState } from 'react';
import { Typography, Button, Spin, Alert, Empty, Card, Space } from 'antd';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import useAdminAnalytics from '../../hooks/useAdminAnalytics';

const { Title, Paragraph } = Typography;

const RANGE_OPTIONS = [
  { label: '7 days', value: '7d' },
  { label: '15 days', value: '15d' },
  { label: '1 month', value: '1m' },
  { label: '1 year', value: '1y' },
];

const COLOR_PALETTE = [
  '#1677ff',
  '#52c41a',
  '#faad14',
  '#eb2f96',
  '#13c2c2',
  '#722ed1',
  '#fa541c',
  '#2f54eb',
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(value ?? 0);

const transformSeries = (series) => {
  if (!series || series.length === 0) {
    return { chartData: [], lines: [] };
  }

  const dates = series[0]?.series?.map((bucket) => bucket.date) ?? [];

  const chartData = dates.map((date, index) => {
    const point = { date };
    series.forEach((branch) => {
      const bucket = branch.series?.[index];
      point[branch.branchName] = bucket ? Number(bucket.value ?? 0) : 0;
    });
    return point;
  });

  const lines = series.map((branch, index) => ({
    key: branch.branchId,
    name: branch.branchName,
    color: COLOR_PALETTE[index % COLOR_PALETTE.length],
  }));

  return { chartData, lines };
};

const AnalyticsChart = ({
  title,
  subtitle,
  dataSource,
  loading,
  formatter,
}) => {
  const { chartData, lines } = useMemo(
    () => transformSeries(dataSource),
    [dataSource]
  );

  if (loading) {
    return (
      <Card title={title} bordered={false}>
        <Spin />
      </Card>
    );
  }

  if (!chartData.length || !lines.length) {
    return (
      <Card title={title} bordered={false}>
        {subtitle && (
          <Paragraph type="secondary" className="mb-4">
            {subtitle}
          </Paragraph>
        )}
        <Empty description="No data for the selected range" />
      </Card>
    );
  }

  return (
    <Card title={title} bordered={false}>
      {subtitle && (
        <Paragraph type="secondary" className="mb-4">
          {subtitle}
        </Paragraph>
      )}
      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals />
          <Tooltip
            formatter={(value) =>
              formatter ? formatter(Number(value)) : Number(value ?? 0)
            }
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

const Dashboard = () => {
  const [range, setRange] = useState('7d');
  const { data, error, isLoading } = useAdminAnalytics(range);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Title level={2} className="mb-0">
            Dashboard
          </Title>
          <Paragraph type="secondary" className="mb-0">
            Monitor branch performance across revenue, expenses, and
            enrollments.
          </Paragraph>
        </div>
        <Button.Group>
          {RANGE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type={range === option.value ? 'primary' : 'default'}
              onClick={() => setRange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </Button.Group>
      </div>

      {error && (
        <Alert
          type="error"
          message="Unable to load analytics data"
          description={error?.message || 'Please try again shortly.'}
          showIcon
        />
      )}

      <Space direction="vertical" size="large" className="w-full">
        <AnalyticsChart
          title="Revenue by Branch"
          subtitle="Aggregated payment totals within the selected date range."
          dataSource={data?.revenue}
          loading={isLoading && !data}
          formatter={formatCurrency}
        />
        <AnalyticsChart
          title="Expenses by Branch"
          subtitle="General expenses recorded per branch (central branch excluded)."
          dataSource={data?.expenses}
          loading={isLoading && !data}
          formatter={formatCurrency}
        />
        <AnalyticsChart
          title="Enrollments by Branch"
          subtitle="Count of new enrollments captured in the selected period."
          dataSource={data?.enrollments}
          loading={isLoading && !data}
        />
      </Space>
    </div>
  );
};

export default Dashboard;
