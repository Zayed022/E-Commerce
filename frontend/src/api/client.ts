import axios from 'axios';

const API_BASE_URL = 'VITE_API_URL=https://e-commerce-30ev.onrender.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// helper to attach token
export const withAuth = (token: string | null) => {
  const instance = api.create();
  if (token) {
    instance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return instance;
};
