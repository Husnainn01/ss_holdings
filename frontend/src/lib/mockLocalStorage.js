// This file provides a mock implementation of localStorage for server-side rendering

// Create a mock storage object
const createMockStorage = () => {
  let storage = {};
  
  return {
    getItem: function(key) {
      return storage[key] || null;
    },
    setItem: function(key, value) {
      storage[key] = value.toString();
    },
    removeItem: function(key) {
      delete storage[key];
    },
    clear: function() {
      storage = {};
    },
    key: function(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    },
    get length() {
      return Object.keys(storage).length;
    }
  };
};

// Only run on the server
if (typeof window === 'undefined') {
  // Create mock implementations
  const mockLocalStorage = createMockStorage();
  const mockSessionStorage = createMockStorage();
  
  // Add to global
  Object.defineProperty(global, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
  
  Object.defineProperty(global, 'sessionStorage', {
    value: mockSessionStorage,
    writable: true
  });
  
  // Mock window if needed
  if (!global.window) {
    global.window = {
      localStorage: mockLocalStorage,
      sessionStorage: mockSessionStorage
    };
  } else {
    // Add to existing window mock
    global.window.localStorage = mockLocalStorage;
    global.window.sessionStorage = mockSessionStorage;
  }
  
  console.log('Mock localStorage and sessionStorage have been set up for server-side rendering');
}

// No export needed - this file is imported for its side effects
