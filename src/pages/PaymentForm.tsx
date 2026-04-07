import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { ArrowLeft } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';

export default function PaymentForm() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const students = useLiveQuery(() => db.students.toArray());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return alert('Please select a student');

    setLoading(true);
    try {
      const receiptId = `RCP-${Date.now().toString().slice(-6)}`;
      
      await db.payments.add({
        studentId: Number(studentId),
        amount: Number(amount),
        date: new Date(),
        receiptId
      });

      navigate('/payments');
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Record Payment</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">
              Select Student
            </label>
            <select
              id="student"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
            >
              <option value="">-- Select Student --</option>
              {students?.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.mobile})</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
              placeholder="Enter amount"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
