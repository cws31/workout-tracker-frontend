import axiosInstance from './axios';

export const getAllExercises = () => axiosInstance.get('/api/exercises');