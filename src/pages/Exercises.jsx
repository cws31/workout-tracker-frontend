import React, { useEffect, useState } from 'react';
import { getAllExercises } from '../api/exerciseApi';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    getAllExercises()
      .then((res) => setExercises(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Exercise Library</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((ex) => (
          <div key={ex.exerciseId} className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-white">{ex.name}</h3>
              <span className="text-xs uppercase px-2 py-1 bg-blue-950 text-blue-400 border border-blue-800 rounded font-bold">
                {ex.category}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-4">{ex.description}</p>
            <div className="text-xs text-slate-500">
              Muscle Group: <span className="text-slate-300">{ex.muscelGroup}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}