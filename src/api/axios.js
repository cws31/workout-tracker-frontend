import axios from 'axios';

const LOCAL_URL = 'http://localhost:8080'; 
const DEPLOYED_URL = 'https://workout-tracker-api-oyby.onrender.com';


const baseURL = process.env.NODE_ENV === 'production' ? DEPLOYED_URL : LOCAL_URL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      const cleanToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = cleanToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;