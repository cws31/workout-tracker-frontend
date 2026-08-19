import React, { useState, useEffect } from 'react';
import { getAllExercises } from '../api/exerciseApi';
import { getExerciseProgress } from '../api/workoutApi';

export default function Progress() {
  const [exercises, setExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllExercises()
      .then((res) => setExercises(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const handleFetchProgress = async (e) => {
    e.preventDefault();
    if (!selectedExerciseId) return;
    setLoading(true);

    try {
      const res = await getExerciseProgress(selectedExerciseId);
      setProgress(res.data);
    } catch (err) {
      alert('Failed to load progress metric');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Exercise Progress Tracking</h1>
      <form onSubmit={handleFetchProgress} className="flex gap-3 mb-8">
        <select
          className="bg-slate-800 border border-slate-700 text-white rounded-lg p-3 flex-1 focus:outline-none focus:border-blue-500"
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
        >
          <option value="">-- Choose an Exercise --</option>
          {exercises.map((ex) => (
            <option key={ex.exerciseId} value={ex.exerciseId}>
              {ex.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading || !selectedExerciseId}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          {loading ? 'Loading...' : 'Analyze'}
        </button>
      </form>

      {progress && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl text-center">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Max Weight</div>
            <div className="text-3xl font-bold text-blue-400 mt-2">{progress.maxWeight ?? 0} kg</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl text-center">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Avg Reps</div>
            <div className="text-3xl font-bold text-emerald-400 mt-2">{progress.avgReps ?? 0}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl text-center">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Sessions</div>
            <div className="text-3xl font-bold text-purple-400 mt-2">{progress.totalSessions ?? 0}</div>
          </div>
        </div>
      )}
    </div>
  );
}