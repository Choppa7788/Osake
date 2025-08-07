import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '../hooks/useColorScheme'; // Ensure this exists

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="myBar" options={{ title: "My Bar" }} />
        <Stack.Screen name="addDrink" options={{ title: "Add Drink" }} />
        <Stack.Screen name="search" options={{ title: "Search" }} />
        <Stack.Screen name="whatCanImake" options={{ title: "What Can I Make?" }} />
        <Stack.Screen name="truthdare" options={{ title: "Truth or Dare" }} />
        <Stack.Screen name="detox" options={{ title: "Detox" }} />
        <Stack.Screen name="social" options={{ title: "Social" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
