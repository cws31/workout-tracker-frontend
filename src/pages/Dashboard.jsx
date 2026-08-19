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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome Back! 💪</h1>
          <p className="text-slate-300 text-sm mt-1">Keep up your training streak and track your progress daily.</p>
        </div>
        <Link
          to="/create-workout"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm shrink-0"
        >
          + Plan New Workout
        </Link>
      </div>

      {/* Monthly Summary Cards */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">This Month's Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-xs font-semibold uppercase">Total Workouts</div>
              <div className="text-3xl font-bold text-blue-400 mt-1">{summary?.totalWorkouts ?? 0}</div>
            </div>
            <div className="bg-blue-950/60 p-3 rounded-lg border border-blue-800/50 text-blue-400 text-xl">
              🏋️‍♂️
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-xs font-semibold uppercase">Total Duration</div>
              <div className="text-3xl font-bold text-emerald-400 mt-1">{summary?.totalDuration ?? 0} mins</div>
            </div>
            <div className="bg-emerald-950/60 p-3 rounded-lg border border-emerald-800/50 text-emerald-400 text-xl">
              ⏱️
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Workouts Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Next Scheduled Sessions</h2>
          <Link to="/workouts" className="text-xs text-blue-400 hover:underline">View All</Link>
        </div>

        {loading ? (
          <div className="text-slate-400 text-sm text-center py-6">Loading upcoming schedule...</div>
        ) : upcoming.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center text-slate-400 text-sm">
            No planned workouts scheduled. Click above to schedule one!
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((w, idx) => (
              <div key={w.id || idx} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white text-base">{w.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{w.description}</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div className="font-mono text-slate-300">
                    {w.scheduledDate ? new Date(w.scheduledDate).toLocaleDateString() : 'N/A'}
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