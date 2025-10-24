import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, createContext, useContext } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import Purchases, { LOG_LEVEL, CustomerInfo } from 'react-native-purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '../hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

// --- User Context ---
type UserContextType = {
  isPro: boolean;
  acceptTerms: () => void;
};

const UserContext = createContext<UserContextType>({
  isPro: false,
  acceptTerms: () => {}
});
export function useUser() {
  return useContext(UserContext);
}

// --- Storage keys ---
const PRO_STATUS_KEY = 'isPro';
const TERMS_ACCEPTED_KEY = 'termsAccepted';

// --- Helper to fetch Pro status ---
async function fetchProStatus(): Promise<boolean> {
  try {
    const customerInfo: CustomerInfo = await Purchases.getCustomerInfo();
    console.log("Fetched customer info:", customerInfo);
    const isPro = customerInfo.entitlements.active["Pro features"] !== undefined;

    // Cache the result
    await AsyncStorage.setItem(PRO_STATUS_KEY, JSON.stringify(isPro));
    return isPro;
  } catch (e) {
    console.warn("Failed to fetch pro status", e);

    // Try to get cached value
    try {
      const cached = await AsyncStorage.getItem(PRO_STATUS_KEY);
      return cached ? JSON.parse(cached) : false;
    } catch (cacheError) {
      console.warn("Failed to get cached pro status", cacheError);
      return false;
    }
  }
}

export default function RootLayout() {
  const [isPro, setIsPro] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean | null>(null);

  // Accept terms function
  const acceptTerms = async () => {
    try {
      await AsyncStorage.setItem(TERMS_ACCEPTED_KEY, 'true');
      setTermsAccepted(true);
    } catch (error) {
      console.warn("Failed to save terms acceptance:", error);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if terms have been accepted
        const termsStatus = await AsyncStorage.getItem(TERMS_ACCEPTED_KEY);
        setTermsAccepted(termsStatus === 'true');

        // Load cached pro status first for faster UI
        const cached = await AsyncStorage.getItem(PRO_STATUS_KEY);
        if (cached) {
          setIsPro(JSON.parse(cached));
        }

        // Configure RevenueCat (iOS only for now)
        try {
          Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.VERBOSE : LOG_LEVEL.ERROR);

          if (Platform.OS === 'ios' && process.env.EXPO_PUBLIC_RC_IOS) {
            await Purchases.configure({
              apiKey: process.env.EXPO_PUBLIC_RC_IOS,
            });

            // Fetch fresh pro status only if configured successfully
            const proStatus = await fetchProStatus();
            setIsPro(proStatus);
            console.log("Initial pro status:", proStatus);
          } else {
            console.log("RevenueCat not configured - no API key or not iOS platform");
          }
          // Android support dormant - uncomment when Play Store deployment is planned
          // else if (Platform.OS === 'android' && process.env.EXPO_PUBLIC_RC_ANDROID) {
          //   await Purchases.configure({
          //     apiKey: process.env.EXPO_PUBLIC_RC_ANDROID,
          //   });
          // }
        } catch (rcError) {
          console.warn("RevenueCat configuration failed:", rcError);
          // App continues to function without premium features
        }

        setIsConfigured(true);
      } catch (error) {
        console.warn("Failed to initialize RevenueCat:", error);
        setIsConfigured(true); // Still allow app to function
      }
    };

    initializeApp();

    // Listen for updates only after configuration
    const customerInfoListener = (customerInfo: CustomerInfo) => {
      const newProStatus = customerInfo.entitlements.active["Pro features"] !== undefined;
      setIsPro(newProStatus);
      // Cache the update
      AsyncStorage.setItem(PRO_STATUS_KEY, JSON.stringify(newProStatus));
    };

    // Add listener only when configured
    if (isConfigured) {
      Purchases.addCustomerInfoUpdateListener(customerInfoListener);
    }

    return () => {
      if (isConfigured) {
        Purchases.removeCustomerInfoUpdateListener(customerInfoListener);
      }
    };
  }, [isConfigured]);

  // Fonts & splash
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loaded && termsAccepted !== null) {
      SplashScreen.hideAsync();
    }
  }, [loaded, termsAccepted]);

  useEffect(() => {
    if (termsAccepted === null || !loaded) return;

    const inTermsGroup = segments[0] === 'pages' && segments[1] === 'termsAndConditions';

    if (!termsAccepted && !inTermsGroup) {
      router.replace('/pages/termsAndConditions');
    } else if (termsAccepted && inTermsGroup) {
      router.replace('/(tabs)');
    }
  }, [termsAccepted, segments, loaded]);

  if (!loaded || termsAccepted === null) {
    return null;
  }

  return (
    <UserContext.Provider value={{ isPro, acceptTerms }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="pages" options={{ headerShown: false }} />
          <Stack.Screen name="cocktails" options={{ headerShown: false }} />
          <Stack.Screen name="morePages" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserContext.Provider>
  );
}

