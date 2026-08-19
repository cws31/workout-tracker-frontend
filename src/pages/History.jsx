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
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
        Workout History
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          Loading history...
        </div>
      ) : completed.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-slate-400 text-sm shadow-xl">
          No completed workouts logged in history yet.
        </div>
      ) : (
        <div className="space-y-3">
          {completed.map((item) => (
            <div 
              key={item.id} 
              className="bg-slate-800 border border-slate-700 hover:border-slate-600 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-xl transition-all"
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-white tracking-wide break-words">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="self-start sm:self-auto shrink-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 bg-emerald-950 border border-emerald-800 px-3 py-1.5 rounded-full shadow-inner">
                  <span>✅</span>
                  <span>
                    {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'Completed'}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}