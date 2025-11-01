// Simplified i18n settings - just stubs to avoid breaking imports
import { DEFAULT_LANGUAGE } from '@/config';

export const fallbackLng = DEFAULT_LANGUAGE;
export const languages = [fallbackLng]; // Only one language now
export const defaultNS = 'common';

export function getOptions() {
  return {
    supportedLngs: languages,
    fallbackLng,
    lng: fallbackLng,
    fallbackNS: defaultNS,
    defaultNS
  };
}