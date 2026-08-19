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
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
        Exercise Progress Tracking
      </h1>

      {/* Form: Stacks nicely on very small screens, inline on sm+ */}
      <form onSubmit={handleFetchProgress} className="flex flex-col sm:flex-row gap-3">
        <select
          className="bg-slate-800 border border-slate-700 text-white rounded-xl p-3.5 sm:p-3 text-sm flex-1 focus:outline-none focus:border-blue-500 transition shadow-lg"
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
        >
          <option value="">-- Choose an Exercise --</option>
          {exercises.map((ex) => (
            <option key={ex.exerciseId || ex.id} value={ex.exerciseId || ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading || !selectedExerciseId}
          className="bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white px-6 py-3.5 sm:py-3 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 shrink-0 text-center"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {/* Progress Cards Grid */}
      {progress && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl text-center shadow-xl">
            <div className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              Max Weight
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mt-2">
              {progress.maxWeight ?? 0} kg
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl text-center shadow-xl">
            <div className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              Avg Reps
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-2">
              {progress.avgReps ?? 0}
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl text-center shadow-xl">
            <div className="text-slate-400 text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              Total Sessions
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 mt-2">
              {progress.totalSessions ?? 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}