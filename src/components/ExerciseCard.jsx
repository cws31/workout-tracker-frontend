import React from 'react';

export default function ExerciseCard({ exercise }) {
  if (!exercise) return null;

  const { name, category, muscleGroup, description, equipment } = exercise;

  return (
    <div className="bg-slate-800 border border-slate-700 active:scale-[0.99] sm:hover:border-slate-600 rounded-xl p-4 sm:p-5 shadow-lg transition-all duration-200">
      {/* Header section: Handles long names gracefully on small screens */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-wide break-words">
          {name}
        </h3>
        {category && (
          <span className="self-start sm:self-auto text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800 whitespace-nowrap">
            {category}
          </span>
        )}
      </div>

      {/* Metadata tags */}
      <div className="space-y-1 text-xs sm:text-sm text-slate-400">
        {muscleGroup && (
          <p className="truncate">
            <strong className="text-slate-300">Target Muscle:</strong> {muscleGroup}
          </p>
        )}

        {equipment && (
          <p className="truncate">
            <strong className="text-slate-300">Equipment:</strong> {equipment}
          </p>
        )}
      </div>

      {/* Description section */}
      {description && (
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-3 pt-3 border-t border-slate-700/60 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}