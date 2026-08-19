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
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Exercise Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
        >
          + Add New Exercise
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Muscle Group</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {exercises.map((ex) => (
              <tr key={ex.exerciseId}>
                <td className="p-4 font-mono text-slate-400">{ex.exerciseId}</td>
                <td className="p-4 font-medium text-white">{ex.name}</td>
                <td className="p-4 uppercase text-xs font-semibold text-blue-400">{ex.category}</td>
                <td className="p-4">{ex.muscelGroup || ex.muscleGroup}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(ex.exerciseId)}
                    className="text-xs bg-red-950 hover:bg-red-900 border border-red-800 text-red-400 px-3 py-1.5 rounded transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Creating Exercise */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Create Exercise</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Name</label>
                <input
                  type="text"
                  required
                  minLength={5}
                  className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Description</label>
                <textarea
                  required
                  className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Category</label>
                <select
                  className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white text-sm"
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
                  className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white text-sm"
                  value={formData.muscleGroup}
                  onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                />
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-xs font-semibold"
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