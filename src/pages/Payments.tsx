import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState('');

  const payments = useLiveQuery(async () => {
    const pays = await db.payments.reverse().toArray();
    const students = await db.students.toArray();
    const studentMap = new Map(students.map(s => [s.id, s]));

    return pays.map(pay => ({
      ...pay,
      student: studentMap.get(pay.studentId)
    })).filter(pay => 
      pay.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.receiptId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">Record and track student payments</p>
        </div>
        <Link 
          to="/payments/new" 
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Record Payment
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student or receipt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="px-6 py-3 font-medium">Receipt ID</th>
                <th className="px-6 py-3 font-medium">Student</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments?.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-600">{payment.receiptId}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{payment.student?.name}</td>
                  <td className="px-6 py-4 font-medium text-green-600">₹{payment.amount}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(payment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        const text = `Receipt: ${payment.receiptId}\nAmount: ₹${payment.amount}\nDate: ${new Date(payment.date).toLocaleDateString()}`;
                        const url = `https://wa.me/91${payment.student?.mobile}?text=${encodeURIComponent(text)}`;
                        window.open(url, '_blank');
                      }}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
              {payments?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No payments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
