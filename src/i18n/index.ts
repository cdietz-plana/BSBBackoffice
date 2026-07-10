import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './en';
import { zhTW } from './zh-TW';

export const LANGUAGES = [
  { key: 'en', labelKey: 'header.langEn' },
  { key: 'zh-TW', labelKey: 'header.langZh' },
] as const;

export type LanguageKey = (typeof LANGUAGES)[number]['key'];

const STORAGE_KEY = 'bsb.lang';

const savedLang =
  (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) || 'en';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'zh-TW': { translation: zhTW },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* ignore storage errors */
  }
});

export default i18n;
