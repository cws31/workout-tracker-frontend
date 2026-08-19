import React from 'react';

export default function ExerciseCard({ exercise }) {
  if (!exercise) return null;

  const { name, category, muscleGroup, description, equipment } = exercise;

  return (
    <div className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-5 shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-white tracking-wide">{name}</h3>
        {category && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
            {category}
          </span>
        )}
      </div>

      {muscleGroup && (
        <p className="text-xs text-slate-400 mb-2">
          <strong className="text-slate-300">Target Muscle:</strong> {muscleGroup}
        </p>
      )}

      {equipment && (
        <p className="text-xs text-slate-400 mb-3">
          <strong className="text-slate-300">Equipment:</strong> {equipment}
        </p>
      )}

      {description && (
        <p className="text-sm text-slate-300 line-clamp-2 mt-2 pt-2 border-t border-slate-700/60">
          {description}
        </p>
      )}
    </div>
  );
}