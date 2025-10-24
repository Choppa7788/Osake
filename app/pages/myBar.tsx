import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, useColorScheme } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getSavedDrinks } from '../services/database'; // Import the database function
import "../../i18n";
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MyBar() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const router = useRouter();
    const [savedDrinks, setSavedDrinks] = useState<{
        name: string,
        image: string,
        ingredients: any[],
        glass: string,
        instructions: any[],
        category: string,
        notes: string
    }[]>([]);

    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} onPress={() => navigation.goBack()} />
                
            ),
            title: t("myBar.pageTitle"),
        });
    }, [navigation]);

    const fetchDrinks = async () => {
        const drinks = await getSavedDrinks();
        setSavedDrinks(drinks);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchDrinks();
        }, [])
    );

    const handleDrinkPress = (drink: { name: string, image: string, ingredients: any[], glass: string, instructions: any[], category: string, notes: string }) => {
        router.push({
            pathname: './myparticulardrink',
            params: { drink: JSON.stringify(drink) }
        });
    };


     const colorScheme = useColorScheme(); // Get the current color scheme
          const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled
        
          const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
          const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
          const boxColor = isDarkMode ? '#4d4f4e' : '#deebc7'; // Set box color
          const boxColor1 = isDarkMode ? '#121212' : '#deebc7'; // Set box color
          const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
          const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color
          const headerBackgroundColor = isDarkMode ? '#403b35' : '#42db7a'; // Brown for dark, green for light
        
    
    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('./addDrink')} activeOpacity={0.9}>
                <LinearGradient
                    colors={isDarkMode ? ['#1DB954', '#179c49'] : ['#36e482', '#1fc062']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.addButtonGradient}
                >
                    <Text style={styles.addButtonText}>{t("myBar.addNew")}</Text>
                </LinearGradient>
            </TouchableOpacity>

            <Text style={[styles.title, { color: textColor }]}>{t("myBar.myDrinks")}</Text>

            {savedDrinks.length === 0 ? (
                <Text style={styles.noDrinksText}>{t("myBar.noDrinks")}</Text>
            ) : (
                savedDrinks.map((drink, index) => {
                    // Get first 5 ingredient names (if present)
                    const preview = Array.isArray(drink.ingredients)
                        ? drink.ingredients.slice(0, 5).map(ing =>
                            typeof ing === 'string'
                                ? ing
                                : (ing?.name || '')
                        ).filter(Boolean).join(', ')
                        : '';
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.drinkCard, isDarkMode ? styles.cardDark : styles.cardLight]}
                            onPress={() => handleDrinkPress(drink)}
                            activeOpacity={0.85}
                        >
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={[styles.drinkName, { color: textColor }]}>{drink.name}</Text>
                                {!!preview && (
                                    <Text style={styles.ingredientsPreview} numberOfLines={2}>
                                        {preview}
                                    </Text>
                                )}
                            </View>
                            {drink.image ? (
                                <Image source={{ uri: drink.image }} style={styles.drinkImage} />
                            ) : (
                                <Text style={styles.noImageText}></Text>
                            )}
                        </TouchableOpacity>
                    );
                })
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 24,
    },
    addButton: {
        marginBottom: 16,
        borderRadius: 28,
        overflow: 'hidden',
    },
    addButtonGradient: {
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    noDrinksText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    drinkCard: {
        height: undefined,
        minHeight: 84,
        borderWidth: 1,
        borderColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
        padding:5
    },
    // Glass card variants
    cardDark: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.10)',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    cardLight: {
        backgroundColor: 'rgba(0,0,0,0.04)',
        borderColor: 'rgba(0,0,0,0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    drinkName: {
        fontSize: 18,
        fontWeight: '800',
    },
    ingredientsPreview: {
        marginTop: 4,
        fontSize: 12,
        color: '#9aa0a6',
    },
    drinkImage: {
        width: 64,
        height: 64,
        borderRadius: 12,
    },
    noImageText: {
        fontSize: 14,
        color: '#888',
    },
});
