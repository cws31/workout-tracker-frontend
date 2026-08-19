import React from 'react';
import { Dumbbell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout, role } = useAuth();

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center text-white">
      <div className="flex items-center gap-3">
        <Dumbbell className="h-7 w-7 text-blue-500" />
        <span className="font-bold text-xl tracking-wide">Workout Tracker</span>
        {role === 'ADMIN' && (
          <span className="ml-2 text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded uppercase font-semibold">
            Admin Panel
          </span>
        )}
      </div>
      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm text-slate-300 hover:text-red-400 transition"
      >
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </header>
  );
}