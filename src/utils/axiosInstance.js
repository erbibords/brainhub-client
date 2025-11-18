import axios from 'axios';
import { BASE_URL } from '../constants';
import { getEmulatedBranch, getToken } from './token';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
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
});

export default axiosInstance;
