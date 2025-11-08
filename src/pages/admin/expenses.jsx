import React from 'react';
import { Typography } from 'antd';
import ExpensesList from '../expenses/expenses-list';

const { Title, Paragraph } = Typography;

const AdminExpenses = () => {
  return (
    <div className="space-y-4">
      <ExpensesList />
    </div>
  );
};

export default AdminExpenses;
