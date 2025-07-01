import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Define Option interface
export interface Option {
  _id: string;
  name: string;
  category: string;
  isActive: boolean;
  order: number;
  imageUrl?: string;
  svgUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define category types
export type OptionCategory = 
  | 'features'
  | 'safetyFeatures'
  | 'makes'
  | 'bodyTypes'
  | 'fuelTypes'
  | 'transmissionTypes'
  | 'driveTypes'
  | 'conditionTypes'
  | 'months'
  | 'offerTypes';

// Get options by category (public endpoint - no auth required)
export const getOptionsByCategory = async (category: OptionCategory): Promise<Option[]> => {
  try {
    const response = await axios.get(`${API_URL}/options/category/${category}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${category} options:`, error);
    return [];
  }
};

// Create option without authentication (for testing only)
export const createOptionNoAuth = async (option: Omit<Option, '_id'>): Promise<Option | null> => {
  try {
    // This is a temporary function for testing
    // In production, this should always use authentication
    const response = await axios.post(`${API_URL}/options`, option);
    return response.data.data;
  } catch (error) {
    console.error('Error creating option:', error);
    return null;
  }
};

// Get all options (admin)
export const getAllOptions = async (
  category?: OptionCategory,
  page: number = 1,
  limit: number = 50
): Promise<{ data: Option[]; pagination: any }> => {
  try {
    const token = localStorage.getItem('adminAuth');
    if (!token) throw new Error('No authentication token');

    let url = `${API_URL}/options?page=${page}&limit=${limit}`;
    if (category) url += `&category=${category}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return {
      data: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Error fetching options:', error);
    return { data: [], pagination: { page: 1, limit, total: 0, pages: 0 } };
  }
};

// Get single option
export const getOption = async (id: string): Promise<Option | null> => {
  try {
    const token = localStorage.getItem('adminAuth');
    if (!token) throw new Error('No authentication token');

    const response = await axios.get(`${API_URL}/options/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching option:', error);
    return null;
  }
};

// Create option
export const createOption = async (option: Omit<Option, '_id'>): Promise<Option | null> => {
  try {
    const token = localStorage.getItem('adminAuth');
    if (!token) throw new Error('No authentication token');

    const response = await axios.post(`${API_URL}/options`, option, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error creating option:', error);
    return null;
  }
};

// Update option
export const updateOption = async (id: string, option: Partial<Option>): Promise<Option | null> => {
  try {
    const token = localStorage.getItem('adminAuth');
    if (!token) throw new Error('No authentication token');

    const response = await axios.put(`${API_URL}/options/${id}`, option, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating option:', error);
    return null;
  }
};

// Delete option
export const deleteOption = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem('adminAuth');
    if (!token) throw new Error('No authentication token');

    await axios.delete(`${API_URL}/options/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting option:', error);
    return false;
  }
};

// Upload brand image
export const uploadBrandImage = async (id: string, formData: FormData): Promise<{ success: boolean; data: Option }> => {
  try {
    const token = localStorage.getItem('adminAuth');
    if (!token) throw new Error('No authentication token');

    const response = await axios.post(`${API_URL}/options/${id}/upload-image`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error uploading brand image:', error);
    throw error;
  }
};

// Update options order
export const updateOptionsOrder = async (options: { id: string; order: number }[]): Promise<boolean> => {
  try {
    const token = localStorage.getItem('adminAuth');
    if (!token) throw new Error('No authentication token');

    await axios.put(`${API_URL}/options/bulk/order`, { options }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return true;
  } catch (error) {
    console.error('Error updating options order:', error);
    return false;
  }
}; 