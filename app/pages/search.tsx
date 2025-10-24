import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, FlatList, Image, Dimensions, Keyboard, useColorScheme,TouchableWithoutFeedback  } from 'react-native';
import { MagnifyingGlass, X, LockSimple, ArrowLeft } from 'phosphor-react-native';
import { Link, useRouter } from 'expo-router';
import { getImage } from "../cocktails/imagepath.js"
import localCocktail from '../../assets/database/cocktails.json';
import { useTranslation } from "react-i18next";
import "../../i18n";
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
// New imports for premium access
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../_layout';

// Function to get color based on the 3rd letter of the drink's name
const getColorByLetter = (name: string | any[]) => {
    if (name.length < 3) return '#888'; // Default color if name is too short
    const letter: keyof typeof colorMap = name[2].toLowerCase() as keyof typeof colorMap;
    const colorMap: { [key: string]: string } = {
        a: '#FF0800', // Apple Red
        b: '#FFE135', // Banana Yellow
        c: '#32CD32', // Lime Green
        d: '#8B0000', // Dark Red
        e: '#FFD700', // Gold
        f: '#FF69B4', // Hot Pink
        g: '#FF8C00', // Dark Orange
        h: '#4B0082', // Indigo
        i: '#87CEEB', // Sky Blue
        j: '#008000', // Green
        k: '#D2691E', // Chocolate
        l: '#800000', // Maroon
        m: '#DA70D6', // Orchid
        n: '#FF4500', // Orange Red
        o: '#4682B4', // Steel Blue
        p: '#FF1493', // Deep Pink
        q: '#7B68EE', // Medium Slate Blue
        r: '#A52A2A', // Brown
        s: '#FF00FF', // Magenta
        t: '#8A2BE2', // Blue Violet
        u: '#228B22', // Forest Green
        v: '#DC143C', // Crimson
        w: '#4169E1', // Royal Blue
        x: '#9932CC', // Dark Orchid
        y: '#9ACD32', // Yellow Green
        z: '#00FFFF', // Aqua
    };
    return colorMap[letter] || '#333'; // Default to dark gray if letter is not in map
};

// Optional list item type
type DrinkListItem = {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strDrinkJa: string;
  premium?: boolean;
};

// Move cache to module scope so it's preserved for the whole app runtime
let cachedPopularFreeDrinks: DrinkListItem[] | null = null;

