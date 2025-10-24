import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Shuffle, Sparkle } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getImage } from '../cocktails/imagepath';
import cocktails from '../../assets/database/cocktails.json';
import { Colors } from '../../constants/Colors';
import "../../i18n";

export default function RandomScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDarkMode = colorScheme === 'dark';

  const [currentDrink, setCurrentDrink] = useState<any>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const gradientColors: [string, string, string] = isDarkMode
    ? [colors.gradientStart, colors.gradientEnd, '#0F0F0F']
    : ['#EAFFD0', '#D4F1A8', '#EAFFD0'];

  const getRandomDrink = () => {
    if (!cocktails?.length) return;
    const randomIndex = Math.floor(Math.random() * cocktails.length);
    return cocktails[randomIndex];
  };

  const handleShuffle = () => {
    setIsShuffling(true);

    // Simulate shuffle animation
    setTimeout(() => {
      const newDrink = getRandomDrink();
      setCurrentDrink(newDrink);
      setIsShuffling(false);
    }, 500);
  };

  const handleDrinkPress = () => {
    if (currentDrink?.idDrink) {
      router.push(`/cocktails/particulardrink?idDrink=${currentDrink.idDrink}`);
    }
  };

  // Get random drink on initial load
  React.useEffect(() => {
    const initialDrink = getRandomDrink();
    setCurrentDrink(initialDrink);
  }, []);

  return (
    <LinearGradient colors={gradientColors} style={styles.outerContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.headerGlass, {
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255, 255, 255, 0.98)',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : '#C5E89A'
        }]}>
          <View style={styles.headerRow}>
            <View style={[styles.headerIconCircle, { backgroundColor: isDarkMode ? '#FFD93D' : '#58CC02' }]}>
              <Sparkle size={28} color="#fff" weight="fill" />
            </View>
            <View style={styles.headerTextBlock}>
              <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#1a1a1a' }]}>{t("random.title", "Surprise Me!")}</Text>
              <Text style={[styles.headerSub, { color: isDarkMode ? '#e0e0e0' : '#3a5a0a' }]}>{t("random.subtitle", "Discover something new")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Current Drink Display */}
          {currentDrink && (
            <TouchableOpacity
              style={[styles.drinkCard, {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : '#C5E89A'
              }]}
              onPress={handleDrinkPress}
              activeOpacity={0.9}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={getImage(currentDrink.strDrinkThumb)}
                  style={styles.drinkImage}
                />
                {isShuffling && (
                  <View style={styles.shuffleOverlay}>
                    <Sparkle size={40} color="#fff" weight="fill" />
                  </View>
                )}
              </View>

              <View style={[styles.drinkInfo, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(196, 232, 154, 0.3)' }]}>
                <Text style={[styles.drinkName, { color: isDarkMode ? '#fff' : '#1a1a1a' }]} numberOfLines={2}>
                  {currentDrink.strDrink}
                </Text>
                {currentDrink.strDrinkJa && (
                  <Text style={[styles.drinkNameJa, { color: isDarkMode ? '#e0e0e0' : '#3a5a0a' }]} numberOfLines={1}>
                    {currentDrink.strDrinkJa}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* Shuffle Button */}
          <TouchableOpacity
            style={[styles.shuffleButton, isShuffling && styles.shuffleButtonActive]}
            onPress={handleShuffle}
            disabled={isShuffling}
          >
            <LinearGradient
              colors={isDarkMode
                ? [colors.primary, colors.accent]
                : ['#58CC02', '#3ea055']
              }
              style={styles.shuffleGradient}
            >
              <Sparkle
                size={24}
                color={isDarkMode ? "#fff" : "#fff"}
                weight="bold"
                style={[isShuffling && { transform: [{ rotate: '180deg' }] }]}
              />
              <Text style={[styles.shuffleText, { color: isDarkMode ? '#fff' : '#fff' }]}>
                {isShuffling ? t("random.shuffling", "Shuffling...") : t("random.shuffle", "Shuffle")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={[styles.hintText, { color: isDarkMode ? '#e0e0e0' : '#3a5a0a' }]}>
            {t("random.hint", "Tap the cocktail to view details")}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  headerGlass: {
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 18,
    borderRadius: 32,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.85,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drinkCard: {
    width: '100%',
    maxWidth: 320,
    height: 420,
    borderRadius: 28,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    overflow: 'hidden',
    marginBottom: 40,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  drinkImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  shuffleOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drinkInfo: {
    padding: 20,
    alignItems: 'center',
  },
  drinkName: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  drinkNameJa: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
  },
  shuffleButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  shuffleButtonActive: {
    opacity: 0.7,
  },
  shuffleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  shuffleText: {
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
  },
  hintText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});