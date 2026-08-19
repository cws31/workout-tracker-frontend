import React, { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../api/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <div className="text-slate-400">Loading metrics...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">System Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm">Total Users</div>
          <div className="text-3xl font-bold text-white mt-1">{stats.totalUsers}</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm">Active Users</div>
          <div className="text-3xl font-bold text-emerald-400 mt-1">{stats.activeUsers}</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm">Total Workouts</div>
          <div className="text-3xl font-bold text-blue-400 mt-1">{stats.totalWorkouts}</div>
        </div>
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
          <div className="text-slate-400 text-sm">Completed</div>
          <div className="text-3xl font-bold text-purple-400 mt-1">{stats.completedWorkouts}</div>
        </div>
      </div>
    </div>
  );
}