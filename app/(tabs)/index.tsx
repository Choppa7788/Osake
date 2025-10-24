  // ...existing code...
  // Move this style inside StyleSheet.create below, after all other styles
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, TouchableOpacity, View, Text, ScrollView, useColorScheme, Platform, Dimensions } from 'react-native';
import { ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import { getFavoriteDrinks } from '../../assets/database/favouritesStorage';
import { useTranslation } from "react-i18next";
import "../../i18n";
import { getImage } from '@/cocktails/imagepath';
import returnMustDrink from '../services/returnMustDrink';
import cocktails from '../../assets/database/cocktails.json';
import { Wine, MagnifyingGlass, Martini, GameController } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../_layout';
import { Colors, PremiumColors } from '../../constants/Colors';
import { IndexDesignConfig, getIndexColors } from '../../constants/DesignConfig';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [favouriteDrinks, setFavouriteDrinks] = useState<{
    strDrinkJa: string; idDrink: string; strDrink: string; strDrinkThumb: string
    }[]>([]);
  const [mustDrinkDrinks, setMustDrinkDrinks] = useState<{ idDrink: string; strDrink: string; strDrinkThumb: string; strDrinkJa?: string }[]>([]);

  const popularDrinks = [
    { idDrink: '11003', strDrink: "Negroni", strDrinkJa: "ネグロに", strDrinkThumb: "11003.jpg" },
    { idDrink: '11004', strDrink: "Whiskey Sour", strDrinkJa: "ウイスキサワー", strDrinkThumb: "11004.jpg" },
    { idDrink: '11005', strDrink: "Dry Martini", strDrinkJa: "ドライマーチニ", strDrinkThumb: "11005.jpg" },
    { idDrink: '11007', strDrink: "Margarita", strDrinkJa: "マルゲリタ", strDrinkThumb: "11007.jpg" },
    { idDrink: '11000', strDrink: "Mojito", strDrinkJa: "モジト", strDrinkThumb: "11000.jpg" },
    { idDrink: '11001', strDrink: "Old Fashioned", strDrinkJa: "オールドファッション", strDrinkThumb: "11001.jpg" },
    { idDrink: '11002', strDrink: "Long Island Tea", strDrinkJa: "ロングアイランドテイ", strDrinkThumb: "11002.jpg" },
    { idDrink: '11728', strDrink: "Martini", strDrinkJa: "マーチニ", strDrinkThumb: "11728.jpg" },
  ];

  const spirits = [
    { id: '1', linkName: "Rum", name: t("bases.rum"), image: 'https://www.thecocktaildb.com/images/ingredients/rum.png', color: PremiumColors.amber },
    { id: '2', linkName: "Gin", name: t("bases.gin"), image: 'https://www.thecocktaildb.com/images/ingredients/gin.png', color: PremiumColors.emerald },
    { id: '3', linkName: "Whisky", name: t("bases.whisky"), image: 'https://www.thecocktaildb.com/images/ingredients/whisky.png', color: PremiumColors.bronze },
    { id: '4', linkName: "Vodka", name: t("bases.vodka"), image: 'https://www.thecocktaildb.com/images/ingredients/vodka.png', color: PremiumColors.platinum },
    { id: '5', linkName: "Tequila", name: t("bases.tequila"), image: 'https://www.thecocktaildb.com/images/ingredients/tequila.png', color: PremiumColors.gold },
    { id: '6', linkName: "Brandy", name: t("bases.brandy"), image: 'https://www.thecocktaildb.com/images/ingredients/brandy.png', color: PremiumColors.mahogany },
  ];

  const greet = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return t("greetings.good_morning");
    } else if (currentHour < 18) {
      return t("greetings.good_afternoon");
    } else {
      return t("greetings.good_evening");
    }
  };

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const themeColors = getIndexColors(isDarkMode);
  const config = IndexDesignConfig;

  useEffect(() => {
    const fetchFavouriteDrinks = async () => {
      try {
        const favourites = await getFavoriteDrinks();
        setFavouriteDrinks(favourites);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFavouriteDrinks();
  }, []);

  const { isPro } = useUser();

  useEffect(() => {
    const fetchMustDrinkDrinks = async () => {
      try {
        const mustDrinkIds = await returnMustDrink();
        const mustDrinkDetails = [];
        for (const id of mustDrinkIds) {
          const drink = cocktails.find((cocktail) => cocktail.idDrink === id);
          if (drink) {
            mustDrinkDetails.push({
              idDrink: drink.idDrink,
              strDrink: drink.strDrink,
              strDrinkThumb: drink.strDrinkThumb,
              strDrinkJa: drink.strDrinkJa,
            });
          }
        }
        setMustDrinkDrinks(mustDrinkDetails);
      } catch (error) {
        console.error('Error fetching mustDrink drinks:', error);
      }
    };
    fetchMustDrinkDrinks();
  }, []);


  // Remove duplicate drinks by idDrink for unique React keys
  const displayedDrinksRaw = favouriteDrinks.length >= 8
    ? favouriteDrinks.slice(0, 8)
    : [...favouriteDrinks, ...popularDrinks.slice(0, 8 - favouriteDrinks.length)];

  const displayedDrinks = displayedDrinksRaw.filter(
    (drink, index, self) => self.findIndex(d => d.idDrink === drink.idDrink) === index
  );

  const router = useRouter();

  const handleSearchPress = () => {
    router.push('/pages/search');
  };

  // Bar-inspired background: dark wood texture + warm golden gradient overlay
  // Use local asset if available, fallback to gradient only
  //const woodImage = require('../../assets/stockImg/wood_texture.jpg'); // Add your wood texture image here
  const barGradient: [string, string, string] = isDarkMode
    ? ['rgba(26,20,16,0.95)', 'rgba(45,36,25,0.95)', 'rgba(80,60,30,0.85)']
    : ['rgba(120,80,40,0.92)', 'rgba(255,215,100,0.85)', 'rgba(180,140,80,0.92)'];
  const woodTexture = isDarkMode ? '#2d2419' : '#5a4328';
  const shelfColor = isDarkMode ? '#1a1410' : '#3d2f1f';

  return (
    <View style={styles.container}>
      <LinearGradient
          colors={barGradient}
          style={[styles.barBackground, { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 1 }]}
        />
        {/* Optional: glass reflection effect */}
        <View style={styles.glassReflection} />
  <SafeAreaView style={{ flex: 1, zIndex: 2 }}>
          {/* Header */}
          <View style={[styles.headerGlass, { backgroundColor: themeColors.headerBg, borderColor: themeColors.border }]}>
            <View style={styles.headerRow}>
              <View style={[styles.headerIconCircle, { backgroundColor: themeColors.primary }]}>
                <Wine size={config.headerIcon.iconSize} color="#fff" weight="fill" />
              </View>
              <View style={styles.headerTextBlock}>
                <Text style={[styles.headerGreeting, { color: themeColors.text }]}>{greet()}</Text>
                <Text style={[styles.headerSub, { color: themeColors.textSecondary }]}>{t("greetings.subtitle", "Welcome to your cocktail journey")}</Text>
              </View>
              <TouchableOpacity style={[styles.headerSearchBtn, { backgroundColor: themeColors.accent }]} onPress={handleSearchPress}>
                <MagnifyingGlass size={config.searchButton.iconSize} color="#fff" weight="fill" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Bar Counter */}
            <View style={styles.barCounter}>
              <LinearGradient
                colors={isDarkMode ? ['#2a1f15', '#3d2f1f', '#2a1f15'] : ['#a8d08d', '#8ab870', '#546549ff']}
                style={styles.counterTop}
              >
                <View style={[styles.counterEdge, { backgroundColor: isDarkMode ? '#1a1410' : '#7ba65d' }]} />
              </LinearGradient>

              {/* Featured Cocktails on Counter - 4x2 Grid */}
              <View style={styles.counterDrinks}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? themeColors.text : '#1a1a1a' }]}>
                  {t("headers.featured", "Featured Cocktails")}
                </Text>
                <View style={styles.featuredGrid}>
                  {displayedDrinks.map((drink) => (
                    <Link key={drink.idDrink} href={`/cocktails/particulardrink?idDrink=${drink.idDrink}`} asChild>
                      <TouchableOpacity style={styles.cocktailGlass}>
                        <View style={[styles.glassBase, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                          <Image source={getImage(drink.strDrinkThumb)} style={styles.drinkImage} />
                        </View>
                        <Text style={[styles.drinkName, { color: isDarkMode ? themeColors.text : '#1a1a1a' }]} numberOfLines={2}>
                          {i18n.language === 'ja' ? drink.strDrinkJa : drink.strDrink}
                        </Text>
                      </TouchableOpacity>
                    </Link>
                  ))}
                </View>
              </View>
            </View>

            {/* Popular Bases Section (Slidable) */}
            <View style={styles.basesSection}>
              <View style={[styles.basesBackground, { backgroundColor: isDarkMode ? '#1a1410' : '#8ab870' }]}>
                <LinearGradient
                  colors={isDarkMode ? ['#2a1f15', '#1a1410', '#2a1f15'] : ['#9bc47d', '#8ab870', '#7ba65d']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.basesGradient}
                > 
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.basesScrollContent}>
                    {spirits.map((spirit) => (
                      <Link key={spirit.id} href={`/cocktails/drinkList?base=${spirit.linkName}`} asChild>
                        <TouchableOpacity style={styles.baseButton}>
                          <View style={styles.baseImageOval}>
                            <Image source={{ uri: spirit.image }} style={styles.baseImage} />
                          </View>
                          <Text style={[styles.baseLabel, { color: isDarkMode ? '#ffffff' : '#1a1a1a' }]} numberOfLines={1}>
                            {spirit.name}
                          </Text>
                        </TouchableOpacity>
                      </Link>
                    ))}
                  </ScrollView>
                </LinearGradient>
              </View>
            </View>

            {/* Must Drink at a Bar */}
            {mustDrinkDrinks.length > 0 && (
              <View style={styles.mustDrinkSection}>
                <Text style={[styles.sectionTitle, { color: isDarkMode ? themeColors.text : '#1a1a1a', marginHorizontal: 20, marginBottom: 16 }]}>
                  {t("mustDrink.must_drink", "Must Try at a Bar")}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.mustDrinkRow}>
                    {mustDrinkDrinks.map((drink) => (
                      <Link key={drink.idDrink} href={`/cocktails/particulardrink?idDrink=${drink.idDrink}`} asChild>
                        <TouchableOpacity style={styles.mustDrinkCard}>
                          <View style={[styles.mustDrinkImageContainer, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
                            <Image source={getImage(drink.strDrinkThumb)} style={styles.mustDrinkImage} />
                          </View>
                          <Text style={[styles.mustDrinkName, { color: isDarkMode ? themeColors.text : '#1a1a1a' }]} numberOfLines={2}>
                            {i18n.language === 'ja' ? drink.strDrinkJa : drink.strDrink}
                          </Text>
                        </TouchableOpacity>
                      </Link>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}

 <LinearGradient
                colors={isDarkMode ? ['#2a1f15', '#3d2f1f', '#2a1f15'] : ['#a8d08d', '#8ab870', '#546549ff']}
                style={styles.counterTop}
              >
                <View style={[styles.counterEdge, { backgroundColor: isDarkMode ? '#1a1410' : '#7ba65d' }]} />
              </LinearGradient>
            {/* Action Buttons Section */}
            <View style={styles.tableTopWrapper}>
              <LinearGradient
                colors={isDarkMode ? ['#6e4c1b', '#b88a4a', '#6e4c1b'] : ['#e7cfa2', '#f5e6c5', '#e7cfa2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tableTopBg}
              >
                <View style={styles.actionsSection}>
                  {/* What Can I Make Button */}
                  <Link href="../pages/whatCanImake" asChild>
                    <TouchableOpacity style={[styles.largeActionButton, { backgroundColor: isDarkMode ? PremiumColors.emerald : '#3ea055' }]}>
                      <View style={styles.actionButtonContent}>
                        <Martini size={48} color={isDarkMode ? "#fff" : "#000"} weight="fill" />
                        <View style={styles.actionTextContainer}>
                          <Text style={[styles.actionButtonTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{t("whatCanIMake.whatCanIMake", "What Can I Make?")}</Text>
                          <Text style={[styles.actionButtonSubtitle, { color: isDarkMode ? '#fff' : '#000' }]}>{t("whatCanIMake.subtitle", "Discover cocktails with your ingredients")}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Link>

                  {/* Truth or Dare Button */}
                  <Link href="../morePages/truthdare" asChild>
                    <TouchableOpacity style={[styles.largeActionButton, { backgroundColor: isDarkMode ? PremiumColors.amber : '#e6a800' }]}>
                      <View style={styles.actionButtonContent}>
                        <GameController size={48} color={isDarkMode ? "#fff" : "#000"} weight="fill" />
                        <View style={styles.actionTextContainer}>
                          <Text style={[styles.actionButtonTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{t("more.truth and dare", "Truth or Dare")}</Text>
                          <Text style={[styles.actionButtonSubtitle, { color: isDarkMode ? '#fff' : '#000' }]}>{t("truthdare.subtitle", "Fun party game")}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Link>
                </View>
              </LinearGradient>
              {/* Table edge: left and bottom only */}
              <View style={styles.tableEdgeLeft} />
              <View style={styles.tableEdgeBottom} />
            </View>
  


            <View style={[styles.shelfBoard, { backgroundColor: isDarkMode ? woodTexture : '#a8d08d', marginTop: 24 }]}>
              <View style={[styles.shelfUnderlay, { backgroundColor: isDarkMode ? shelfColor : '#7ba65d' }]} />
            </View>
          </ScrollView>
        </SafeAreaView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  barBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  glassReflection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },

  // Header Styles
  headerGlass: {
    marginTop: 10,
    marginBottom: 10,
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
  headerGreeting: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.85,
  },
  headerSearchBtn: {
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },

  // Bases Section Styles
  basesSection: {
    marginTop: 0,
    marginBottom: 24,
  },
  basesBackground: {
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  basesGradient: {
    paddingVertical: 8,
  },
  basesScrollContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  baseButton: {
    alignItems: 'center',
    width: 140,
  },
  baseImageOval: {
    width: 140,
    height: 180,
    backgroundColor: '#ffffff',
    borderRadius: 70,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  baseImage: {
    width: 120,
    height: 150,
    resizeMode: 'contain',
  },
  baseLabel: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.2,
  },

  // Shelf Styles
  shelfBoard: {
    height: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  shelfUnderlay: {
    height: 4,
    width: '100%',
    marginTop: 12,
    opacity: 0.5,
  },

  // Bar Counter Styles
  barCounter: {
    marginVertical: 24,
  },
  counterTop: {
    height: 40,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  counterEdge: {
    height: 40,
    width: '100%',
    marginTop: 14,
  },
  counterDrinks: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  sectionTitle: {
    paddingVertical: 4,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 18,
    letterSpacing: -0.3,
  },
  featuredGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  cocktailGlass: {
    alignItems: 'center',
    width: '23%',
    minWidth: 75,
    marginBottom: 12,
  },
  glassBase: {
    width: 85,
    height: 85,
    borderRadius: 42.5,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  drinkImage: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
  },
  drinkName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },

  // Must Drink Section
  mustDrinkSection: {
    marginVertical: 24,
  },
  mustDrinkRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
  },
  mustDrinkCard: {
    alignItems: 'center',
    width: 110,
  },
  mustDrinkImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 20,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  mustDrinkImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  mustDrinkName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },

  // Action Buttons Section
  actionsSection: {
    paddingHorizontal: 20,
    marginVertical: 24,
    gap: 16,
  },
  largeActionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    minHeight: 100,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 20,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.9,
  },
  tableTopWrapper: {
    position: 'relative',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  tableTopBg: {
    borderRadius: 32,
    paddingVertical: 18,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  tableEdgeLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 30,
    height: '100%',
    borderTopLeftRadius: 32,
    borderBottomLeftRadius: 32,
    backgroundColor: 'rgba(186, 146, 85, 0.32)', // blend with table gradient
    zIndex: 2,
  },
  tableEdgeBottom: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    backgroundColor: 'rgba(186, 146, 85, 0.38)', // blend with table gradient
    zIndex: 2,
  },
  edgyBackground: {
    borderRadius: 32,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 18,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  
});
