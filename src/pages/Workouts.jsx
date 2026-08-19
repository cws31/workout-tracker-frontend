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
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-white">My Scheduled Workouts</h1>
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
          {['PLANNED', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-slate-400 py-8 text-center">Loading workouts...</div>
      ) : workouts.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-400">
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
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm"
              >
                <div>
                  <h3 className="text-lg font-bold text-white">{w.title}</h3>
                  <p className="text-sm text-slate-400 mt-0.5">{w.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                    <span>
                      📅 <strong className="text-slate-300">Date:</strong>{' '}
                      {scheduledDate ? new Date(scheduledDate).toLocaleDateString() : 'N/A'}
                    </span>
                    <span>
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
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shrink-0"
                  >
                    {completingId === workoutId ? 'Updating...' : 'Mark Complete'}
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