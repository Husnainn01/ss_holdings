import axios, { InternalAxiosRequestConfig } from 'axios';

// Create axios instance with base URL and default headers
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
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
};

// User API
export const userAPI = {
  getUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) => 
    api.get('/admin/users', { params }),
  
  getUser: (id: string) => 
    api.get(`/admin/users/${id}`),
  
  createUser: (userData: any) => 
    api.post('/admin/users', userData),
  
  updateUser: (id: string, userData: any) => 
    api.put(`/admin/users/${id}`, userData),
  
  deleteUser: (id: string) => 
    api.delete(`/admin/users/${id}`),
  
  getUserPermissions: (id: string) => 
    api.get(`/admin/users/${id}/permissions`),
  
  updateUserPermissions: (id: string, data: { role: string; hasCustomPermissions: boolean; permissions?: any[] }) => 
    api.put(`/admin/users/${id}/permissions`, data),
};

// Role API
export const roleAPI = {
  getRoles: () => 
    api.get('/roles'),
  
  getRole: (id: string) => 
    api.get(`/roles/${id}`),
  
  createRole: (roleData: any) => 
    api.post('/roles', roleData),
  
  updateRole: (id: string, roleData: any) => 
    api.put(`/roles/${id}`, roleData),
  
  deleteRole: (id: string) => 
    api.delete(`/roles/${id}`),
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

export default api; 