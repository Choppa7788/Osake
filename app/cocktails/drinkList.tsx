import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, ImageBackground, useColorScheme } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, Link } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import cocktails from '../../assets/database/cocktails.json';
import { getImage } from './imagepath';
import { addFavourite, removeFavourite, isFavourite, getFavoriteDrinks } from '../../assets/database/favouritesStorage';
import { ArrowLeft } from 'phosphor-react-native';
import { useTranslation } from 'react-i18next';
import "../../i18n";

export default function DrinkListScreen() {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const { base: baseParam } = useLocalSearchParams();
    const base = typeof baseParam === 'string' ? baseParam : 'vodka'; // default to 'vodka' if base is undefined or not a string
    const [drinkList, setDrinkList] = useState<{ idDrink: string; strDrinkThumb: string; strDrink: string; ingredients: string[], [key: string]: any }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    const colorScheme = useColorScheme(); // Get the current color scheme
    const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled
    useLayoutEffect(() => {
        navigation.setOptions({
         headerShown:false,
        });
    }, [navigation, base]);

    const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
    const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
    const boxColor = isDarkMode ? '#121212' : '#deebc7'; // Set box color
    const boxColor1 = isDarkMode ? '#121212' : '#deebc7'; // Set box color
    const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
    const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color

    const alcoholComposition = [
        {
            name: t('bases.rum'),
            percentage: '40-50%',
            taste: t('drinkList.rum_description'),
            image:require('../../assets/stockImg/Rum.jpeg'),
        },
        {
            name: t('bases.gin'),
            percentage: '37.5-50%',
            taste: t('drinkList.gin_description'),
            image:require('../../assets/stockImg/Gin.jpeg'),
        },
        {
            name: t('bases.whisky'),
            percentage: '40-50%',
            taste: t('drinkList.whisky_description'),
            image:require('../../assets/stockImg/Whisky.jpeg'),
        },
        {
            name: t('bases.vodka'),
            percentage: '40-50%',
            taste: t('drinkList.vodka_description'),
            image:require('../../assets/stockImg/Vodka.jpeg'),
        },
        {
            name: t('bases.tequila'),
            percentage: '35-55%',
            taste: t('drinkList.tequila_description'),
            image:require('../../assets/stockImg/Tequila.jpeg'),
        },
        {
            name: t('bases.brandy'),
            percentage: '35-60%',
            taste: t('drinkList.brandy_description'),
            image:require('../../assets/stockImg/Brandy.jpeg'),
        }
    ];

    const alcoholInfo = alcoholComposition.find(item => 
        item.name.toLowerCase() === base.toLowerCase() || 
        t(`bases.${base.toLowerCase()}`).toLowerCase() === item.name.toLowerCase()
    );

    
    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                // Filter drinks based on the base alcohol type
                const filteredDrinks = cocktails.filter((drink) =>
                    (drink.ingredients ?? []).some((ingredient) => ingredient.toLowerCase() === base.toLowerCase())
                );

                // Use the appropriate ingredients array based on the language
                const drinksWithIngredients = filteredDrinks.map((drink) => ({
                    ...drink,
                    ingredients: (i18n.language === 'ja' ? drink.ingredientsJA : drink.ingredients) ?? [],
                }));

                setDrinkList(drinksWithIngredients);
            } catch (error) {
                console.error("Error fetching drinks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrinks();
    }, [base, i18n.language]);

    useEffect(() => {
        const loadFavorites = async () => {
            const storedFavorites = await getFavoriteDrinks();
            if (storedFavorites) {
                setFavorites(storedFavorites);
            }
        };

        loadFavorites();
    }, []);

    const handleAddToFavourite = async (drink: { idDrink: string }) => {
        const isFav = await isFavourite(drink.idDrink);
        let updatedFavorites;
        if (isFav) {
            updatedFavorites = favorites.filter(id => id !== drink.idDrink);
            await removeFavourite(drink.idDrink);
        } else {
            updatedFavorites = [...favorites, drink.idDrink];
            await addFavourite(drink);
        }
        setFavorites(updatedFavorites);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <><View style={[styles.headerContainer, { backgroundColor: boxColor2 }]}>
            {alcoholInfo && <Text style={[styles.title, { color: textColor }]}>{alcoholInfo.name}</Text>}
        </View><TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons style={styles.headerBack} name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity><ScrollView contentContainerStyle={styles.container}>

                <ImageBackground source={alcoholInfo?.image} style={styles.headerContainer1}>
                </ImageBackground>
                <View style={styles.headerContentContainer}>
                    {alcoholInfo && (
                        <View style={styles.alcoholInfoContainer}>
                            <Text style={[styles.alcoholInfoText, { color: textColor }]}>Alcohol Percentage: {alcoholInfo.percentage}</Text>
                            <Text style={[styles.alcoholInfoText1, { color: textColor }]}>Taste: {alcoholInfo.taste}</Text>
                        </View>
                    )}
                </View>

                {Array.isArray(drinkList) && drinkList.map((drink, index) => {
                    const drinkName = i18n.language === 'ja' ? drink.strDrinkJa : drink.strDrink;
                    return (
                        <Link
                            key={index}
                            href={{
                                pathname: "./particulardrink",
                                params: { idDrink: drink.idDrink }
                            }}
                            asChild
                        >
                            <TouchableOpacity style={styles.drinkContainer}>
                                <Image source={getImage(drink.strDrinkThumb)} style={styles.drinkImage} />
                                <View style={styles.drinkDetails}>
                                    <Text style={styles.drinkName}>{drinkName}</Text>
                                    <Text style={styles.ingredientsText}>{drink.ingredients.join(', ')}</Text>
                                </View>
                            </TouchableOpacity>
                        </Link>
                    );
                })}
            </ScrollView></>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    headerBack:{
        marginTop:-10,
        paddingBottom: 10,
        marginLeft: -10,
    
    },
    title: {
        fontSize: 32,
        height: 50,
        fontWeight: 'bold',
        marginTop:50,

        textAlign: 'center',
    },
    headerContainer1: {
        alignItems: 'center',
        marginTop: 120,
        height: 300,
        backgroundColor: '#D9DFC6',
        borderRadius: 8,
        padding: 16,
        overflow: 'hidden',
        paddingTop: 250,
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 120,
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 10
    },
    headerContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center content horizontally
        position: 'relative', // Enable positioning for background image
    },
    alcoholInfoContainer: {
        height: 100,
        width: '98%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    alcoholInfoText: {
        fontSize: 15,
        color: 'black',
        textAlign: 'center',

    },
    alcoholInfoText1: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',

    },
    backButton: {
        position: 'absolute',
        top: 56,
        left: 16,
        zIndex: 20,
        padding: 10,
        width: 50,
    },
    drinkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: width - 32,
        height: 100,
        marginBottom: 7,
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#1c1c1b',
    },
    drinkImage: {
        width: 50,
        height: 50,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    drinkDetails: {
        flex: 1,
        marginLeft: 10,
    },
    drinkName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    ingredientsText: {
        fontSize: 14,
        color: 'white',
    },
});