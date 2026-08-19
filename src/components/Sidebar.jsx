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
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
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

  const links = role === 'ADMIN' ? adminNavs : userNavs;

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-[calc(100vh-65px)] p-4">
      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}