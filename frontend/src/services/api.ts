import axios, { InternalAxiosRequestConfig } from 'axios';

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // If NEXT_PUBLIC_API_URL is set, use it (for production)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // For development, check if we're running locally
  if (typeof window !== 'undefined') {
    // Client-side: check the current origin
    if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')) {
      return 'http://localhost:5001/api';
    }
  } else {
    // Server-side: check NODE_ENV
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:5001/api';
    }
  }
  
  // Default to production
  return 'https://ssholdings-production.up.railway.app/api';
};

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminAuth');
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
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  checkAuth: () => 
    api.get('/auth/me'),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.put('/auth/change-password', data),
  
  updateProfile: (data: { name: string; email: string }) => 
    api.put('/auth/update-profile', data),
  
  verifyTurnstile: (token: string) => 
    api.post('/auth/verify-turnstile', { token }),
};

// User API
export const userAPI = {
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) => 
    api.get('/admin/users', { params }),
  
  getUser: (id: string) => 
    api.get(`/admin/users/${id}`),
  
  createUser: (userData: any) => 
    api.post('/auth/register', userData),
  
  updateUser: (id: string, userData: any) => 
    api.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id: string) => 
    api.delete(`/admin/users/${id}`),
  
  getUserPermissions: (id: string) => 
    api.get(`/admin/users/${id}/permissions`),
  
  updateUserRole: (id: string, role: string) => 
    api.put(`/roles/user/${id}/role`, { role }),
  
  updateUserPermissions: (id: string, permissions: string[]) => 
    api.put(`/roles/user/${id}/permissions`, { permissions }),
};

// Role API
export const roleAPI = {
  getRoles: () => 
    api.get('/roles'),
  
  getPermissions: () => 
    api.get('/roles/permissions'),
  
  updateUserRole: (id: string, role: string) => 
    api.put(`/roles/user/${id}/role`, { role }),
  
  updateUserPermissions: (id: string, permissions: string[]) => 
    api.put(`/roles/user/${id}/permissions`, { permissions }),
};

// Vehicle API
export const vehicleAPI = {
  getVehicles: (params?: any) => 
    api.get('/vehicles', { params }),
  
  getVehicle: (id: string) => 
    api.get(`/vehicles/${id}`),
  
  getRecentVehicles: (limit: number = 10) => 
    api.get('/vehicles/recent/list', { params: { limit } }),
  
  getVehicleLocations: () =>
    api.get('/vehicles/locations/list'),
  
  getModelsByMake: (make: string) =>
    api.get(`/vehicles/models/${encodeURIComponent(make)}`),
  
  createVehicle: (vehicleData: FormData) => {
    // For FormData, don't set Content-Type, let the browser set it with boundary
    return api.post('/admin/vehicles', vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  updateVehicle: (id: string, vehicleData: FormData) => {
    // For FormData, don't set Content-Type, let the browser set it with boundary
    return api.put(`/admin/vehicles/${id}`, vehicleData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  deleteVehicle: (id: string) => 
    api.delete(`/admin/vehicles/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () =>
    api.get('/admin/dashboard/stats'),
  
  getTopBrands: () =>
    api.get('/admin/dashboard/top-brands'),
  
  getRecentActivity: (limit: number = 10) =>
    api.get('/admin/dashboard/recent-activity', { params: { limit } }),
  
  getUserActivityStats: () =>
    api.get('/admin/dashboard/user-activity-stats'),
  
  getMostActiveUsers: (limit: number = 5) =>
    api.get('/admin/dashboard/most-active-users', { params: { limit } }),
  
  getVehicleStats: () =>
    api.get('/admin/dashboard/vehicle-stats'),
  
  getSftpUsageStats: (days: number = 7) =>
    api.get('/admin/dashboard/sftp-usage', { params: { days } }),
  
  getRecentSftpUploads: (limit: number = 10) =>
    api.get('/admin/dashboard/recent-sftp-uploads', { params: { limit } }),
};

export default api; 