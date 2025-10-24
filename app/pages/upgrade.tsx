import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import RevenueCatUI from 'react-native-purchases-ui';
import { useLayoutEffect, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Purchases, { CustomerInfo } from 'react-native-purchases';

export default function Upgrade() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  // Hide the header
  useLayoutEffect(() => {
    navigation.setOptions({ header: () => null });
  }, [navigation]);

  // Listen for purchase events (RevenueCat is already configured in _layout.tsx)
  useEffect(() => {
    // Listen for successful purchases
    const purchaseListener = (customerInfo: CustomerInfo) => {
      // Check if user now has pro features
      if (customerInfo.entitlements.active["Pro features"]) {
        setIsLoading(false);
        // Small delay to allow the success prompt to show before navigating
        setTimeout(() => {
          navigation.goBack();
        }, 1000);
      }
    };

    // Handle purchase errors
    const errorHandler = (error: any) => {
      setIsLoading(false);
      console.warn("Purchase error:", error);

      // Show user-friendly error message
      if (error.userCancelled) {
        // User cancelled, no need to show error
        return;
      }

      Alert.alert(
        "Purchase Failed",
        "There was an issue processing your purchase. Please try again or contact support if the problem persists.",
        [{ text: "OK" }]
      );
    };

    Purchases.addCustomerInfoUpdateListener(purchaseListener);

    return () => {
      Purchases.removeCustomerInfoUpdateListener(purchaseListener);
    };
  }, [navigation]);

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom close button - positioned to not interfere with paywall content */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Full paywall with proper spacing */}
      <View style={styles.paywallContainer}>
        <RevenueCatUI.Paywall />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 15,
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paywallContainer: {
    flex: 1,
    marginTop: -10, // Slight overlap to ensure seamless appearance
  },
});