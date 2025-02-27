import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { getSavedDrinks } from '../services/database'; // Import the database function
import "../../i18n";
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';

export default function MyBar() {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const router = useRouter();
    const [savedDrinks, setSavedDrinks] = useState<{ name: string, image: string, ingredients: any[], glass: string, instructions: any[], category: string, notes: string }[]>([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderBackButton onPress={() => navigation.goBack()} />
            ),
            title: 'My Bar',
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

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('./addDrink')}>
                <Text style={styles.addButtonText}>{t("mybar.addNew")}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>My Drinks</Text>

            {savedDrinks.length === 0 ? (
                <Text style={styles.noDrinksText}>No drinks saved yet.</Text>
            ) : (
                savedDrinks.map((drink, index) => (
                    <TouchableOpacity key={index} style={styles.drinkCard} onPress={() => handleDrinkPress(drink)}>
                        <Text style={styles.drinkName}>{drink.name}</Text>
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
