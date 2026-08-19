import React, { useEffect, useState } from 'react';
import { getAllExercises } from '../../api/exerciseApi';
import { createAdminExercise, deleteAdminExercise } from '../../api/adminApi';

export default function AdminExercises() {
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'strength',
    muscleGroup: '',
  });

  const fetchExercises = () => {
    getAllExercises()
      .then((res) => setExercises(res.data || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exercise?')) return;
    try {
      await deleteAdminExercise(id);
      fetchExercises();
    } catch (err) {
      alert('Failed to delete exercise');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAdminExercise(formData);
      setShowModal(false);
      setFormData({ name: '', description: '', category: 'strength', muscleGroup: '' });
      fetchExercises();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create exercise');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header section: Stacks title & add button on mobile */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
          Exercise Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold px-4 py-2.5 sm:py-2 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 text-center"
        >
          + Add New Exercise
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] sm:text-xs tracking-wider">
              <tr>
                <th className="p-3 sm:p-4">ID</th>
                <th className="p-3 sm:p-4">Name</th>
                <th className="p-3 sm:p-4">Category</th>
                <th className="p-3 sm:p-4">Muscle Group</th>
                <th className="p-3 sm:p-4 text-right sm:text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {exercises.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500 italic">
                    No exercises found.
                  </td>
                </tr>
              ) : (
                exercises.map((ex) => (
                  <tr key={ex.exerciseId} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3 sm:p-4 font-mono text-slate-400 text-xs">
                      {ex.exerciseId}
                    </td>
                    <td className="p-3 sm:p-4 font-medium text-white max-w-[150px] sm:max-w-none truncate">
                      {ex.name}
                    </td>
                    <td className="p-3 sm:p-4 uppercase text-[11px] sm:text-xs font-semibold text-blue-400">
                      {ex.category}
                    </td>
                    <td className="p-3 sm:p-4 text-slate-300">
                      {ex.muscelGroup || ex.muscleGroup}
                    </td>
                    <td className="p-3 sm:p-4 text-right sm:text-left">
                      <button
                        onClick={() => handleDelete(ex.exerciseId)}
                        className="text-xs bg-red-950/80 hover:bg-red-900 border border-red-800/80 active:scale-95 text-red-400 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile-Friendly Modal for Creating Exercise */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 p-5 sm:p-6 rounded-2xl w-full max-w-md shadow-2xl my-auto">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Create Exercise</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Name</label>
                <input
                  type="text"
                  required
                  minLength={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Category</label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Muscle Group</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chest, Legs, Back"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition"
                  value={formData.muscleGroup}
                  onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2.5 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-700/50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 active:scale-95 text-white px-5 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
                >
                  Save Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}