import axiosInstance from './axios';

export const getAdminDashboard = () => axiosInstance.get('/api/admin/dashboard');
export const getUsersList = (page = 0, size = 10, search = '') => 
  axiosInstance.get(`/api/admin/users?page=${page}&size=${size}&search=${search}`);
export const blockUnblockUser = (id, active) => 
  axiosInstance.patch(`/api/admin/users/${id}/block`, { active });
export const createAdminExercise = (data) => axiosInstance.post('/api/admin/exercises', data);
export const deleteAdminExercise = (id) => axiosInstance.delete(`/api/admin/exercises/${id}`);
export const getAdminWorkouts = (page = 0, size = 10, status = '') => 
  axiosInstance.get(`/api/admin/workouts?page=${page}&size=${size}&status=${status}`);