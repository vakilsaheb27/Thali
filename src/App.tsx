/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentForm from './pages/StudentForm';
import Subscriptions from './pages/Subscriptions';
import SubscriptionForm from './pages/SubscriptionForm';
import Attendance from './pages/Attendance';
import Payments from './pages/Payments';
import PaymentForm from './pages/PaymentForm';
import Expenses from './pages/Expenses';
import ExpenseForm from './pages/ExpenseForm';
import Reports from './pages/Reports';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          
          <Route path="students" element={<Students />} />
          <Route path="students/new" element={<StudentForm />} />
          <Route path="students/:id/edit" element={<StudentForm />} />
          
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="subscriptions/new" element={<SubscriptionForm />} />
          
          <Route path="attendance" element={<Attendance />} />
          
          <Route path="payments" element={<Payments />} />
          <Route path="payments/new" element={<PaymentForm />} />
          
          <Route path="expenses" element={<Expenses />} />
          <Route path="expenses/new" element={<ExpenseForm />} />
          
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
