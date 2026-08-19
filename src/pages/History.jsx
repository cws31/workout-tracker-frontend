import React, { useEffect, useState } from 'react';
import { getScheduledWorkouts } from '../api/workoutApi';

export default function History() {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScheduledWorkouts('COMPLETED')
      .then((res) => setCompleted(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Workout History</h1>

      {loading ? (
        <div className="text-slate-400 text-sm text-center py-8">Loading history...</div>
      ) : completed.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-400 text-sm">
          No completed workouts logged in history yet.
        </div>
      ) : (
        <div className="space-y-3">
          {completed.map((item) => (
            <div key={item.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-white text-base">{item.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded">
                  {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'Completed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}