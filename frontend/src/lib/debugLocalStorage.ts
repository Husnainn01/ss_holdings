// This file helps debug where localStorage is being accessed during server-side rendering

// Create a proxy to track localStorage access
export function setupLocalStorageDebug() {
  if (typeof window !== 'undefined') {
    // We're in the browser, no need to debug
    return;
  }

  // Create a proxy for global
  const originalGlobal = global;
  
  // Create a trap for localStorage access
  const handler = {
    get: function(target: any, prop: string) {
      if (prop === 'localStorage') {
        console.error('localStorage accessed during server-side rendering');
        console.error(new Error().stack);
        
        // Return a mock localStorage that logs access
        return new Proxy({}, {
          get: function(target: any, method: string) {
            return function(...args: any[]) {
              console.error(`localStorage.${method} called with:`, args);
              console.error(new Error().stack);
              return null;
            };
          }
        });
      }
      return target[prop];
    }
  };

  // Apply the proxy
  try {
    // @ts-ignore - This is a hack to debug
    global = new Proxy(originalGlobal, handler);
  } catch (e) {
    console.error('Failed to set up localStorage debug proxy:', e);
  }
}

// Call this function immediately
setupLocalStorageDebug();
