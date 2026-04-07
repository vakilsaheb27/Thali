import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function Reports() {
  const [period, setPeriod] = useState<'month' | 'all'>('month');

  const stats = useLiveQuery(async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let payments = await db.payments.toArray();
    let expenses = await db.expenses.toArray();

    if (period === 'month') {
      payments = payments.filter(p => new Date(p.date) >= startOfMonth);
      expenses = expenses.filter(e => new Date(e.date) >= startOfMonth);
    }

    const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const profit = totalIncome - totalExpense;

    return { totalIncome, totalExpense, profit };
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-500 mt-1">Track income, expenses, and profit</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium"
        >
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 rounded-lg text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats?.totalIncome || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-100 rounded-lg text-red-600">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats?.totalExpense || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-lg ${
              (stats?.profit || 0) >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
            }`}>
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Net Profit</p>
              <p className={`text-2xl font-bold ${
                (stats?.profit || 0) >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                ₹{stats?.profit || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add more detailed reports here if needed */}
    </div>
  );
}
