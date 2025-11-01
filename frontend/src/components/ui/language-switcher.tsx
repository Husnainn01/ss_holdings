'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LanguageSwitcherProps {
  variant?: 'default' | 'mobile';
  className?: string;
}

// Simplified language switcher that doesn't do anything
export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  // Just render a simple button that does nothing
  if (variant === 'mobile') {
    return null; // Hide in mobile view
  }

  return (
    <Button variant="link" size="sm" className={`text-white p-0 flex items-center ${className}`}>
      <Globe size={14} className="mr-1.5" />
      <span>English</span>
    </Button>
  );
} 