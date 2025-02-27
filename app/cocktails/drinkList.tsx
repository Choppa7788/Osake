import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
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

    const alcoholComposition = [
        {
            name: t('bases.rum'),
            percentage: '40-50%',
            taste: t('drinkList.rum_description')
        },
        {
            name: t('bases.gin'),
            percentage: '37.5-50%',
            taste: t('drinkList.gin_description')
        },
        {
            name: t('bases.whisky'),
            percentage: '40-50%',
            taste: t('drinkList.whisky_description')
        },
        {
            name: t('bases.vodka'),
            percentage: '40-50%',
            taste: t('drinkList.vodka_description')
        },
        {
            name: t('bases.tequila'),
            percentage: '35-55%',
            taste: t('drinkList.tequila_description')
        },
        {
            name: t('bases.brandy'),
            percentage: '35-60%',
            taste: t('drinkList.brandy_description')
        }
    ];

    const alcoholInfo = alcoholComposition.find(item => item.name.toLowerCase() === base.toLowerCase());

    useLayoutEffect(() => {
        navigation.setOptions({
            title: '',
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, base]);

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                // Filter drinks based on the base alcohol type
                const filteredDrinks = cocktails.filter((drink) =>
                    drink.strIngredient1.toLowerCase() === base.toLowerCase() ||
                    drink.strIngredient2?.toLowerCase() === base.toLowerCase() ||
                    drink.strIngredient3?.toLowerCase() === base.toLowerCase()
                );
    
                // Extract ingredients
                const drinksWithIngredients = filteredDrinks.map((drink) => {
                    const ingredients: string[] = [];
                    for (let i = 1; i <= 15; i++) {
                        const ingredientKey = `strIngredient${i}` as keyof typeof drink;
                        if (drink[ingredientKey]) {
                            ingredients.push(drink[ingredientKey] as string);
                        }
                    }
                    return { ...drink, ingredients };
                });
    
                setDrinkList(drinksWithIngredients);
            } catch (error) {
                console.error("Error fetching drinks:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchDrinks();
    }, [base]);

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
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.baseText}>{base}{t("drinkList.based_on")}</Text>
                <View style={styles.headerContentContainer}>  
                    <Image source={{ uri: `https://www.thecocktaildb.com/images/ingredients/${base}-Medium.png` }} style={styles.headerImage} />
                    {alcoholInfo && (
                        <View style={styles.alcoholInfoContainer}>
                            <Text style={styles.alcoholInfoText}>Alcohol Percentage: {alcoholInfo.percentage}</Text>
                            <Text style={styles.alcoholInfoText1}>Taste: {alcoholInfo.taste}</Text>
                        </View>
                    )}
                </View>
            </View>
            {Array.isArray(drinkList) && drinkList.map((drink, index) => (
                <Link key={index} href={`/cocktails/particulardrink?idDrink=${drink.idDrink}`} asChild>
                    <TouchableOpacity style={styles.drinkContainer}>
                        <Image source={getImage(drink.strDrinkThumb)} style={styles.drinkImage} />
                        <View style={styles.drinkDetails}>
                            <Text style={styles.drinkName}>{drink.strDrink}</Text>
                            <Text style={styles.ingredientsText}>{drink.ingredients.join(', ')}</Text>
                        </View>
                        
                    </TouchableOpacity>
                </Link>
            ))}
        </ScrollView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#D9DFC6',
        borderRadius: 8,
        padding: 16,
        overflow: 'hidden',
    },
    headerContentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    headerImage: {
        width: 100,
        height: 200,
        marginBottom: 10,
        resizeMode: 'cover',
        borderRadius: 8,
    },
    baseText: {
        fontSize: 32,
        width: width - 32,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center',
         color: 'black',
        fontFamily: 'Gerorgia',
        padding: 10,
        borderRadius: 10,
    },
  
    alcoholInfoContainer: {
        marginTop: 10,
        backgroundColor: '#e3edc2',
        height: 150,
        width: 200,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    alcoholInfoText: {
        fontSize: 20,
        color: 'black',
        textAlign: 'center',

    },
    alcoholInfoText1: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',

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