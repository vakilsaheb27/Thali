import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/db';
import { ArrowLeft } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { addDays } from 'date-fns';

export default function SubscriptionForm() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState('');
  const [plan, setPlan] = useState<'Lunch' | 'Dinner' | 'Both'>('Both');
  const [durationDays, setDurationDays] = useState(30);
  const [loading, setLoading] = useState(false);

  const students = useLiveQuery(() => db.students.toArray());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return alert('Please select a student');

    setLoading(true);
    try {
      const startDate = new Date();
      const endDate = addDays(startDate, durationDays);

      // Cancel existing active subscriptions for this student
      const existing = await db.subscriptions
        .where('studentId').equals(Number(studentId))
        .filter(s => s.status === 'Active')
        .toArray();
      
      for (const sub of existing) {
        await db.subscriptions.update(sub.id!, { status: 'Cancelled' });
      }

      await db.subscriptions.add({
        studentId: Number(studentId),
        plan,
        startDate,
        endDate,
        remainingDays: durationDays,
        status: 'Active',
        createdAt: new Date()
      });

      navigate('/subscriptions');
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('Failed to save subscription');
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
          <h1 className="text-2xl font-bold text-gray-900">New Subscription</h1>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meal Plan
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Lunch', 'Dinner', 'Both'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlan(p as any)}
                  className={`py-2 border rounded-lg font-medium transition-colors ${
                    plan === p 
                      ? 'bg-orange-50 border-orange-500 text-orange-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Days)
            </label>
            <input
              type="number"
              id="duration"
              required
              min="1"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
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
              {loading ? 'Saving...' : 'Create Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
