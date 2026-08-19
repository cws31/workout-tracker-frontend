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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
        System Workout Logs
      </h1>

      {/* Main Container with Responsive Table Scroll */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            Loading system workouts...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] sm:text-xs tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4">ID</th>
                  <th className="p-3 sm:p-4">User Email</th>
                  <th className="p-3 sm:p-4">Title</th>
                  <th className="p-3 sm:p-4">Scheduled Date</th>
                  <th className="p-3 sm:p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {workouts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 italic">
                      No workout records found.
                    </td>
                  </tr>
                ) : (
                  workouts.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3 sm:p-4 font-mono text-slate-400 text-xs">
                        {w.id}
                      </td>
                      <td className="p-3 sm:p-4 text-white font-medium truncate max-w-[150px] sm:max-w-none">
                        {w.email}
                      </td>
                      <td className="p-3 sm:p-4 truncate max-w-[140px] sm:max-w-none">
                        {w.title}
                      </td>
                      <td className="p-3 sm:p-4 font-mono text-xs text-slate-400 whitespace-nowrap">
                        {w.date ? new Date(w.date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs bg-blue-950 text-blue-400 border border-blue-800 font-semibold uppercase">
                          {w.status || 'PLANNED'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center bg-slate-800/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-0 border-slate-700/60">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="bg-slate-800 border border-slate-700 hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:active:scale-100 text-white px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shadow-md"
        >
          Previous
        </button>

        <span className="text-xs font-medium text-slate-400">
          Page <strong className="text-white">{page + 1}</strong> of <strong className="text-white">{totalPages}</strong>
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="bg-slate-800 border border-slate-700 hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:active:scale-100 text-white px-4 py-2.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shadow-md"
        >
          Next
        </button>
      </div>
    </div>
  );
}