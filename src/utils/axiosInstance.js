import axios from 'axios';
import { BASE_URL } from '../constants';
import { getEmulatedBranch, getToken } from './token';

// Set to true to disable all API calls
export const DISABLE_API_CALLS = false;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Block all API calls if disabled
    if (DISABLE_API_CALLS) {
      console.warn('API calls are disabled. Request blocked for:', config.url);
      return Promise.reject(new Error('API calls are disabled'));
    }

    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const emulatedBranch = getEmulatedBranch();
    if (emulatedBranch?.id) {
      config.headers['x-emulated-branch-id'] = emulatedBranch.id;
    } else if (config.headers['x-emulated-branch-id']) {
      delete config.headers['x-emulated-branch-id'];
    }

    // Remove Content-Type header for FormData to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
