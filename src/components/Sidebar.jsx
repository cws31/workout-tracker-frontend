import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Dumbbell, 
  PlusCircle, 
  Activity, 
  TrendingUp, 
  History as HistoryIcon,
  Users,
  ShieldCheck,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth();

  const userNavs = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Workouts', path: '/workouts', icon: Dumbbell },
    { name: 'Create Workout', path: '/create-workout', icon: PlusCircle },
    { name: 'Exercises', path: '/exercises', icon: Activity },
    { name: 'Progress', path: '/progress', icon: TrendingUp },
    { name: 'History', path: '/history', icon: HistoryIcon },
  ];

  const adminNavs = [
    { name: 'Admin Overview', path: '/admin/dashboard', icon: ShieldCheck },
    { name: 'Manage Users', path: '/admin/users', icon: Users },
    { name: 'Manage Exercises', path: '/admin/exercises', icon: Activity },
    { name: 'Manage Workouts', path: '/admin/workouts', icon: Dumbbell },
  ];

  const links = role?.toUpperCase() === 'ADMIN' ? adminNavs : userNavs;

  return (
    <>
      {/* Mobile Backdrop overlay when sidebar is open */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed lg:static top-0 left-0 z-50 h-full lg:h-[calc(100vh-65px)]
        w-64 bg-slate-800 border-r border-slate-700 p-4 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile Close Button Header */}
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-700 lg:hidden">
          <span className="font-bold text-white text-base">Menu</span>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation links list */}
        <nav className="space-y-1.5 overflow-y-auto flex-1 pr-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose} // Auto-closes drawer on mobile when a link is clicked
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-slate-400 hover:bg-slate-700/60 hover:text-slate-200 active:scale-[0.98]'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}