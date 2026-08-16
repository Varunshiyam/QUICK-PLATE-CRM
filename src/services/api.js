import axios from 'axios';

/**
 * API Service Layer
 * 
 * Currently uses mock data. Will be swapped to Salesforce REST API
 * once backend integration begins.
 * 
 * Architecture:
 *   React App → api.js → (mock data | Express proxy → Salesforce REST API)
 */

// Base API config (will point to Express proxy server later)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sf_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token refresh
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired — trigger refresh flow (Phase 3)
      localStorage.removeItem('sf_access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// ─── Service Modules (will be expanded) ───

export const restaurantService = {
  getAll: async () => {
    // TODO: Replace with apiClient.get('/restaurants') in Phase 3
    return [];
  },
  getById: async (id) => {
    return null;
  },
};

export const orderService = {
  create: async (orderData) => {
    return null;
  },
  getAll: async () => {
    return [];
  },
  getById: async (id) => {
    return null;
  },
};

export const authService = {
  login: async (credentials) => {
    return null;
  },
  logout: async () => {
    localStorage.removeItem('sf_access_token');
  },
};
