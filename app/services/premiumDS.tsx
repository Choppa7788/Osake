import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, Check, X } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors, PremiumColors } from '../../constants/Colors';
import Purchases, { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';

interface PremiumSubscriptionProps {
  onClose?: () => void;
}

export default function PremiumSubscription({ onClose }: PremiumSubscriptionProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDarkMode = colorScheme === 'dark';

  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        setOfferings(offerings.current);
        // Default to first package (typically annual)
        if (offerings.current.availablePackages.length > 0) {
          setSelectedPackage(offerings.current.availablePackages[0]);
        }
      }
    } catch (error) {
      console.error('Error loading offerings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    setPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

      if (customerInfo.entitlements.active["Pro features"]) {
        Alert.alert(
          "Welcome to Sipster Premium!",
          "You now have access to all premium features.",
          [{ text: "Continue", onPress: () => onClose?.() || router.back() }]
        );
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        Alert.alert(
          "Purchase Failed",
          "There was an issue processing your purchase. Please try again.",
          [{ text: "OK" }]
        );
      }
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      const customerInfo = await Purchases.restorePurchases();
      if (customerInfo.entitlements.active["Pro features"]) {
        Alert.alert(
          "Purchases Restored",
          "Your premium subscription has been restored.",
          [{ text: "Continue", onPress: () => onClose?.() || router.back() }]
        );
      } else {
        Alert.alert(
          "No Purchases Found",
          "No active subscriptions were found to restore.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Restore Failed",
        "Unable to restore purchases. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://sites.google.com/view/sipster-privacy-policy');
  };

  const openTermsOfService = () => {
    Linking.openURL('https://sites.google.com/view/sipster-terms-of-service');
  };

  const formatPrice = (packageItem: PurchasesPackage) => {
    const price = packageItem.product.priceString;
    const period = packageItem.packageType;

    // Ensure billed amount is most prominent
    return {
      billedAmount: price,
      period: period === 'ANNUAL' ? '/year' : period === 'MONTHLY' ? '/month' : '',
      savings: period === 'ANNUAL' ? 'Save 58%' : null,
    };
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading premium options...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onClose?.() || router.back()} style={styles.closeButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Premium Header */}
        <LinearGradient
          colors={isDarkMode
            ? [PremiumColors.deepTeal, PremiumColors.crystalBlue]
            : [PremiumColors.gold, PremiumColors.copper]
          }
          style={styles.premiumHeader}
        >
          <Crown size={48} color="white" weight="fill" />
          <Text style={styles.premiumTitle}>Sipster Premium</Text>
          <Text style={styles.premiumSubtitle}>Unlock the complete cocktail experience</Text>
        </LinearGradient>

        {/* Features */}
        <View style={[styles.featuresContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.featuresTitle, { color: colors.text }]}>Premium Features</Text>

          {[
            'Unlimited cocktail recipes',
            'Exclusive premium recipes',
            'Advanced ingredient matching',
            'Personalized recommendations',
            'Offline access to favorites',
            'Export shopping lists',
            'Priority customer support',
            'Ad-free experience',
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Check size={20} color={PremiumColors.emerald} weight="bold" />
              <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Subscription Options */}
        <View style={styles.subscriptionContainer}>
          <Text style={[styles.subscriptionTitle, { color: colors.text }]}>Choose Your Plan</Text>

          {offerings?.availablePackages.map((packageItem) => {
            const priceInfo = formatPrice(packageItem);
            const isSelected = selectedPackage?.identifier === packageItem.identifier;
            const isAnnual = packageItem.packageType === 'ANNUAL';

            return (
              <TouchableOpacity
                key={packageItem.identifier}
                style={[
                  styles.packageOption,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                  isAnnual && styles.popularOption,
                ]}
                onPress={() => setSelectedPackage(packageItem)}
              >
                {isAnnual && (
                  <View style={[styles.popularBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}

                <View style={styles.packageContent}>
                  <View style={styles.packageInfo}>
                    <Text style={[styles.packageTitle, { color: colors.text }]}>
                      {packageItem.packageType === 'ANNUAL' ? 'Annual Plan' : 'Monthly Plan'}
                    </Text>

                    {/* BILLED AMOUNT - Most Prominent */}
                    <Text style={[styles.billedAmount, { color: colors.primary }]}>
                      {priceInfo.billedAmount}
                    </Text>

                    {/* Subordinate pricing information */}
                    <Text style={[styles.pricePeriod, { color: colors.icon }]}>
                      {priceInfo.period}
                    </Text>

                    {priceInfo.savings && (
                      <Text style={[styles.savingsText, { color: PremiumColors.emerald }]}>
                        {priceInfo.savings}
                      </Text>
                    )}
                  </View>

                  <View style={[
                    styles.radioButton,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                    }
                  ]}>
                    {isSelected && <Check size={16} color="white" weight="bold" />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Purchase Button */}
        <TouchableOpacity
          style={[
            styles.purchaseButton,
            {
              backgroundColor: selectedPackage ? colors.primary : colors.border,
              opacity: purchasing ? 0.7 : 1,
            }
          ]}
          onPress={handlePurchase}
          disabled={!selectedPackage || purchasing}
        >
          {purchasing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.purchaseButtonText}>
              Start Premium {selectedPackage ? formatPrice(selectedPackage).billedAmount : ''}
            </Text>
          )}
        </TouchableOpacity>

        {/* Restore & Legal */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleRestore} style={styles.footerButton}>
            <Text style={[styles.footerButtonText, { color: colors.primary }]}>
              Restore Purchases
            </Text>
          </TouchableOpacity>

          <View style={styles.legalLinks}>
            <TouchableOpacity onPress={openTermsOfService}>
              <Text style={[styles.legalText, { color: colors.icon }]}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={[styles.legalSeparator, { color: colors.icon }]}> • </Text>
            <TouchableOpacity onPress={openPrivacyPolicy}>
              <Text style={[styles.legalText, { color: colors.icon }]}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.subscriptionNote, { color: colors.icon }]}>
            Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period.
            Your account will be charged for renewal within 24 hours prior to the end of the current period.
            Subscriptions may be managed and auto-renewal may be turned off by going to Account Settings after purchase.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  premiumHeader: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
  },
  premiumTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    marginTop: 16,
  },
  premiumSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
  },
  featuresContainer: {
    margin: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subscriptionContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  packageOption: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  popularOption: {
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  packageContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageInfo: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  // MOST PROMINENT - Billed Amount
  billedAmount: {
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 4,
  },
  // Subordinate pricing elements
  pricePeriod: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
  },
  savingsText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchaseButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerButton: {
    paddingVertical: 12,
    marginBottom: 20,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  legalText: {
    fontSize: 14,
    fontWeight: '500',
  },
  legalSeparator: {
    fontSize: 14,
  },
  subscriptionNote: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.7,
  },
});