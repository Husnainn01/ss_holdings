'use client';

// Simplified i18n client - just a stub to avoid breaking imports

// Simple translation function that returns user-friendly text instead of keys
const t = (key: string, options?: any) => {
  // Navigation menu translations
  const translations: Record<string, string> = {
    'navigation.home': 'Home',
    'navigation.cars': 'Cars',
    'navigation.auction': 'Auction',
    'navigation.about': 'About',
    'navigation.banking': 'Banking',
    'navigation.contact': 'Contact',
    'navigation.faq': 'FAQ',
    'navigation.login': 'Login',
    'navigation.register': 'Register',
    'navigation.getQuote': 'Get Quote',
    'footer.address': '123 Export Street, Tokyo',
    'footer.phone': '+81 3-1234-5678',
    'brands.title': 'Brands',
    'search.allBodyTypes': 'View All Body Types',
    'shipping.fromPort': 'From Ports',
    'shipping.viewSchedule': 'View Schedule'
  };
  
  // Check if we have a direct translation
  if (translations[key]) {
    return translations[key];
  }
  
  // If the key contains a colon, take the part after the colon as the default text
  if (key.includes(':')) {
    return key.split(':')[1] || key;
  }
  
  // Just return the last part of the key as a fallback
  const parts = key.split('.');
  return parts[parts.length - 1] || key;
};

// Simplified translation hook
export function useTranslation() {
  return {
    t,
    i18n: {
      language: 'en',
      changeLanguage: () => Promise.resolve(),
      resolvedLanguage: 'en'
    },
    ready: true
  };
}

// Dummy i18next object
const i18next = {
  language: 'en',
  changeLanguage: () => Promise.resolve(),
  t
};

export default i18next;