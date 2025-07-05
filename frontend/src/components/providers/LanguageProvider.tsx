'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { languages, fallbackLng } from '@/app/i18n/settings';
import i18next from '@/app/i18n/client';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const pathname = usePathname();
  const [currentLanguage, setCurrentLanguage] = useState<string>(fallbackLng);

  // Extract language from pathname
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const pathLang = segments.length > 0 && languages.includes(segments[0]) ? segments[0] : fallbackLng;
    
    if (pathLang !== currentLanguage) {
      setCurrentLanguage(pathLang);
      // Change i18next language
      i18next.changeLanguage(pathLang);
    }
  }, [pathname, currentLanguage]);

  const setLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      setCurrentLanguage(lang);
      i18next.changeLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
} 