export default function SearchScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme(); // Get the current color scheme
    const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

    // Duolingo-style color scheme for search
    const backgroundColor = isDarkMode ? '#0F1419' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : '#3C3C43';
    const headerBackgroundColor = isDarkMode ? '#1C252E' : '#F7F7F7';
    const searchInputBackground = isDarkMode ? '#2C3E50' : '#FFFFFF';
    const cardBackground = isDarkMode ? '#1C252E' : '#FFFFFF';

    const [searchTerm, setSearchTerm] = useState('');
    const [cocktails, setCocktails] = useState<DrinkListItem[]>([]);
    const scrollY = React.useRef(new Animated.Value(0)).current;
    // Track premium access
    const [premiumActive, setPremiumActive] = useState(false);
    const { isPro } = useUser();

    const handleBackPress = () => {
        router.back();
    };

    const getRandomFreeDrinks = (numDrinks: number) => {
        // copy + filter free drinks
        const pool = [...localCocktail].filter((d: any) => !d.premium);
        // shuffle non-destructively
        const shuffled = pool.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, numDrinks);
    };

    // ensure we only generate once per app runtime (so refreshed on app open, not on each navigation)
    if (!cachedPopularFreeDrinks) {
        const selection = getRandomFreeDrinks(20).map((drink: any) => ({
            idDrink: drink.idDrink,
            strDrink: drink.strDrink,
            strDrinkThumb: drink.strDrinkThumb || '',
            strDrinkJa: drink.strDrinkJa || '',
            premium: !!drink.premium,
        }));
        cachedPopularFreeDrinks = selection;
    }
    const popularDrinks: DrinkListItem[] = cachedPopularFreeDrinks;

    // Resolve premium access once
    useEffect(() => {
      setPremiumActive(!!isPro);
    }, [isPro]);

    useEffect(() => {
        if (searchTerm.length > 0) {
            const fetchCocktails = () => {
                try {
                    const localCocktails = localCocktail || [];
                    const filteredDrinks = localCocktails.filter((drink) => 
                        drink.idDrink.includes(searchTerm) || 
                        drink.strDrink.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setCocktails(filteredDrinks.map((drink) => ({
                        idDrink: drink.idDrink,
                        strDrink: drink.strDrink,
                        strDrinkThumb: drink.strDrinkThumb || '',
                        strDrinkJa: drink.strDrinkJa || '',
                        premium: !!drink.premium,
                    })));
                } catch (error) {
                    console.error('Error fetching local cocktails:', error);
                    setCocktails([]);
                }
            };
            fetchCocktails();
        } else {
            setCocktails([]);
        }
    }, [searchTerm]);

    const gradientColors = isDarkMode
        ? ['#1a1410', '#2d2419', '#1a1410']
        : ['#D4F1A8', '#EAFFD0', '#C5E89A', '#D4F1A8'];

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <LinearGradient colors={gradientColors} style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    {/* Fixed Search Bar */}
                    <View style={[styles.searchContainer, {
                        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255, 255, 255, 0.98)',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : '#C5E89A'
                    }]}>
                        <View style={styles.headerRow}>
                            <TouchableOpacity onPress={handleBackPress} style={[styles.backButton, { backgroundColor: isDarkMode ? '#FF9600' : '#58CC02' }]}>
                                <ArrowLeft size={24} color="#FFFFFF" weight="bold" />
                            </TouchableOpacity>
                            <Text style={[styles.titleText, { color: isDarkMode ? '#fff' : '#1a1a1a' }]}>{t("search.search")}</Text>
                            <View style={styles.placeholder} />
                        </View>
                        <View style={styles.inputWrapper}>
                            <MagnifyingGlass size={20} color={isDarkMode ? '#8E8E93' : '#8E8E93'} style={styles.searchIcon} />
                            <TextInput
                                style={[styles.searchInput, { color: textColor, backgroundColor: searchInputBackground, borderColor: isDarkMode ? '#34495E' : '#E5E5E7' }]}
                                placeholder={t("search.search_placeholder")}
                                placeholderTextColor={isDarkMode ? '#8E8E93' : '#8E8E93'}
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                            />
                            {searchTerm.length > 0 && (
                                <TouchableOpacity onPress={() => { setSearchTerm(''); Keyboard.dismiss(); }} style={styles.clearButton}>
                                    <X size={20} color={textColor} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
 
                    {/* Scrollable Content */}
                    <FlatList
                        data={searchTerm.length > 0 ? cocktails : popularDrinks}
                        keyExtractor={(item, index) => item.idDrink || index.toString()} // Fix key extractor
                        renderItem={({ item }) => {
                            const drinkTitle = i18n.language === 'ja' && item.strDrinkJa ? item.strDrinkJa : item.strDrink; // Use strDrinkJa if language is Japanese
                            const showLock = item.premium === true && !premiumActive;
                            return (
                                <Link href={`/cocktails/particulardrink?idDrink=${item.idDrink}`} asChild>
                                    <TouchableOpacity activeOpacity={0.85}>
                                       <View style={[styles.card, { backgroundColor: cardBackground, borderColor: isDarkMode ? '#34495E' : '#E5E5E7' }]}>
                                         {showLock && (
                                           <View style={styles.lockBadge}>
                                             <LockSimple size={16} color="#fff" weight="fill" />
                                           </View>
                                         )}
                                         <View style={styles.cardContent}>
                                           <View style={styles.avatarWrap}>
                                             <Image source={getImage(item.strDrinkThumb)} style={styles.avatar} />
                                           </View>
                                           <View style={styles.meta}>
                                             <Text style={[styles.cardTitle, { color: textColor }]} numberOfLines={2}>{drinkTitle}</Text>
                                           </View>
                                         </View>
                                       </View>
                                    </TouchableOpacity>
                                </Link>
                            );
                        }}
                        contentContainerStyle={styles.contentContainer}
                        numColumns={2}
                        keyboardShouldPersistTaps="handled" // Ensure taps are handled even when the keyboard is open
                    />
                </SafeAreaView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
         }
         
 const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    searchContainer: {
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 18,
        borderRadius: 32,
        borderWidth: 1.5,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    placeholder: {
        width: 44,
        height: 44,
    },
    titleText: {
        flex: 1,
        fontSize: 26,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
     inputWrapper: {
         position: 'relative',
         width: '100%',
     },
     searchIcon: {
         position: 'absolute',
         color: '#888',
         left: 10,
         top: '50%',
         transform: [{ translateY: -10 }],
         zIndex: 1,
     },
     searchInput: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 12,
        paddingLeft: 44,
        paddingRight: 44,
        fontSize: 15,
     },
     clearButton: {
         position: 'absolute',
         right: 10,
         top: '50%',
         transform: [{ translateY: -10 }],
     },
     contentContainer: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 100, // Extra padding to avoid navbar overlap
        alignItems: 'center',
     },
    card: {
      height: 90,
      width: (Dimensions.get('window').width / 2) - 24,
      borderRadius: 12,
      margin: 8,
      padding: 10,
      borderWidth: 1,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
      justifyContent: 'center',
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    avatarWrap: {
      width: 67,
      height: 67,
      borderRadius: 34,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.18)',
      marginRight: 12,
    },
    avatar: {
      width: 67,
      height: 67,
      resizeMode: 'cover',
    },
    meta: {
      flex: 1,
      justifyContent: 'center',
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '800',
      marginBottom: 4,
    },
    cardSubtitle: {
      fontSize: 12,
      opacity: 0.85,
    },
     lockBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 14,
      paddingHorizontal: 8,
      paddingVertical: 6,
      zIndex: 10,
     },
});

