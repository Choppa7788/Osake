import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';  // For detecting device language
import en from './locales/en.json';  // Import translations
import ja from './locales/ja.json';  

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: Localization.locale.startsWith('ja') ? 'ja' : 'en',  // Set to Japanese if the locale starts with 'ja', otherwise English
    fallbackLng: 'en',  // Default to English if language detection fails
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
