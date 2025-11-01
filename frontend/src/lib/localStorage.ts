'use client';

// Safe localStorage utility functions that work in both client and server environments

// Check if localStorage is available
export const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const testKey = '__test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Safe getItem
export const getItem = (key: string): string | null => {
  if (!isLocalStorageAvailable()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    console.error('Error accessing localStorage:', e);
    return null;
  }
};

// Safe setItem
export const setItem = (key: string, value: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.error('Error setting localStorage item:', e);
    return false;
  }
};

// Safe removeItem
export const removeItem = (key: string): boolean => {
  if (!isLocalStorageAvailable()) return false;
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing localStorage item:', e);
    return false;
  }
};
