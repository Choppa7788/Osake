import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { HapticTab } from '../../components/HapticTab';
import { Colors, PremiumColors } from '../../constants/Colors';
import { useColorScheme } from '../../hooks/useColorScheme';
import { House, Sparkle, Wine } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import "../../i18n";

export default function TabLayout() {
   const { t, i18n } = useTranslation();
   const colorScheme = useColorScheme();
   const colors = Colors[colorScheme ?? 'light'];
   const isDarkMode = colorScheme === 'dark';

   // Mint/green background for tabs in light mode, keep icons/text black
   const TabBarBackground = () => (
      <View
         style={{
            flex: 1,
            backgroundColor: !isDarkMode ? '#A8E6CF' : colors.surface, // mint pastel in light mode
         }}
      />
   );

   return (
      <Tabs
         screenOptions={{
            tabBarActiveTintColor: colors.text, // responsive to light/dark mode
            tabBarInactiveTintColor: colors.text, // responsive to light/dark mode
            headerShown: false,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
               default: {
                  backgroundColor: 'transparent',
                  borderTopWidth: 0,
                  paddingTop: 0,
                  paddingBottom: Platform.OS === 'ios' ? 20 : 8,
                  height: Platform.OS === 'ios' ? 78 : 58,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: -2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 0,
                  marginHorizontal: 0,
                  marginBottom: 0,
                  marginTop: 0,
                  paddingHorizontal: 0,
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
               },
            }),
            tabBarLabelStyle: {
               fontSize: 12,
               fontWeight: '600',
               marginTop: 4,
            },
         }}
      >
         <Tabs.Screen
            name="index"
            options={{
               title: t('tab.home'),
               tabBarIcon: ({ color, focused }) => (
                  <House
                     size={26}
                     color={color}
                     weight={focused ? 'fill' : 'regular'}
                  />
               ),
               tabBarButton: HapticTab,
            }}
         />
         <Tabs.Screen
            name="random"
            options={{
               title: t("tab.surprise", "Surprise Me"),
               tabBarIcon: ({ color, focused }) => (
                  <Sparkle
                     size={26}
                     color={color}
                     weight={focused ? 'fill' : 'regular'}
                  />
               ),
               tabBarButton: HapticTab,
            }}
         />
         <Tabs.Screen
            name="library"
            options={{
               title: t("tab.library"),
               tabBarIcon: ({ color, focused }) => (
                  <Wine
                     size={26}
                     color={color}
                     weight={focused ? 'fill' : 'regular'}
                  />
               ),
               tabBarButton: HapticTab,
            }}
         />
      </Tabs>
   );
}
