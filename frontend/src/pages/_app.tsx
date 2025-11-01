import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';

// Create a safe localStorage implementation
const setupSafeLocalStorage = () => {
  if (typeof window === 'undefined') return;

  // Check if localStorage is already available
  try {
    const testKey = '__test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
  } catch (e) {
    // If localStorage is not available, create a polyfill
    const storage: Record<string, string> = {};
    
    const mockLocalStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => { storage[key] = value.toString(); },
      removeItem: (key: string) => { delete storage[key]; },
      clear: () => { Object.keys(storage).forEach(key => { delete storage[key]; }); },
      key: (i: number) => Object.keys(storage)[i] || null,
      length: Object.keys(storage).length
    };
    
    // Apply the polyfill
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });
  }
};

export default function App({ Component, pageProps }: AppProps) {
  // Set up safe localStorage on mount
  useEffect(() => {
    setupSafeLocalStorage();
  }, []);
  
  return <Component {...pageProps} />;
}
