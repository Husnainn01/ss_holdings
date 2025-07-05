'use client';

import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getOptions, languages, fallbackLng } from './settings';

const runsOnServerSide = typeof window === 'undefined';

// Function to get language from pathname
const getLanguageFromPath = () => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && languages.includes(segments[0])) {
      return segments[0];
    }
  }
  return fallbackLng;
};

// Initialize i18next for client-side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => import(`../../../public/locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: getLanguageFromPath(), // Set initial language from path
    detection: {
      order: ['path', 'cookie', 'htmlTag', 'navigator'],
      caches: ['cookie'],
    },
    preload: runsOnServerSide ? languages : []
  });

export function useTranslation(lng?: string, ns?: string, options?: any) {
  const ret = useTranslationOrg(ns, options);
  
  // Get current language from URL if not specified
  const currentLng = lng || getLanguageFromPath();
  
  // If the current language doesn't match i18n language, change it
  if (ret.i18n.language !== currentLng) {
    ret.i18n.changeLanguage(currentLng);
  }
  
  return {
    t: ret.t,
    i18n: ret.i18n,
    ready: ret.ready && (currentLng === undefined || ret.i18n.resolvedLanguage === currentLng),
  };
}

export default i18next; 