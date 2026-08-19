import React, { useEffect, useState } from 'react';
import { getUsersList, blockUnblockUser } from '../../api/adminApi';

export default function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    getUsersList(0, 10)
      .then((res) => setUsers(res.data.content || []))
      .catch((err) => console.error(err));
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
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="p-4 font-mono">{u.id}</td>
                <td className="p-4 font-medium text-white">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">{u.role}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs ${u.active ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                    {u.active ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => handleToggleBlock(u.id, u.active)}
                    className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition text-white"
                  >
                    {u.active ? 'Block' : 'Unblock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}