import axiosInstance from './axios';

export const createWorkout = (data) => axiosInstance.post('/api/workout', data);

export const getScheduledWorkouts = (status = 'PLANNED') => {
  const queryStatus = status || 'PLANNED';
  return axiosInstance.get(`/api/workout/scheduled?status=${queryStatus}`);
};

export const completeWorkout = (id, data) => 
  axiosInstance.post(`/api/workout/${id}/complete`, data);

export const getWorkoutHistory = () => axiosInstance.get('/api/workout/history');

export const getExerciseProgress = (exerciseId) => 
  axiosInstance.get(`/api/workout/progress?exerciseId=${exerciseId}`);

export const getMonthlySummary = (month, year) => 
  axiosInstance.get(`/api/workout/monthly?month=${month}&year=${year}`);

export const getLastPerformance = (exerciseId) => 
  axiosInstance.get(`/api/workout/last-performance/${exerciseId}`);