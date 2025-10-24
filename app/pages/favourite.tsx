import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Dimensions, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { getFavoriteDrinks, removeFavourite } from '../../assets/database/favouritesStorage';
import { useTranslation } from 'react-i18next';
import "../../i18n";
import { getImage } from '@/cocktails/imagepath';

export default function FavouriteScreen() {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const [drinkList, setDrinkList] = useState<{
        idDrink: string;
        strDrink: string;
        strDrinkJa: string;
        strDrinkThumb: string;
        strIngredients?: string[];
        strIngredientsJA?: string[];
    }[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<string[]>([]);

    const colorScheme = useColorScheme(); // Get the current color scheme
    const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

    const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
    const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
    const headerBackgroundColor = isDarkMode ? '#403b35' : '#42db7a'; // Header background color

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favoriteDrinks = await getFavoriteDrinks(); // Fetch all favorite drinks from local storage
                setFavorites((favoriteDrinks || []).map(drink => drink.idDrink));
                setDrinkList(favoriteDrinks || []); // Set the drink list directly
            } catch (error) {
                console.error('Error fetching favorite drinks:', error);
            } finally {
                setLoading(false); // Stop loading once data is fetched
            }
        };

        fetchFavorites();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const toggleFavorite = async (idDrink: string) => {
        try {
            await removeFavourite(idDrink); // Remove the drink from favorites
            const updatedFavorites = await getFavoriteDrinks(); // Re-fetch updated favorite drinks
            setFavorites((updatedFavorites || []).map(drink => drink.idDrink));
            setDrinkList(updatedFavorites || []); // Update the drink list to re-render
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={{ flex: 1, backgroundColor }}>
            <View style={[styles.headerContainer, { backgroundColor: headerBackgroundColor }]}>
                <Ionicons style={styles.backButton} name="arrow-back" size={24} color="white" onPress={() => navigation.goBack()} />
                <View>
                    <Text style={[styles.headerText, { color: textColor }]}>{t("library.likedDrinks")}</Text>
                    <Text style={[styles.totalDrinks, { color: textColor }]}>
                        {drinkList.length === 0
                            ? t("library.noDrinks")
                            : drinkList.length === 1
                            ? t("library.oneDrink")
                            : `${drinkList.length} ${t("library.drinks")}`}
                    </Text>
                </View>
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.drinkList}>
                    {drinkList.map((drink, index) => {
                        const title = i18n.language === 'en' ? drink.strDrink : drink.strDrinkJa;
                        const ingredients =
                            i18n.language === 'ja' && Array.isArray(drink.strIngredientsJA) && drink.strIngredientsJA.length
                                ? drink.strIngredientsJA
                                : (drink.strIngredients || []);
                        const preview = ingredients.slice(0, 5).join(', ');
                        return (
                            <Link key={index} href={`/cocktails/particulardrink?idDrink=${drink.idDrink}`} asChild>
                                <TouchableOpacity style={styles.drinkContainer}>
                                    <Image source={getImage(drink.strDrinkThumb)} style={styles.drinkImage} />
                                    <View style={styles.drinkDetails}>
                                        <Text style={[styles.drinkName, { color: textColor }]} numberOfLines={1}>
                                            {title}
                                        </Text>
                                        {!!preview && (
                                            <Text style={styles.ingredientsPreview} numberOfLines={2}>
                                                {preview}
                                            </Text>
                                        )}
                                    </View>
                                    <TouchableOpacity onPress={() => toggleFavorite(drink.idDrink)}>
                                        <FontAwesome name={favorites.includes(drink.idDrink) ? 'heart' : 'heart-o'} size={24} color="red" />
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            </Link>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: 56,
        left: 16,
        zIndex: 20,
        padding: 10,
    },
    headerContainer: {
        paddingLeft: 70,
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'column',
        minHeight: 120,
    },
    headerText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#fff',
        justifyContent: 'center',
    },
    totalDrinks: {
        fontSize: 15,
        color: '#fff',
        marginTop: 5,
    },
    container: {
        paddingTop: 10,
    },
    drinkList: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    drinkContainer: {
        width: '100%',
       
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 70, // allow space for preview
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
    ingredientsPreview: {
        marginTop: 4,
        fontSize: 12,
        color: '#9aa0a6',
    },
});
