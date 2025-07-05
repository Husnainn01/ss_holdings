'use client';

import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/app/i18n/client';
import { useRouter, usePathname } from 'next/navigation';
import { languages } from '@/app/i18n/settings';
import { useLanguage } from '@/components/providers/LanguageProvider';

const languageNames: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
  ja: '日本語',
  ar: 'العربية',
  es: 'Español',
};

const languageFlags: Record<string, string> = {
  en: '🇺🇸',
  ru: '🇷🇺',
  ja: '🇯🇵',
  ar: '🇸🇦',
  es: '🇪🇸',
};

interface LanguageSwitcherProps {
  variant?: 'default' | 'mobile';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: string) => {
    const segments = pathname.split('/').filter(Boolean);
    
    // Check if the first segment is a language code
    if (segments.length > 0 && languages.includes(segments[0])) {
      // Replace the language code
      segments[0] = newLang;
    } else {
      // Add the language code at the beginning
      segments.unshift(newLang);
    }
    
    const newPath = '/' + segments.join('/');
    
    // Change the language through context
    setLanguage(newLang);
    
    // Set cookie for language preference
    document.cookie = `i18next=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Navigate to the new path
    router.push(newPath);
  };

  const currentLanguageName = languageNames[currentLanguage] || languageNames.en;
  const currentLanguageFlag = languageFlags[currentLanguage] || languageFlags.en;

  if (variant === 'mobile') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="px-2 py-1 text-sm font-medium text-gray-700">Language</div>
        <div className="flex flex-wrap gap-2 px-2">
          {languages.map((lang) => (
            <Button
              key={lang}
              variant={currentLanguage === lang ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLanguageChange(lang)}
              className="flex items-center gap-1"
            >
              <span>{languageFlags[lang]}</span>
              <span>{languageNames[lang]}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" size="sm" className={`text-white p-0 flex items-center ${className}`}>
          <Globe size={14} className="mr-1.5" />
          <span className="hidden sm:inline">{currentLanguageName}</span>
          <span className="sm:hidden">{currentLanguageFlag}</span>
          <ChevronDown size={14} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[120px]">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang} 
            onClick={() => handleLanguageChange(lang)}
            className={`flex items-center gap-2 cursor-pointer ${
              currentLanguage === lang ? 'bg-gray-100' : ''
            }`}
          >
            <span>{languageFlags[lang]}</span>
            <span>{languageNames[lang]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 