import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data?.success) {
      return { ...response, data: response.data.data }
    }
    return response
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    const standardizedError = {
      message: error.response?.data?.message ?? 'Network error',
      code: error.response?.data?.code ?? 'NETWORK_ERROR',
      status: status ?? 0,
      details: error.response?.data?.details ?? ''
    };

    return Promise.reject(standardizedError);
  }
)

