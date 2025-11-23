import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

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
