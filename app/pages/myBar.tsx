import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, useColorScheme } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getSavedDrinks } from '../services/database'; // Import the database function
import "../../i18n";
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { Ionicons } from '@expo/vector-icons';

export default function MyBar() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const router = useRouter();
    const [savedDrinks, setSavedDrinks] = useState<{ name: string, image: string, ingredients: any[], glass: string, instructions: any[], category: string, notes: string }[]>([]);

    
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
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('./addDrink')}>
                <Text style={styles.addButtonText}>{t("myBar.addNew")}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{t("myBar.myDrinks")}</Text>

            {savedDrinks.length === 0 ? (
                <Text style={styles.noDrinksText}>{t("myBar.noDrinks")}</Text>
            ) : (
                savedDrinks.map((drink, index) => (
                    <TouchableOpacity key={index} style={[styles.drinkCard,{backgroundColor}]} onPress={() => handleDrinkPress(drink)}>
                        <Text style={[styles.drinkName,{color:textColor}]}>{drink.name}</Text>
                        {drink.image ? (
                            <Image source={{ uri: drink.image }} style={styles.drinkImage} />
                        ) : (
                            <Text style={styles.noImageText}></Text>
                        )}
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    addButton: {
        marginBottom: 16,
        backgroundColor: '#007BFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    noDrinksText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    drinkCard: {
        height: 80,
        flexDirection: 'row',
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    drinkName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    drinkImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    noImageText: {
        fontSize: 14,
        color: '#888',
    },
});
