import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { HeaderBackButton } from '@react-navigation/elements';
import { getFavoriteDrinks, addFavourite, removeFavourite } from '../../assets/database/favouritesStorage';
import { useTranslation } from 'react-i18next';
import "../../i18n";
import { getImage } from '@/cocktails/imagepath';

export default function FavouriteScreen() {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const [drinkList, setDrinkList] = useState<{ idDrink: string; strDrink: string; strDrinkThumb: string; ingredients: string[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const favoriteDrinks = await getFavoriteDrinks();
            setFavorites((favoriteDrinks || []).map(drink => drink.idDrink));
        };

        fetchFavorites();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    useEffect(() => {
        const fetchDrinks = async () => {
            try {
                const favoriteDrinks = await getFavoriteDrinks();
                const drinksWithIngredients = await Promise.all(
                    (favoriteDrinks || []).map(async (drink) => {
                        const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drink.idDrink}`);
                        const ingredients = [];
                        for (let i = 1; i <= 3; i++) {
                            const ingredient = response.data.drinks[0][`strIngredient${i}`];
                            if (ingredient) ingredients.push(ingredient);
                        }
                        return { ...drink, ingredients };
                    })
                );
                setDrinkList(drinksWithIngredients);
            } catch (error) {
                console.error('Error fetching favorite drinks:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDrinks();
    }, []);

    const toggleFavorite = async (idDrink: string) => {
        if (favorites.includes(idDrink)) {
            await removeFavourite(idDrink);
            setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== idDrink));
        } else {
            const drink = drinkList.find(drink => drink.idDrink === idDrink);
            if (drink) {
                await addFavourite(drink);
                setFavorites((prevFavorites) => [...prevFavorites, idDrink]);
            }
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <HeaderBackButton style={styles.backButton} onPress={() => navigation.goBack()} />
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{t("library.likedDrinks")}</Text>
                <Text style={styles.totalDrinks}>{drinkList.length} drinks</Text>
            </View>
            <View style={styles.drinkList}>
                {Array.isArray(drinkList) && drinkList.map((drink, index) => (
                    <Link key={index} href={`/cocktails/particulardrink?idDrink=${drink.idDrink}`} asChild>
                        <TouchableOpacity style={styles.drinkContainer}>
                            <Image source={getImage(drink.strDrinkThumb)} style={styles.drinkImage} />
                            <View style={styles.drinkDetails}>
                                <Text style={styles.drinkName}>{drink.strDrink}</Text>
                                <Text style={styles.ingredients}>{drink.ingredients.join(', ')}</Text>
                            </View>
                            <TouchableOpacity onPress={() => toggleFavorite(drink.idDrink)}>
                                <FontAwesome name={favorites.includes(drink.idDrink) ? 'heart' : 'heart-o'} size={24} color="red" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Link>
                ))}
            </View>
        </ScrollView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    backButton: {
        marginTop: 40,
    },
    container: {
        padding: 16,
        backgroundColor: '#000',
    },
    headerContainer: {
    
        borderRadius: 8,
        padding: 16,
        overflow: 'hidden',
        flexDirection: 'column',
   
    },
    headerText: {
        fontSize: 35,
        fontWeight: 'bold',
        marginLeft: -10,
        color: '#fff',
    },
    totalDrinks: {
        fontSize: 15,
        color: '#fff',
        marginLeft: -10,
    },
    drinkList: {
        marginTop: 50,
        backgroundColor: '#242322',
        borderRadius: 8,
        padding: -16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    drinkContainer: {
        
        marginTop: 10,
        width: width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 70,
        marginBottom: 7,
        padding: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    drinkImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 10,
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
    ingredients: {
        fontSize: 14,
        color: 'gray',
    },
});
