// This file provides a mock implementation of window and its properties for server-side rendering

// Only run on the server
if (typeof window === 'undefined') {
  // Create mock window.location
  const mockLocation = {
    protocol: 'https:',
    host: 'example.com',
    hostname: 'example.com',
    port: '',
    pathname: '/',
    search: '',
    hash: '',
    href: 'https://example.com/',
    origin: 'https://example.com',
    assign: function() {},
    replace: function() {},
    reload: function() {},
    toString: function() { return this.href; }
  };
  
  // Create a mock window with essential browser APIs
  const mockWindow = {
    location: mockLocation,
    // Add event listener functions
    addEventListener: function() {},
    removeEventListener: function() {},
    // Add other commonly used properties
    scrollY: 0,
    scrollTo: function() {},
    history: {
      pushState: function() {},
      replaceState: function() {},
      back: function() {},
      forward: function() {}
    },
    document: {
      documentElement: {
        clientWidth: 1920,
        clientHeight: 1080
      }
    }
  };
  
  // Add to global
  if (!global.window) {
    global.window = mockWindow;
  } else {
    // Add missing properties to existing window mock
    Object.assign(global.window, mockWindow);
  }
  
  console.log('Mock window.location has been set up for server-side rendering');
}

// No export needed - this file is imported for its side effects
