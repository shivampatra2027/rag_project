import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  let userId = localStorage.getItem('userId');

  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('userId', userId);
  }

  config.headers = config.headers || {};
  config.headers['x-user-id'] = userId;

  return config;
});

export default apiClient;
