import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { deleteDrinkFromDatabase, getSavedDrinks, updateDrinkNotesInDatabase } from '../services/database'; // Import the delete, update, and get functions
import { useTranslation } from 'react-i18next';

type Drink = {
    name: string;
    image: string;
    ingredients: { id: number, name: string, measure: string }[];
    glass: string;
    instructions: { id: number, step: string }[];
    category: string;
    notes: string;
};

export default function MyParticularDrinkScreen() {
    const { drink } = useLocalSearchParams(); // Correct way to retrieve params in expo-router
    const [drinkData, setDrinkData] = useState<Drink | null>(null);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState('');
    const navigation = useNavigation();

        const { t } = useTranslation();

    const colorScheme = useColorScheme(); // Move this inside the component
    const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

    const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
    const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
    const boxColor = isDarkMode ? '#4d4f4e' : '#deebc7'; // Set box color
    const boxColor1 = isDarkMode ? '#121212' : '#deebc7'; // Set box color
    const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
    const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color
    const headerBackgroundColor = isDarkMode ? '#403b35' : '#42db7a'; // Brown for dark, green for light
    const arrowColor = isDarkMode ? '#ffffff' : '#000000'; // Arrow color
    useEffect(() => {
        if (drink) {
            const parsedDrink = JSON.parse(drink as string);
            setDrinkData(parsedDrink);
            setNotes(parsedDrink.notes);
            navigation.setOptions({
                title:t("particularDrink.drinkName"),
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={arrowColor} />
                    </TouchableOpacity>
                ),
            });
            setLoading(false);
        }
    }, [drink, navigation]);

    useEffect(() => {
        const fetchNotes = async () => {
            if (drinkData) {
                const drinks = await getSavedDrinks();
                const updatedDrink = drinks.find((d: Drink) => d.name === drinkData.name);
                if (updatedDrink) {
                    setNotes(updatedDrink.notes);
                }
            }
        };
        fetchNotes();
    }, [drinkData]);

    const handleSaveNotes = async (text: string) => {
        if (drinkData) {
            setNotes(text);
            await updateDrinkNotesInDatabase(drinkData.name, text); // Update only the notes in the database
        }
    };

    const handleDeleteDrink = () => {
        Alert.alert(
            t("particularDrink.deleteDrink"),
            t("particularDrink.removeDrink"),
            [
                { text: t("particularDrink.cancel"), style: "cancel" },
                { text: t("particularDrink.delete"), onPress: async () => {
                    if (drinkData) {
                        await deleteDrinkFromDatabase(drinkData.name);
                        navigation.goBack();
                    }
                }},
            ],
            { cancelable: true }
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!drinkData) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>t("particularDrink.drinknotFound")</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={[styles.container, { backgroundColor }]}>
                <Text style={[styles.title, { color: textColor }]}>{drinkData.name}</Text>
                {drinkData.image && <Image source={{ uri: drinkData.image }} style={styles.image} />}
                <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.ingredients")}:</Text>
                <View style={[styles.ingredientsBox, { backgroundColor: boxColor }]}>
                    {drinkData.ingredients.map((item, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <Text style={[styles.ingredientName, { color: textColor }]}>{item.name}</Text>
                            <Text style={[styles.ingredientMeasure, { color: textColor }]}>{item.measure}</Text>
                        </View>
                    ))}
                </View>
                <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.glass")}</Text>
                <Text style={[styles.glass, { color: textColor }]}>{drinkData.glass}</Text>
                <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.instructions")}:</Text>
                <View style={[styles.instructionsBox, { backgroundColor: boxColor }]}>
                    {drinkData.instructions.map((instruction, index) => (
                        <Text key={index} style={[styles.instructions, { color: textColor }]}>{instruction.step}</Text>
                    ))}
                </View>
                <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.category")}:</Text>
                <Text style={[styles.category, { color: textColor }]}>{drinkData.category}</Text>
                <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.notes")}:</Text>
                <TextInput
                    style={[styles.notesInput, { color: textColor, backgroundColor: boxColor }]}
                    multiline
                    numberOfLines={4}
                    value={notes}
                    onChangeText={handleSaveNotes}
                    placeholder={t("particularDrink.notes_place_holder")}
                    placeholderTextColor={isDarkMode ? "#ccc" : "#555"}
                />
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteDrink}>
                    <Text style={styles.deleteButtonText}>Delete Drink</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 16,
        resizeMode: 'contain',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ingredientsBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
    },
    ingredientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 8,
    },
    ingredientName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    ingredientMeasure: {
        fontSize: 16,
        color: '#555',
    },
    glass: {
        fontSize: 18,
        marginBottom: 16,
    },
    instructionsBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 16,
    },
    instructions: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 8,
    },
    category: {
        fontSize: 18,
        marginBottom: 16,
    },
    notesInput: {
        color: 'black',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        textAlignVertical: 'top',
    },
    deleteButton: {
        marginTop: 50,
        backgroundColor: 'red',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 50,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


