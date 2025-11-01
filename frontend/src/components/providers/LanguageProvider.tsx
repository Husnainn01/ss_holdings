'use client';

// Simplified language provider - just a stub to avoid breaking imports

// Hook to use the language context - returns fixed values
export function useLanguage() {
  return {
    currentLanguage: 'en',
    setLanguage: () => console.log('Language switching is disabled')
  };
}

// Simple provider that does nothing
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
