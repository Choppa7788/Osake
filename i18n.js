import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';  // For detecting device language
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';  // Import translations
import ja from './locales/ja.json';  

// Function to detect device language
const getDeviceLanguage = () => {
  try {
    // Get device locale using expo-localization
    const deviceLocale = Localization.locale; // e.g., 'ja-JP', 'en-US'
    const deviceLanguages = Localization.locales; // Array of preferred languages
    
    console.log('Device locale:', deviceLocale);
    console.log('Device languages:', deviceLanguages);
    
    // Extract language code from primary locale
    const primaryLanguage = deviceLocale.split('-')[0].toLowerCase();
    
    // Check if Japanese is preferred
    if (primaryLanguage === 'ja') {
      return 'ja';
    }
    
    // Check secondary languages for Japanese
    for (const locale of deviceLanguages) {
      if (locale.languageCode === 'ja') {
        return 'ja';
      }
    }
    
    return 'en'; // Default to English
  } catch (error) {
    console.log('Could not detect device language, defaulting to English:', error);
    return 'en';
  }
};

// Initialize language asynchronously
const initializeLanguage = async () => {
  try {
    // Check if user has manually set a language
    const storedLang = await AsyncStorage.getItem('appLanguage');
    const deviceLang = getDeviceLanguage();
    
    console.log('Stored language:', storedLang);
    console.log('Device language:', deviceLang);
    
    if (storedLang) {
      // User has manually set language, use it
      return storedLang;
    } else {
      // Use device language and store it
      await AsyncStorage.setItem('appLanguage', deviceLang);
      return deviceLang;
    }
  } catch (error) {
    console.log('Error initializing language:', error);
    return 'en';
  }
};

// Initialize i18n with device language detection
const initI18n = async () => {
  const language = await initializeLanguage();
  
  await i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      resources: {
        en: { translation: en },
        ja: { translation: ja },
      },
      lng: language,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });
  
  console.log('i18n initialized with language:', language);
};

// Initialize i18n
initI18n();

export default i18n;
