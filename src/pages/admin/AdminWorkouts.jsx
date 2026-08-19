import React, { useEffect, useState } from 'react';
import { getAdminWorkouts } from '../../api/adminApi';

export default function AdminWorkouts() {
  const [workouts, setWorkouts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchWorkouts = (pageNumber) => {
    setLoading(true);
    getAdminWorkouts(pageNumber, 10)
      .then((res) => {
        setWorkouts(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWorkouts(page);
  }, [page]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">System Workout Logs</h1>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="text-slate-400 p-8 text-center">Loading system workouts...</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">User Email</th>
                <th className="p-4">Title</th>
                <th className="p-4">Scheduled Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {workouts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-400">No workout records found.</td>
                </tr>
              ) : (
                workouts.map((w) => (
                  <tr key={w.id}>
                    <td className="p-4 font-mono text-slate-400">{w.id}</td>
                    <td className="p-4 text-white font-medium">{w.email}</td>
                    <td className="p-4">{w.title}</td>
                    <td className="p-4 font-mono text-xs">{w.date ? new Date(w.date).toLocaleDateString() : 'N/A'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-950 text-blue-400 border border-blue-800 font-semibold">
                        {w.status || 'PLANNED'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-2 rounded text-xs font-semibold transition"
        >
          Previous
        </button>
        <span className="text-xs text-slate-400">
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-2 rounded text-xs font-semibold transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}