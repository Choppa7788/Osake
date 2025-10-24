import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen doesn't exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});



/*import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, SafeAreaView, useColorScheme, Image } from "react-native";
import Purchases from "react-native-purchases";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

// Localization dictionary
const LOCALE_TEXT = {
  en: {
    title: "Be a PRO bartender",
    checks: [
      "Unlock all the recipes",
      "Unlock your own custom drink library",
      "Unlock Experimental features",
      "Help a brother out",
    ],
    monthly: "Monthly Membership",
    yearly: "Yearly Membership",
    restore: "Restore Purchases",
    piracy: "Piracy Policy",
  },
  ja: {
    title: "プロのバーテンダーになろう",
    checks: [
      "すべてのレシピをアンロック",
      "自分だけのカスタムドリンクライブラリをアンロック",
      "実験的な機能をアンロック",
      "助けてください",
    ],
    monthly: "月額メンバーシップ",
    yearly: "年額メンバーシップ",
    restore: "購入の復元",
    piracy: "海賊版ポリシー",
  },
};

function getLocale() {
  const lang = (typeof navigator !== "undefined" && navigator.language) || "en";
  if (lang.startsWith("ja")) return "ja";
  return "en";
}

export default function OfferingsScreen() {
  const [prices, setPrices] = useState<{ monthly: string | null; yearly: string | null }>({ monthly: null, yearly: null });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const locale = getLocale();
  const t = LOCALE_TEXT[locale];

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => null
    });
  }, [navigation]);

  useEffect(() => {
    async function fetchOfferings() {
      try {
        const offerings = await Purchases.getOfferings();
        const current = offerings.current;
        if (current && current.availablePackages.length > 0) {
          const monthly = current.availablePackages.find(pkg => pkg.identifier.includes("monthly"));
          const yearly = current.availablePackages.find(pkg => pkg.identifier.includes("yearly"));
          setPrices({
            monthly: monthly ? monthly.product.priceString : null,
            yearly: yearly ? yearly.product.priceString : null,
          });
        }
      } catch (e) {
        setPrices({ monthly: null, yearly: null });
      }
      setLoading(false);
    }
    fetchOfferings();
  }, []);

  const purchase = async (type: "monthly" | "yearly") => {
    setLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      const current = offerings.current;
      if (current && current.availablePackages) {
        const pkg = current.availablePackages.find(p =>
          p.identifier.includes(type)
        );
        if (pkg) {
          await Purchases.purchasePackage(pkg);
        }
      }
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  const restore = async () => {
    setLoading(true);
    try {
      await Purchases.restorePurchases();
    } catch (e) {
      // handle error
    }
    setLoading(false);
  };

  // Theme colors
  const isDark = colorScheme === "dark";
  const theme = {
    bg: isDark ? "#121212" : "#f8f8f8",
    card: isDark ? "#222" : "#fff",
    text: isDark ? "#fff" : "#222",
    accent: "#1DB954",
    divider: isDark ? "#444" : "#ccc",
    placeholderGradient: isDark
      ? ["#8e44ad", "#2c3e50"]
      : ["#b39ddb", "#e0e0e0"],
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      
      <View style={[styles.header, { backgroundColor: theme.bg }]}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
      </View>
      <View style={[styles.container, { backgroundColor: theme.bg }]}>
        <Text style={[styles.title, { color: theme.text }]}>{t.title}</Text>

       

        <View
          style={[
            styles.placeholder,
            {
              backgroundColor: theme.card,
              borderColor: theme.divider,
              borderWidth: 1,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <Image
            source={require("../../assets/icons/coverIMG.png")}
            style={{ width: "100%", height: "100%", borderRadius: 24 }}
            resizeMode="cover"
          />
        </View>
        <View style={styles.checklist}>
          {t.checks.map((item, idx) => (
            <View key={idx} style={styles.checkItem}>
              <Ionicons name="checkmark-circle" size={22} color={theme.accent} style={{ marginRight: 8 }} />
              <Text style={[styles.checkText, { color: theme.text }]}>{item}</Text>
            </View>
          ))}
        </View>
        {loading ? (
          <ActivityIndicator size="large" color={theme.accent} />
        ) : (
          <View style={styles.buttons}>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={() => purchase("monthly")}>
              <Text style={[styles.buttonText, { color: "#fff" }]}>
                {t.monthly} {prices.monthly ? `- ${prices.monthly}` : ""}
              </Text>
              <Text style={[styles.priceDesc, { color: "#fff" }]}>
                {locale === "ja"
                  ? " 500円"
                  : "$3.36"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.buttonOutline,
                { backgroundColor: theme.bg, borderColor: theme.accent },
              ]}
              onPress={() => purchase("yearly")}
            >
              <Text style={[styles.buttonTextOutline, { color: theme.accent }]}>
                {t.yearly} {prices.yearly ? `- ${prices.yearly}` : ""}
              </Text>
              <Text style={[styles.priceDesc, { color: theme.accent }]}>
                {locale === "ja"
                  ? "1500円"
                  : "$10.08"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={[styles.footerFixed, { backgroundColor: theme.bg, borderColor: theme.divider }]}>
        <TouchableOpacity onPress={restore}>
          <Text style={[styles.footerText, { color: theme.text }]}>{t.restore}</Text>
        </TouchableOpacity>
        <Text style={[styles.footerDivider, { color: theme.text }]}> | </Text>
        <TouchableOpacity onPress={() => Linking.openURL("https://yourdomain.com/piracy-policy")}>
          <Text style={[styles.footerText, { color: theme.text }]}>{t.piracy}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    justifyContent: "flex-end",
  },
  closeBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(40,40,40,0.07)",
  },
  container: { flex: 1, alignItems: "center", padding: 24 },
  title: { fontSize: 35, fontWeight: "bold", marginBottom: 8, textAlign: "center", letterSpacing: 0.5, marginTop:-30 },
  subtitle: { fontSize: 17, textAlign: "center", marginBottom: 16, fontWeight: "500" },
  checklist: { width: "100%", marginBottom: 32 },
  checkItem: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  checkText: { fontSize: 20, fontWeight: "500" },
  buttons: { width: "100%", marginBottom: 24 },
  button: {
    padding: 18,
    borderRadius: 30,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: { fontSize: 20, fontWeight: "bold" },
  buttonOutline: {
    borderWidth: 2,
  },
  buttonTextOutline: {
    fontSize: 20,
    fontWeight: "bold",
  },
  footerFixed: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  footerText: { fontSize: 16 },
  footerDivider: { fontSize: 16, marginHorizontal: 8 },
  placeholder: {
    width: "100%",
    height: 250,
    borderRadius: 24,
    marginBottom: 5,
  },
  priceDesc: {
    fontSize: 15,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 2,
  },
});

*/