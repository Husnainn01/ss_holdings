import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { getItem, removeItem } from "./localStorage"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Updates an image URL to ensure it's properly formatted
 * @param url The original image URL
 * @returns A properly formatted image URL
 */
export function updateImageUrl(url: string | undefined): string {
  if (!url) {
    return 'https://placehold.co/600x400/e0e0e0/8A0000?text=No+Image';
  }

  console.log('Original image URL:', url);

  // Check for absolute file paths (local development paths)
  if (url.startsWith('/') || url.includes(':\\') || url.startsWith('C:') || url.includes('/Users/')) {
    console.log('Detected local file path, replacing with placeholder');
    return 'https://placehold.co/600x400/e0e0e0/8A0000?text=Local+Path';
  }

  // Check if it's already a valid URL
  try {
    new URL(url);
    // If we get here, the URL is valid
    return url;
  } catch (e) {
    // Not a valid URL, let's try to fix it
  }

  // If it's a relative path starting with 'uploads/', convert to CDN URL
  if (url.startsWith('uploads/')) {
    const { CDN_URL } = require('@/config');
    return `${CDN_URL}/${url}`;
  }

  // If it's a path without protocol, add https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }

  // If we get here, return the original URL
  return url;
}

/**
 * Formats a price for display
 * @param price The price to format
 * @returns A formatted price string
 */
export function formatPrice(price: number | string): string {
  if (typeof price === 'string') {
    price = parseFloat(price);
  }
  
  if (isNaN(price)) {
    return '$0';
  }
  
  return `$${price.toLocaleString()}`;
}

/**
 * Formats a date for display
 * @param date The date to format
 * @returns A formatted date string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Truncates a string to a maximum length
 * @param str The string to truncate
 * @param maxLength The maximum length
 * @returns A truncated string
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.substring(0, maxLength) + '...';
}

/**
 * Cleans cached image data to prevent loading invalid URLs
 * This function can be called when mounting components that display images
 */
export function cleanCachedImageData(): void {
  try {
    // Check if we're in the browser
    if (typeof window === 'undefined') return;
    
    // Find and clear any cached image data in localStorage that contains invalid paths
    // Skip this on server-side
    if (window.localStorage) {
      try {
        Object.keys(window.localStorage).forEach(key => {
          try {
            const value = getItem(key);
            if (!value) return;
            
            // Check if the value contains invalid paths
            if (
              value.includes('/Users/') || 
              value.includes('/Desktop/') || 
              value.includes('/backend/uploads/')
            ) {
              console.log(`Removing invalid cached data: ${key}`);
              removeItem(key);
            }
          } catch (e) {
            // Ignore errors when accessing localStorage items
          }
        });
      } catch (e) {
        // Ignore errors if localStorage is not accessible
      }
    }
    
    // Clear any image cache in sessionStorage as well
    if (window.sessionStorage) {
      try {
        Object.keys(window.sessionStorage).forEach(key => {
          try {
            const value = window.sessionStorage.getItem(key);
            if (!value) return;
            
            // Check if the value contains invalid paths
            if (
              value.includes('/Users/') || 
              value.includes('/Desktop/') || 
              value.includes('/backend/uploads/')
            ) {
              console.log(`Removing invalid cached data: ${key}`);
              window.sessionStorage.removeItem(key);
            }
          } catch (e) {
            // Ignore errors when accessing sessionStorage items
          }
        });
      } catch (e) {
        // Ignore errors when accessing sessionStorage
      }
    }
    
    // If the browser supports Cache API, clear image caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('image') || cacheName.includes('static')) {
            caches.delete(cacheName);
          }
        });
      });
    }
  } catch (error) {
    console.error('Error cleaning cached image data:', error);
  }
}
