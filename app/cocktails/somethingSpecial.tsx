import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, useColorScheme } from 'react-native';
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

    return (
        <View style={[styles.outerContainer, { backgroundColor: boxColor }]}>
            <View style={[styles.headerContainer, {backgroundColor: headerBackgroundColor}]}>
                <Text style={{ color: textColor, fontSize: 25,fontWeight:500, marginLeft: 10,marginTop:50 }}>{titleName[category]}</Text>
            </View>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.container}>
                {categories.map((category, index) => (
                    <View key={index} style={[styles.categoryContainer, { backgroundColor: boxColor2 }]}>
                        <Text style={[styles.categoryName, { color: textColor }]}>
                            {i18n.language === 'ja' && category.drinks[0]?.baseJA 
                                ? category.drinks[0].baseJA 
                                : category.base.charAt(0).toUpperCase() + category.base.slice(1)}
                        </Text>
                        {category.drinks.map((drink) => {
                            const drinkTitle =
                                i18n.language === 'ja' && drink.strDrinkJa ? drink.strDrinkJa : drink.strDrink; // Use strDrinkJa if language is Japanese
                            return (
                                <Link key={drink.idDrink} href={`/cocktails/particulardrink?idDrink=${drink.idDrink}`} asChild>
                                    <TouchableOpacity style={styles.drinkContainer}>
                                        <Text style={styles.drinkName}>{drinkTitle}</Text>
                                        <Image source={getImage(drink.strDrinkThumb)} style={styles.drinkImage} />
                                    </TouchableOpacity>
                                </Link>
                            );
                        })}
                    </View>
                ))}
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
        zIndex: 10,
        padding: 10,
        marginTop: 50,
        width: 50,

    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 120,
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 10
    },
    container: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 20,
    },
    categoryContainer: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 8,
        marginBottom: 10,
    },
    categoryName: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    
    },
    drinkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#2c2c2b',
        borderRadius: 8,
        marginBottom: 5,
    },
    drinkName: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
    },
    drinkImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
});
