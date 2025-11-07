import axios from 'axios';
import { store } from '../app/store';
import { refreshTokenThunk } from '../features/auth/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // for cookies
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const res = await store.dispatch(refreshTokenThunk());
      if (res.meta.requestStatus === 'fulfilled') {
        const token = res.payload.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
