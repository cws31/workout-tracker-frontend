import React, { useEffect, useState } from 'react';
import { getAllExercises } from '../api/exerciseApi';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllExercises()
      .then((res) => setExercises(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Page Header */}
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
        Exercise Library
      </h1>

      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          Loading exercise library...
        </div>
      ) : exercises.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-slate-400 text-sm shadow-xl">
          No exercises available in the library.
        </div>
      ) : (
        /* Responsive Grid: 1 col on mobile, 2 cols on tablets, 3 cols on desktops */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {exercises.map((ex) => (
            <div 
              key={ex.exerciseId || ex.id} 
              className="bg-slate-800 border border-slate-700 hover:border-slate-600 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header: Title and Category Badge */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <h3 className="font-bold text-base sm:text-lg text-white tracking-wide break-words">
                    {ex.name}
                  </h3>
                  {ex.category && (
                    <span className="self-start sm:self-auto text-[11px] sm:text-xs uppercase px-2.5 py-1 bg-blue-950 text-blue-400 border border-blue-800 rounded-full font-bold whitespace-nowrap">
                      {ex.category}
                    </span>
                  )}
                </div>

                {/* Description */}
                {ex.description && (
                  <p className="text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3">
                    {ex.description}
                  </p>
                )}
              </div>

              {/* Muscle Group Footer */}
              <div className="pt-3 border-t border-slate-700/60 text-xs text-slate-400 flex items-center justify-between">
                <span>Target Muscle:</span>
                <span className="text-slate-200 font-semibold">
                  {ex.muscelGroup || ex.muscleGroup || 'General'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}