import React, { useEffect, useState } from 'react';
import { getUsersList, blockUnblockUser } from '../../api/adminApi';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    getUsersList(0, 10)
      .then((res) => setUsers(res.data.content || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (id, currentStatus) => {
    try {
      await blockUnblockUser(id, !currentStatus);
      fetchUsers();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Title */}
      <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
        User Management
      </h1>

      {/* Responsive Container */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-400 text-sm gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase text-[10px] sm:text-xs tracking-wider">
                <tr>
                  <th className="p-3 sm:p-4">ID</th>
                  <th className="p-3 sm:p-4">Name</th>
                  <th className="p-3 sm:p-4">Email</th>
                  <th className="p-3 sm:p-4">Role</th>
                  <th className="p-3 sm:p-4">Status</th>
                  <th className="p-3 sm:p-4 text-right sm:text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 italic">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3 sm:p-4 font-mono text-slate-400 text-xs">
                        {u.id}
                      </td>
                      <td className="p-3 sm:p-4 font-medium text-white whitespace-nowrap">
                        {u.name}
                      </td>
                      <td className="p-3 sm:p-4 truncate max-w-[150px] sm:max-w-none text-slate-300">
                        {u.email}
                      </td>
                      <td className="p-3 sm:p-4 uppercase text-[11px] font-semibold text-slate-400">
                        {u.role}
                      </td>
                      <td className="p-3 sm:p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold border ${
                            u.active
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : 'bg-red-950 text-red-400 border-red-800'
                          }`}
                        >
                          {u.active ? 'Active' : 'Blocked'}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-right sm:text-left whitespace-nowrap">
                        <button
                          onClick={() => handleToggleBlock(u.id, u.active)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all active:scale-95 ${
                            u.active
                              ? 'bg-slate-700/80 hover:bg-red-900/80 text-red-300 hover:text-white border border-slate-600 hover:border-red-700'
                              : 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 border border-emerald-700'
                          }`}
                        >
                          {u.active ? 'Block' : 'Unblock'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}