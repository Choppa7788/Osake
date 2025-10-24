import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, Link } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import "../../i18n";
import cocktails from '../../assets/database/cocktails.json';
import specialCategories from '../../assets/database/somethingSpecialCatid.json';

type SpecialCategories = {
    hard_drinks: string[];
    casual: string[];
    fruity: string[];
    creamy_desserts: string[];
    unique_taste: string[];
    soft_drinks: string[];
};

const specialCategoriesTyped: SpecialCategories = specialCategories;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getImage } from './imagepath';
import { ArrowLeft, Columns } from 'phosphor-react-native';
import { Rows } from 'phosphor-react';

export default function somethingSpecial() {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const { base: baseParam, category: categoryParam } = useLocalSearchParams();
    const base = typeof baseParam === 'string' ? baseParam : 'vodka'; // default to 'vodka' if base is undefined or not a string
    const category = typeof categoryParam === 'string' ? categoryParam : 'hard_drinks'; // Ensure a valid default value
    const [categories, setCategories] = useState<{ base: string; drinks: any[] }[]>([]);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const titleName: { [key: string]: string } = {
        hard_drinks: t("somethingCasual.hard_drinks"),
        casual: t("somethingCasual.something_casual"),
        fruity: t("somethingCasual.fruity"),
        creamy_desserts: t("somethingCasual.creamy_desserts"),
        unique_taste: t("somethingCasual.unique_taste"),
        soft_drinks: t("somethingCasual.soft_drinks"),
    };



      const colorScheme = useColorScheme(); // Get the current color scheme
          const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled
        
          const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
          const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
          const boxColor = isDarkMode ? '#121212' : '#deebc7'; // Set box color
          const boxColor1 = isDarkMode ? '#121212' : '#deebc7'; // Set box color
          const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
          const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color
          const headerBackgroundColor = isDarkMode ? '#74512D' : '#42db7a'; // Brown for dark, green for light
        
    
    const ING_IMAGES: Record<string, any> = {
  vodka: require('../../assets/stockImg/Vodka.jpeg'),
  gin: require('../../assets/ingredients/Gin.png'),
  rum: require('../../assets/ingredients/Rum.png'),

  tequila: require('../../assets/ingredients/Tequila.png'),
  whiskey: require('../../assets/stockImg/Whisky.jpeg'),
  bourbon: require('../../assets/ingredients/Bourbon.png'),
  brandy: require('../../assets/stockImg/Brandy.jpeg'),
  cognac: require('../../assets/ingredients/Cognac.png'),
  campari: require('../../assets/ingredients/Campari.png'),
  vermouth: require('../../assets/ingredients/Vermouth.png'),
  sweet_vermouth: require('../../assets/ingredients/Sweet Vermouth.png'),
  dry_vermouth: require('../../assets/ingredients/Dry Vermouth.png'),
  triple_sec: require('../../assets/ingredients/Triple Sec.png'),
  cointreau: require('../../assets/ingredients/Cointreau.png'),
  blue_curacao: require('../../assets/ingredients/Blue Curacao.png'),
  grenadine: require('../../assets/ingredients/Grenadine.png'),
  lime_juice: require('../../assets/ingredients/Lime Juice.png'),
  //lemon_juice: require('../../assets/ingredients/Lemon Juice.png'),
  orange_juice: require('../../assets/ingredients/Orange Juice.png'),
  //cranberry_juice: require('../../assets/ingredients/Cranberry Juice.png'),
  //pineapple_juice: require('../../assets/ingredients/Pineapple Juice.png'),
  grapefruit_juice: require('../../assets/ingredients/Grapefruit Juice.png'),
  //simple_syrup: require('../../assets/ingredients/Simple Syrup.png'),
//  soda_water: require('../../assets/ingredients/Soda Water.png'),
  tonic_water: require('../../assets/ingredients/Tonic Water.png'),
  ginger_beer: require('../../assets/ingredients/Ginger Beer.png'),
  mint: require('../../assets/ingredients/Mint.png'),
  basil: require('../../assets/ingredients/Basil.png'),
  sugar: require('../../assets/ingredients/Sugar.png'),
  //salt: require('../../assets/ingredients/Salt.png'),
  //cola: require('../../assets/ingredients/Cola.png'),
  bitters: require('../../assets/ingredients/Bitters.png'),
//  angostura_bitters: require('../../assets/ingredients/Angostura Bitters.png'),
};
          

    useLayoutEffect(() => {
        navigation.setOptions({
           headerShown: false,
        });
    }, [navigation, category]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const filteredDrinks = Object.keys(specialCategories)
                    .filter(key => key.toLowerCase() === category.toLowerCase()) // Ensure `category` is valid
                    .flatMap(key => specialCategoriesTyped[key as keyof SpecialCategories]);

                const filteredDrinksTyped = filteredDrinks.map(drinkId => cocktails.find(drink => drink.idDrink === drinkId)).filter(Boolean) as { ingredients: string[] }[];
                const groupedDrinks = filteredDrinksTyped.reduce((acc: { [x: string]: any[] }, drink: { ingredients: string[] }) => {
                    const baseAlcohol = drink.ingredients[0]?.toLowerCase(); // Use the first ingredient as the base alcohol
                    if (baseAlcohol) {
                        if (!acc[baseAlcohol]) {
                            acc[baseAlcohol] = [];
                        }
                        acc[baseAlcohol].push(drink);
                    }
                    return acc;
                }, {} as { [key: string]: any[] });

                const categoriesArray = Object.keys(groupedDrinks).map(base => ({
                    base,
                    drinks: groupedDrinks[base]
                }));

                setCategories(categoriesArray);
                setActiveTab(0);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [category]);

    const toggleFavorite = async (idDrink: string) => {
        setFavorites((prevFavorites) => {
            const updatedFavorites = prevFavorites.includes(idDrink)
                ? prevFavorites.filter((id) => id !== idDrink)
                : [...prevFavorites, idDrink];

            // Update AsyncStorage
            AsyncStorage.setItem('favoriteDrinks', JSON.stringify(updatedFavorites));

            return updatedFavorites;
        });
    };

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem('favoriteDrinks');
                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites));
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };

        loadFavorites();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    const baseTranslations: { [key: string]: string } = {
        vodka: i18n.language === 'ja' ? 'ウォッカ' : 'Vodka',
        gin: i18n.language === 'ja' ? 'ジン' : 'Gin',
        rum: i18n.language === 'ja' ? 'ラム' : 'Rum',
        tequila: i18n.language === 'ja' ? 'テキーラ' : 'Tequila',
        whiskey: i18n.language === 'ja' ? 'ウイスキー' : 'Whiskey',
        whisky: i18n.language === 'ja' ? 'ウイスキー' : 'Whisky',
        bourbon: i18n.language === 'ja' ? 'バーボン' : 'Bourbon',
        brandy: i18n.language === 'ja' ? 'ブランデー' : 'Brandy',
        cognac: i18n.language === 'ja' ? 'コニャック' : 'Cognac',
        amaretto: i18n.language === 'ja' ? 'アマレット' : 'Amaretto',
        campari: i18n.language === 'ja' ? 'カンパリ' : 'Campari',
        vermouth: i18n.language === 'ja' ? 'ベルモット' : 'Vermouth',
        'sweet vermouth': i18n.language === 'ja' ? 'スイートベルモット' : 'Sweet Vermouth',
        'dry vermouth': i18n.language === 'ja' ? 'ドライベルモット' : 'Dry Vermouth',
        'triple sec': i18n.language === 'ja' ? 'トリプルセック' : 'Triple Sec',
        cointreau: i18n.language === 'ja' ? 'コアントロー' : 'Cointreau',
        kahlua: i18n.language === 'ja' ? 'カルーア' : 'Kahlua',
        baileys: i18n.language === 'ja' ? 'ベイリーズ' : 'Baileys',
        sambuca: i18n.language === 'ja' ? 'サンブーカ' : 'Sambuca',
        absinthe: i18n.language === 'ja' ? 'アブサン' : 'Absinthe',
        sake: i18n.language === 'ja' ? '日本酒' : 'Sake',
        beer: i18n.language === 'ja' ? 'ビール' : 'Beer',
        wine: i18n.language === 'ja' ? 'ワイン' : 'Wine',
        champagne: i18n.language === 'ja' ? 'シャンパン' : 'Champagne',
        prosecco: i18n.language === 'ja' ? 'プロセッコ' : 'Prosecco',
        'blue curacao': i18n.language === 'ja' ? 'ブルーキュラソー' : 'Blue Curacao',
        grenadine: i18n.language === 'ja' ? 'グレナデン' : 'Grenadine',
        'lime juice': i18n.language === 'ja' ? 'ライムジュース' : 'Lime Juice',
        'lemon juice': i18n.language === 'ja' ? 'レモンジュース' : 'Lemon Juice',
        'orange juice': i18n.language === 'ja' ? 'オレンジジュース' : 'Orange Juice',
        'cranberry juice': i18n.language === 'ja' ? 'クランベリージュース' : 'Cranberry Juice',
        'pineapple juice': i18n.language === 'ja' ? 'パイナップルジュース' : 'Pineapple Juice',
        'grapefruit juice': i18n.language === 'ja' ? 'グレープフルーツジュース' : 'Grapefruit Juice',
        'lemonade': i18n.language === 'ja' ? 'レモネード' : 'Lemonade',
        'simple syrup': i18n.language === 'ja' ? 'シンプルシロップ' : 'Simple Syrup',
        'soda water': i18n.language === 'ja' ? 'ソーダ水' : 'Soda Water',
        tonic_water: i18n.language === 'ja' ? 'トニックウォーター' : 'Tonic Water',
        'ginger beer': i18n.language === 'ja' ? 'ジンジャービア' : 'Ginger Beer',
        mint: i18n.language === 'ja' ? 'ミント' : 'Mint',
        basil: i18n.language === 'ja' ? 'バジル' : 'Basil',
        sugar: i18n.language === 'ja' ? '砂糖' : 'Sugar',
        salt: i18n.language === 'ja' ? '塩' : 'Salt',
        cola: i18n.language === 'ja' ? 'コーラ' : 'Cola',
        bitters: i18n.language === 'ja' ? 'ビターズ' : 'Bitters',
        'angostura bitters': i18n.language === 'ja' ? 'アングスチュラビターズ' : 'Angostura Bitters',
        'Corona': i18n.language === 'ja' ? 'コロナ' : 'Corona',
        'Heineken': i18n.language === 'ja' ? 'ハイネケン' : 'Heineken',
        'Guinness': i18n.language === 'ja' ? 'ギネス' : 'Guinness',   
    };

    return (
        <View style={[styles.outerContainer, { backgroundColor: boxColor }]}>
            {/* Premium header (keeps original placement & height) */}
            <LinearGradient
                colors={isDarkMode ? ['#201f1d','#1a1a19','#141413'] : ['#d6ffe4','#b6f5ce','#98edbc']}
                start={{x:0,y:0}} end={{x:1,y:1}}
                style={[styles.headerContainer, styles.headerElevated]}
            >
                <Text style={[styles.headerTitle, { color: textColor }]}>{titleName[category]}</Text>
            </LinearGradient>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity>

            {/* Tabs for grouped bases */}
            <View style={styles.tabsBarContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsBarContent}
                >
                    {categories.map((cat, idx) => {
                        const baseKey = cat.base.toLowerCase();
                        const tabLabel = baseTranslations[baseKey] || cat.base.charAt(0).toUpperCase() + cat.base.slice(1);
                        
                        return (
                            <TouchableOpacity
                                key={cat.base}
                                onPress={() => setActiveTab(idx)}
                                style={[styles.tabItem, idx === activeTab && styles.tabItemActive]}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.tabText,
                                        idx === activeTab && styles.tabTextActive
                                    ]}
                                >
                                    {tabLabel}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {/* Render only the active tab's drinks */}
                {!!categories[activeTab] && (
                    <View
                        style={[
                            styles.categoryContainer,
                            isDarkMode ? styles.glassDark : styles.glassLight
                        ]}
                    >
                     

                        {categories[activeTab].drinks.map((drink) => {
                            const drinkTitle =
                                i18n.language === 'ja' && drink.strDrinkJa
                                    ? drink.strDrinkJa
                                    : drink.strDrink;
                            const ingredientsList =
                                i18n.language === 'ja' && Array.isArray(drink.ingredientsJA) && drink.ingredientsJA.length
                                    ? drink.ingredientsJA
                                    : drink.ingredients;
                            const preview = (ingredientsList || []).slice(0, 5).join(', ');

                            return (
                                <Link
                                    key={drink.idDrink}
                                    href={`/cocktails/particulardrink?idDrink=${drink.idDrink}`}
                                    asChild
                                >
                                    <TouchableOpacity
                                        style={
                                            styles.drinkContainer 
                                        }
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.nameAndIngredients}>
                                                    <Text style={[styles.drinkName, { color: textColor }]}>{drinkTitle}</Text>
                                                {/* First 5 ingredients preview */}
                                                <Text style={[styles.ingredientsPreview, { color: textColor, opacity: 0.8 }]}>
                                                    {preview}
                                                </Text>
                                        </View>
                                        <Image
                                            source={getImage(drink.strDrinkThumb)}
                                            style={styles.drinkImage}
                                        />
                                    </TouchableOpacity>
                                </Link>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    backButton: {
        top: 16,
        left: 16,
        zIndex: 20,
        padding: 10,
        marginTop: 50,
        width: 50,
      
    },
    headerContainer: {
        // base height retained
        justifyContent: 'center',
        alignItems: 'center',            // centered
        paddingHorizontal: 18,
        paddingTop: 50,
        height: 120,
        position: 'absolute',
        top: 0, left: 0, right: 0,
        zIndex: 10,
       
        overflow: 'hidden'
    },
    headerElevated: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 10
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: 0.5,
        textAlign: 'center',             // centered text
        width: '100%',                   // allow full-width centering
    },
    tabsBarContainer: {
        marginTop: 50,              // below the absolute header
        paddingTop: 8,
        paddingBottom: 6,
        paddingHorizontal: 8,
    },
    tabsBarContent: {
        paddingHorizontal: 4,
        alignItems: 'center',
    },
    tabItem: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.15)',
        backgroundColor: 'rgba(0,0,0,0.04)',
        marginRight: 8,
       
    },
    tabItemActive: {
        backgroundColor: '#1DB954',
        borderColor: '#1DB954',
    },
    tabText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        letterSpacing: 0.2,
    },
    tabTextActive: {
        color: '#fff',
    },
    container: {
        // ...existing code...
        paddingTop: 16,
        paddingBottom: 20,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    categoryContainer: {
        // ...existing code...
        paddingVertical: 18,
        paddingHorizontal: 14,
        borderRadius: 18,
        marginBottom: 16,
        width: '100%',
    },
    glassDark: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6
    },
    nameAndIngredients: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 12,
        width: '50%',
    },
    glassLight: {
        backgroundColor: 'rgba(0,0,0,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4
    },
    categoryName: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 14,
        paddingLeft: 0,
        textAlign: 'center',             // centered
        width: '100%',
    },
   
    drinkCardDark: {
           width: '100%',
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)'
    },
    drinkCardLight: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.08)'
    },
    drinkName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'left',    // changed from center
        flex: 1,              // allow text to take remaining space
        paddingRight: 12,
        maxWidth: '75%',
    },
    drinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 14,
        marginBottom: 12,
        width: '100%',
        minHeight: 70,
    },
    ingredientsPreview: {
        fontSize: 12,
        fontWeight: '500',
        width: '100%',
        textAlign: 'left',
        marginTop: 6,
        marginBottom: 8,
    },
    drinkImage: {
        width: 54,
        height: 54,
        borderRadius: 12,
        resizeMode: 'cover',
        marginLeft: 12,
    },
});
