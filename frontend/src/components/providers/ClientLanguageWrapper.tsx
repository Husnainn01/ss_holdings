'use client';

import React from 'react';

interface ClientLanguageWrapperProps {
  children: React.ReactNode;
}

// Simple pass-through wrapper
export default function ClientLanguageWrapper({ children }: ClientLanguageWrapperProps) {
  return <>{children}</>;
}
