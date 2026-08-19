import React, { useEffect, useState } from 'react';
import { getScheduledWorkouts, completeWorkout } from '../api/workoutApi';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('PLANNED');
  const [loading, setLoading] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  const fetchWorkouts = async (status) => {
    setLoading(true);
    try {
      const res = await getScheduledWorkouts(status);
      setWorkouts(res.data || []);
    } catch (err) {
      console.error('Failed to load workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts(filterStatus);
  }, [filterStatus]);

  const handleMarkComplete = async (id) => {
    setCompletingId(id);
    try {
      const payload = { notes: 'Completed via Workouts View', duration: 45 };
      const res = await completeWorkout(id, payload);
      
      const prs = res.data?.newPersonalRecords || [];
      if (prs.length > 0) {
        alert(`🏆 AMAZING JOB! NEW PERSONAL RECORD(S)!\n\n${prs.join('\n')}`);
      } else {
        alert('Workout marked as completed successfully!');
      }

      fetchWorkouts(filterStatus);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete workout');
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header & Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          My Scheduled Workouts
        </h1>
        
        {/* Responsive Filter Segmented Control */}
        <div className="w-full sm:w-auto flex bg-slate-800 p-1 rounded-xl border border-slate-700 shadow-lg">
          {['PLANNED', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          Loading workouts...
        </div>
      ) : workouts.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-slate-400 text-sm shadow-xl">
          No workouts found under status: <span className="text-slate-200 font-semibold">{filterStatus}</span>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((w, index) => {
            const workoutId = w.id || index;
            const scheduledDate = w.scheduledDate || w.scheduled_date;
            const scheduledTime = w.scheduledTime || w.scheduled_time;

            return (
              <div
                key={workoutId}
                className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl transition-all"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide break-words">
                    {w.title}
                  </h3>
                  {w.description && (
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {w.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      📅 <strong className="text-slate-300">Date:</strong>{' '}
                      {scheduledDate ? new Date(scheduledDate).toLocaleDateString() : 'N/A'}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      🕒 <strong className="text-slate-300">Time:</strong>{' '}
                      {scheduledTime ? new Date(scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </span>
                  </div>
                </div>

                {filterStatus === 'PLANNED' && (
                  <button
                    type="button"
                    onClick={() => handleMarkComplete(workoutId)}
                    disabled={completingId === workoutId}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white px-5 py-3 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 shadow-lg shadow-emerald-600/20 text-center"
                  >
                    {completingId === workoutId ? 'Updating...' : '✓ Mark Complete'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}