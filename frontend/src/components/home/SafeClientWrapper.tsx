'use client';

import React, { useEffect, useState } from 'react';

interface SafeClientWrapperProps {
  children: React.ReactNode;
}

export default function SafeClientWrapper({ children }: SafeClientWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Only render children after component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Return a simple loading state or empty fragment when not mounted
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}
