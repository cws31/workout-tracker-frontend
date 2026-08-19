import React from 'react';

export default function WorkoutCard({ workout, onComplete, onDelete }) {
  if (!workout) return null;

  const { id, title, description, scheduled_date, scheduledDate, staus, status, exercises, workoutExercises } = workout;

  const currentStatus = staus || status || 'PLANNED';
  const displayDate = scheduled_date || scheduledDate;
  
  const exerciseList = exercises || workoutExercises || [];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {displayDate && (
            <p className="text-xs text-slate-400 mt-1">
              📅 {new Date(displayDate).toLocaleDateString()} at {new Date(displayDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border ${
            currentStatus === 'COMPLETED'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-amber-950 text-amber-400 border-amber-800'
          }`}
        >
          {currentStatus}
        </span>
      </div>

      {description && <p className="text-sm text-slate-300">{description}</p>}

      {exerciseList.length > 0 && (
        <div className="pt-3 border-t border-slate-700/60">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Exercises & Sets</h4>
          <div className="space-y-3">
            {exerciseList.map((item, idx) => (
              <div key={idx} className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/40 text-xs text-slate-300">
                <div className="font-semibold text-white mb-1.5 flex justify-between">
                  <span>{item.name || item.exercise?.name}</span>
                </div>
                
                {/* Multi-set breakdown list */}
                {item.sets && item.sets.length > 0 ? (
                  <div className="space-y-1 pl-2 border-l-2 border-blue-500/40">
                    {item.sets.map((set, setIdx) => (
                      <div key={setIdx} className="flex justify-between text-slate-400 font-mono">
                        <span>
                          Set {set.setNumber || setIdx + 1} 
                          <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {set.setType || 'WORKING'}
                          </span>
                        </span>
                        <span className="text-slate-200">
                          {set.reps} reps @ {set.weight} kg
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic pl-2">No sets recorded</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(onComplete || onDelete) && (
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-700/60">
          {onComplete && currentStatus !== 'COMPLETED' && (
            <button
              onClick={() => onComplete(id)}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1.5 rounded transition"
            >
              Mark Complete
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="text-xs bg-slate-700 hover:bg-red-600/80 text-red-300 hover:text-white font-medium px-3 py-1.5 rounded transition"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}