import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';


import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import CreateWorkout from './pages/CreateWorkout';
import Exercises from './pages/Exercises';
import Progress from './pages/Progress';
import History from './pages/History';


import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import AdminExercises from './pages/admin/AdminExercises';
import AdminWorkouts from './pages/admin/AdminWorkouts';

function Layout() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            {/* User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/create-workout" element={<CreateWorkout />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/history" element={<History />} />

            {/* Admin Dedicated Routes */}
            <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/exercises" element={<AdminExercises />} />
              <Route path="/admin/workouts" element={<AdminWorkouts />} />
            </Route>

            {/* Fallback inside Layout */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Main App Layout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<Layout />} />
      </Route>

      {/* Global Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}