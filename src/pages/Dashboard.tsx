import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Users, Utensils, IndianRupee, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const stats = useLiveQuery(async () => {
    const studentsCount = await db.students.count();
    const activeSubscriptions = await db.subscriptions.where('status').equals('Active').count();
    
    const todaysAttendance = await db.attendance.where('date').equals(today).toArray();
    const lunchCount = todaysAttendance.filter(a => a.meal === 'Lunch').length;
    const dinnerCount = todaysAttendance.filter(a => a.meal === 'Dinner').length;

    const expiringSoon = await db.subscriptions
      .where('status').equals('Active')
      .filter(sub => sub.remainingDays <= 3)
      .count();

    return {
      studentsCount,
      activeSubscriptions,
      lunchCount,
      dinnerCount,
      expiringSoon
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of today's mess operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Students" 
          value={stats?.studentsCount || 0} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Active Subscriptions" 
          value={stats?.activeSubscriptions || 0} 
          icon={IndianRupee} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Today's Meals" 
          value={`${stats?.lunchCount || 0} L / ${stats?.dinnerCount || 0} D`} 
          icon={Utensils} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Expiring Soon (≤ 3 days)" 
          value={stats?.expiringSoon || 0} 
          icon={AlertCircle} 
          color="bg-red-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/attendance" className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors">
              <Utensils className="w-8 h-8 mb-2" />
              <span className="font-medium">Mark Attendance</span>
            </a>
            <a href="/students/new" className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors">
              <Users className="w-8 h-8 mb-2" />
              <span className="font-medium">Add Student</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
      <div className={`p-4 rounded-lg ${color} text-white mr-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
