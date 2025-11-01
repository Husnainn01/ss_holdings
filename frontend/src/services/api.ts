import axios, { InternalAxiosRequestConfig } from 'axios';
import { getItem } from '@/lib/localStorage';
import config, { getApiBaseUrl } from '@/config';


// Get the API base URL
const apiBaseUrl = getApiBaseUrl();

// Log which API URL is being used
console.log('API is connecting to:', apiBaseUrl);

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      const token = getItem('adminAuth');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping auth login API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.post('/auth/login', { email, password });
  },
  
  checkAuth: () => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping auth checkAuth API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.get('/auth/me');
  },
  
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping auth changePassword API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.put('/auth/change-password', data);
  },
  
  updateProfile: (data: { name: string; email: string }) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping auth updateProfile API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.put('/auth/update-profile', data);
  },
  
  verifyTurnstile: (token: string) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping auth verifyTurnstile API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.post('/auth/verify-turnstile', { token });
  },
};

// User API
export const userAPI = {
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping user getUsers API call during server-side rendering');
      return Promise.resolve({ data: { users: [], total: 0 } });
    }
    return api.get('/admin/users', { params });
  },
  
  getUser: (id: string) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping user getUser API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.get(`/admin/users/${id}`);
  },
  
  createUser: (userData: any) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping user createUser API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.post('/auth/register', userData);
  },
  
  updateUser: (id: string, userData: any) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping user updateUser API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.put(`/admin/users/${id}`, userData);
  },
  
  deleteUser: (id: string) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping user deleteUser API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.delete(`/admin/users/${id}`);
  },
  
  getUserPermissions: (id: string) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping user getUserPermissions API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.get(`/admin/users/${id}/permissions`);
  },
  
  updateUserRole: (id: string, role: string) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping user updateUserRole API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.put(`/roles/user/${id}/role`, { role });
  },
  
  updateUserPermissions: (id: string, permissions: string[]) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping user updateUserPermissions API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.put(`/roles/user/${id}/permissions`, { permissions });
  },
};

// Role API
export const roleAPI = {
  getRoles: () => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping role getRoles API call during server-side rendering');
      return Promise.resolve({ data: [] });
    }
    return api.get('/roles');
  },
  
  getPermissions: () => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping role getPermissions API call during server-side rendering');
      return Promise.resolve({ data: [] });
    }
    return api.get('/roles/permissions');
  },
  
  updateUserRole: (id: string, role: string) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping role updateUserRole API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.put(`/roles/user/${id}/role`, { role });
  },
  
  updateUserPermissions: (id: string, permissions: string[]) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping role updateUserPermissions API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.put(`/roles/user/${id}/permissions`, { permissions });
  },
};

// Vehicle API
export const vehicleAPI = {
  getVehicles: (params?: any) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping getVehicles API call during server-side rendering');
      return Promise.resolve({ data: { vehicles: [], total: 0 } });
    }
    return api.get('/vehicles', { params });
  },
  
  getVehicle: (id: string) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping getVehicle API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.get(`/vehicles/${id}`);
  },
  
  getRecentVehicles: (limit: number = 10) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping getRecentVehicles API call during server-side rendering');
      return Promise.resolve({ data: [] });
    }
    return api.get('/vehicles/recent/list', { params: { limit } });
  },
  
  getVehicleLocations: () => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping getVehicleLocations API call during server-side rendering');
      return Promise.resolve({ data: [] });
    }
    return api.get('/vehicles/locations/list');
  },
  
  getModelsByMake: (make: string) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping getModelsByMake API call during server-side rendering');
      return Promise.resolve({ data: [] });
    }
    return api.get(`/vehicles/models/${encodeURIComponent(make)}`);
  },
  
  createVehicle: (vehicleData: FormData) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping createVehicle API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    // For FormData, don't set Content-Type, let the browser set it with boundary
    return api.post('/admin/vehicles', vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  updateVehicle: (id: string, vehicleData: FormData) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping updateVehicle API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    // For FormData, don't set Content-Type, let the browser set it with boundary
    return api.put(`/admin/vehicles/${id}`, vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  deleteVehicle: (id: string) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping deleteVehicle API call during server-side rendering');
      return Promise.resolve({ data: null });
    }
    return api.delete(`/admin/vehicles/${id}`);
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping dashboard getStats API call during server-side rendering');
      return Promise.resolve({ data: {} });
    }
    return api.get('/admin/dashboard/stats');
  },
  
  getTopBrands: () => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping dashboard getTopBrands API call during server-side rendering');
      return Promise.resolve({ data: [] });
    }
    return api.get('/admin/dashboard/top-brands');
  },
  
  getRecentActivity: (limit: number = 10) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping dashboard getRecentActivity API call during server-side rendering');
      return Promise.resolve({ data: [] });
    }
    return api.get('/admin/dashboard/recent-activity', { params: { limit } });
  },
  
  getUserActivityStats: () => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping dashboard getUserActivityStats API call during server-side rendering');
      return Promise.resolve({ data: {} });
    }
    return api.get('/admin/dashboard/user-activity-stats');
  },
  
  getMostActiveUsers: (limit: number = 5) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping dashboard getMostActiveUsers API call during server-side rendering');
      return Promise.resolve({ data: [] });
    }
    return api.get('/admin/dashboard/most-active-users', { params: { limit } });
  },
  
  getVehicleStats: () => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping dashboard getVehicleStats API call during server-side rendering');
      return Promise.resolve({ data: {} });
    }
    return api.get('/admin/dashboard/vehicle-stats');
  },
  
  getSftpUsageStats: (days: number = 7) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping dashboard getSftpUsageStats API call during server-side rendering');
      return Promise.resolve({ data: {} });
    }
    return api.get('/admin/dashboard/sftp-usage', { params: { days } });
  },
  
  getRecentSftpUploads: (limit: number = 10) => {
    // Skip API calls during server-side rendering
    if (typeof window === 'undefined') {
      console.log('Skipping dashboard getRecentSftpUploads API call during server-side rendering');
      return Promise.resolve({ data: [] });
    }
    return api.get('/admin/dashboard/recent-sftp-uploads', { params: { limit } });
  },
};

export default api; 