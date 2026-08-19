import React from 'react';
import { Dumbbell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout, role } = useAuth();

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-3.5 sm:py-4 flex justify-between items-center text-white sticky top-0 z-50 shadow-md">
      {/* Left side: Logo & Branding */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <Dumbbell className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500 shrink-0" />
        <span className="font-bold text-base sm:text-xl tracking-wide truncate">
          Workout Tracker
        </span>
        {role === 'ADMIN' && (
          <span className="text-[10px] sm:text-xs bg-red-900/80 border border-red-700 text-red-300 px-2 py-0.5 rounded uppercase font-semibold shrink-0">
            Admin
          </span>
        )}
      </div>

      {/* Right side: Action button with touch optimization */}
      <button
        onClick={logout}
        className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-300 hover:text-red-400 active:scale-95 bg-slate-900/50 sm:bg-transparent border border-slate-700 sm:border-0 px-3 py-1.5 sm:px-0 sm:py-0 rounded-lg transition-all"
      >
        <LogOut className="h-4 w-4 text-red-400 sm:text-slate-300" />
        <span className="hidden xs:inline sm:inline">Logout</span>
      </button>
    </header>
  );
}