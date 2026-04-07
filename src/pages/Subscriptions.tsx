import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Subscriptions() {
  const [searchTerm, setSearchTerm] = useState('');

  const subscriptions = useLiveQuery(async () => {
    const subs = await db.subscriptions.reverse().toArray();
    const students = await db.students.toArray();
    const studentMap = new Map(students.map(s => [s.id, s]));

    return subs.map(sub => ({
      ...sub,
      student: studentMap.get(sub.studentId)
    })).filter(sub => 
      sub.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.student?.mobile.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
          <p className="text-gray-500 mt-1">Manage student meal plans</p>
        </div>
        <Link 
          to="/subscriptions/new" 
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Subscription
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name..."
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
                <th className="px-6 py-3 font-medium">Student</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Duration</th>
                <th className="px-6 py-3 font-medium">Remaining</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscriptions?.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{sub.student?.name}</div>
                    <div className="text-sm text-gray-500">{sub.student?.mobile}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sub.plan === 'Both' ? 'bg-purple-100 text-purple-800' :
                      sub.plan === 'Lunch' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(sub.startDate).toLocaleDateString()} - <br/>
                    {new Date(sub.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-medium ${sub.remainingDays <= 3 ? 'text-red-600' : 'text-gray-900'}`}>
                      {sub.remainingDays} days
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sub.status === 'Active' ? 'bg-green-100 text-green-800' :
                      sub.status === 'Expired' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
              {subscriptions?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No subscriptions found.
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
