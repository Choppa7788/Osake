import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { HapticTab } from '../../components/HapticTab'; // Ensure this file exists
import TabBarBackground from '../../components/ui/TabBarBackground'; // Ensure this file exists
import { Colors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { ThemedText } from '../../components/ThemedText';
import { House, MagnifyingGlass, Stack } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function TabLayout() {
   const { t, i18n } = useTranslation();
   const colorScheme = useColorScheme();

   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarBackground: () => <View style={{ backgroundColor: '#45423f', flex: 1 }} />, // Fixed background color
            tabBarStyle: Platform.select({
               default: {
                  backgroundColor: '#121212', // Fixed background color
               },
            }),
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: t('tab.home'),
               tabBarIcon: ({ color }) => <House size={28} color={color} />,
               tabBarButton: HapticTab,
            }}
         />
         <Tabs.Screen
            name="search"
            options={{
               title: t("tab.search"),
               tabBarIcon: ({ color }) => <MagnifyingGlass size={28} color={color} />,
               tabBarButton: HapticTab,
            }}
         />
         <Tabs.Screen
            name="library"
            options={{
               title: t("tab.library"),
               tabBarIcon: ({ color }) => <Stack size={28} color={color} />,
               tabBarButton: HapticTab,
            }}
         />
      </Tabs>
   );
}
