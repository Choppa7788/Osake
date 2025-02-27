import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
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
import { ArrowLeft } from 'phosphor-react-native';

export default function somethingSpecial() {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const { base: baseParam, category: categoryParam } = useLocalSearchParams();
    const base = typeof baseParam === 'string' ? baseParam : 'vodka'; // default to 'vodka' if base is undefined or not a string
    const category = typeof categoryParam === 'string' ? categoryParam : 'hard'; // default to 'hard' if category is undefined or not a string
    const [categories, setCategories] = useState<{ base: string; drinks: any[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);
    const titleName: { [key: string]: string } = {
        hard_drinks: t("somethingCasual.hard_drinks"),
        casual: t("somethingCasual.casual"),
        fruity: t("somethingCasual.fruity"),
        creamy_desserts: t("somethingCasual.creamy_desserts"),
        unique_taste: t("somethingCasual.unique_taste"),
        soft_drinks: t("somethingCasual.soft_drinks"),
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: titleName[category] || category.charAt(0).toUpperCase() + category.slice(1),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={24} color="white" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, category]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const filteredDrinks = Object.keys(specialCategories)
                    .filter(key => key.toLowerCase() === category.toLowerCase())
                    .flatMap(key => specialCategoriesTyped[key as keyof SpecialCategories]);

                const filteredDrinksTyped = filteredDrinks.map(drinkId => cocktails.find(drink => drink.idDrink === drinkId)).filter(Boolean) as { strIngredient1: string }[];
                const groupedDrinks = filteredDrinksTyped.reduce((acc: { [x: string]: any[]; }, drink: { strIngredient1: string; }) => {
                    const baseAlcohol = drink.strIngredient1.toLowerCase();
                    if (!acc[baseAlcohol]) {
                        acc[baseAlcohol] = [];
                    }
                    acc[baseAlcohol].push(drink);
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
        <ScrollView contentContainerStyle={styles.container}>
            {categories.map((category, index) => (
                <View key={index} style={styles.categoryContainer}>
                    <Text style={styles.categoryName}>{category.base.charAt(0).toUpperCase() + category.base.slice(1)}</Text>
                    {category.drinks.map((drink) => (
                        <Link key={drink.idDrink} href={`/cocktails/particulardrink?idDrink=${drink.idDrink}`} asChild>

                              <TouchableOpacity style={styles.drinkContainer}>
                                <Text style={styles.drinkName}>{drink.strDrink}</Text>
                                <Image source= {getImage(drink.strDrinkThumb) } style={styles.drinkImage} />
                              </TouchableOpacity>
                                </Link>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    categoryContainer: {
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#1c1c1b',
        marginBottom: 10,
    },
    categoryName: {
        fontSize: 18,
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
