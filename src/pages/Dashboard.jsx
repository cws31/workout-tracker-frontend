import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getScheduledWorkouts, getMonthlySummary } from '../api/workoutApi';

export default function Dashboard() {
  const [upcoming, setUpcoming] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();

    Promise.all([
      getScheduledWorkouts('PLANNED'),
      getMonthlySummary(month, year)
    ])
      .then(([scheduledRes, summaryRes]) => {
        setUpcoming(scheduledRes.data || []);
        setSummary(summaryRes.data || null);
      })
      .catch((err) => console.error('Failed to load dashboard data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900/80 to-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-3xl font-bold text-white tracking-wide">
            Welcome Back! 💪
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Keep up your training streak and track your progress daily.
          </p>
        </div>
        <Link
          to="/create-workout"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold px-5 py-3 sm:py-2.5 rounded-xl transition-all text-sm shrink-0 text-center shadow-lg shadow-blue-600/20"
        >
          + Plan New Workout
        </Link>
      </div>

      {/* Monthly Summary Cards */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
          This Month's Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800 border border-slate-700 p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <div className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
                Total Workouts
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-400 mt-1">
                {summary?.totalWorkouts ?? 0}
              </div>
            </div>
            <div className="bg-blue-950/60 p-3 rounded-xl border border-blue-800/50 text-blue-400 text-xl shadow-inner">
              🏋️‍♂️
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <div className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
                Total Duration
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                {summary?.totalDuration ?? 0} mins
              </div>
            </div>
            <div className="bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/50 text-emerald-400 text-xl shadow-inner">
              ⏱️
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Workouts Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Next Scheduled Sessions
          </h2>
          <Link to="/workouts" className="text-xs font-medium text-blue-400 hover:underline">
            View All
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8 text-slate-400 text-sm gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            Loading upcoming schedule...
          </div>
        ) : upcoming.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center text-slate-400 text-sm shadow-lg">
            No planned workouts scheduled. Click above to schedule one!
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((w, idx) => (
              <div 
                key={w.id || idx} 
                className="bg-slate-800 border border-slate-700 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-lg hover:border-slate-600 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-white text-base truncate">{w.title}</h3>
                  {w.description && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{w.description}</p>
                  )}
                </div>
                <div className="text-left sm:text-right text-xs text-slate-400 shrink-0">
                  <div className="font-mono text-slate-300 font-medium">
                    📅 {w.scheduledDate ? new Date(w.scheduledDate).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}