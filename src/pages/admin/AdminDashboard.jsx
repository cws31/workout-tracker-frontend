import React, { useEffect, useState } from 'react';
import { getAdminDashboard } from '../../api/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-sm">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          Loading metrics...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
        System Analytics
      </h1>

      {/* Metrics Grid: 1 col on mobile, 2 cols on tablets, 4 cols on desktops */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-800 p-4 sm:p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-slate-400 text-xs sm:text-sm font-medium">Total Users</div>
          <div className="text-2xl sm:text-3xl font-bold text-white mt-1.5">
            {stats.totalUsers}
          </div>
        </div>

        <div className="bg-slate-800 p-4 sm:p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-slate-400 text-xs sm:text-sm font-medium">Active Users</div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1.5">
            {stats.activeUsers}
          </div>
        </div>

        <div className="bg-slate-800 p-4 sm:p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-slate-400 text-xs sm:text-sm font-medium">Total Workouts</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-400 mt-1.5">
            {stats.totalWorkouts}
          </div>
        </div>

        <div className="bg-slate-800 p-4 sm:p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-slate-400 text-xs sm:text-sm font-medium">Completed Workouts</div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-400 mt-1.5">
            {stats.completedWorkouts}
          </div>
        </div>
      </div>
    </div>
  );
}