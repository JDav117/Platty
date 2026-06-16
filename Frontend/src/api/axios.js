import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { API_URL } from '../utils/constants';

const api = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } });
api.interceptors.request.use((config) => {
  const t = useAuthStore.getState().token;
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});
api.interceptors.response.use((r) => r, (err) => {
  if (err.response?.status === 401) useAuthStore.getState().logout();
  return Promise.reject(err);
});
export default api;
