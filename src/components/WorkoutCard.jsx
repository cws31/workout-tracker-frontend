import React from 'react';

export default function WorkoutCard({ workout, onComplete, onDelete }) {
  if (!workout) return null;

  const { id, title, description, scheduled_date, scheduledDate, staus, status, exercises, workoutExercises } = workout;

  const currentStatus = staus || status || 'PLANNED';
  const displayDate = scheduled_date || scheduledDate;
  const exerciseList = exercises || workoutExercises || [];

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 shadow-lg space-y-4 transition-all">
      {/* Header: Stacks nicely on very small screens if titles are long */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2.5">
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-wide break-words">
            {title}
          </h3>
          {displayDate && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>📅</span>
              <span>
                {new Date(displayDate).toLocaleDateString()} at{' '}
                {new Date(displayDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </p>
          )}
        </div>
        <span
          className={`self-start sm:self-auto text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${
            currentStatus === 'COMPLETED'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-amber-950 text-amber-400 border-amber-800'
          }`}
        >
          {currentStatus}
        </span>
      </div>

      {description && <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{description}</p>}

      {/* Exercises Section */}
      {exerciseList.length > 0 && (
        <div className="pt-3 border-t border-slate-700/60">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Exercises & Sets
          </h4>
          <div className="space-y-2.5">
            {exerciseList.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/40 text-xs text-slate-300"
              >
                <div className="font-semibold text-white mb-2 flex justify-between items-center">
                  <span className="truncate pr-2">{item.name || item.exercise?.name}</span>
                </div>
                
                {/* Multi-set breakdown list */}
                {item.sets && item.sets.length > 0 ? (
                  <div className="space-y-1.5 pl-2.5 border-l-2 border-blue-500/40">
                    {item.sets.map((set, setIdx) => (
                      <div 
                        key={setIdx} 
                        className="flex flex-col xs:flex-row xs:justify-between xs:items-center text-slate-400 font-mono gap-0.5 xs:gap-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300 font-medium">
                            Set {set.setNumber || setIdx + 1}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                            {set.setType || 'WORKING'}
                          </span>
                        </div>
                        <span className="text-slate-200 font-semibold mt-0.5 xs:mt-0">
                          {set.reps} reps @ {set.weight} kg
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic pl-2.5">No sets recorded</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons: Responsive full-width on mobile, auto-width on desktop */}
      {(onComplete || onDelete) && (
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t border-slate-700/60">
          {onComplete && currentStatus !== 'COMPLETED' && (
            <button
              onClick={() => onComplete(id)}
              className="w-full sm:w-auto text-xs bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-medium px-4 py-2.5 sm:py-1.5 rounded-lg transition-all text-center shadow-md shadow-emerald-900/20"
            >
              Mark Complete
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="w-full sm:w-auto text-xs bg-slate-700/80 hover:bg-red-600/80 active:scale-[0.98] text-red-300 hover:text-white font-medium px-4 py-2.5 sm:py-1.5 rounded-lg transition-all text-center"
            >
              Delete Workout
            </button>
          )}
        </div>
      )}
    </div>
  );
}