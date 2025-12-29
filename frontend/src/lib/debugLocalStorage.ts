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
  const handler: ProxyHandler<typeof global> = {
    get: (target, prop: keyof typeof global) => {
      if (prop === 'localStorage') {
        console.error('localStorage accessed during server-side rendering');
        console.error(new Error().stack);
        
        // Return a mock localStorage that logs access
        return new Proxy<Record<string, unknown>>({}, {
          get: (_target, method: string) => {
            return (...args: unknown[]) => {
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
    const proxiedGlobal = new Proxy(originalGlobal, handler);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any) = proxiedGlobal;
  } catch (error) {
    console.error('Failed to set up localStorage debug proxy:', error);
  }
}

// Call this function immediately
setupLocalStorageDebug();
