import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { deleteDrinkFromDatabase, getSavedDrinks, updateDrinkNotesInDatabase } from '../services/database'; // Import the delete, update, and get functions
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';

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
                title:t("myBar.myParticularDrink"),
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
                {drinkData.image && (
                    <View style={styles.imageCardShadow}>
                        <Image source={{ uri: drinkData.image }} style={styles.image} />
                    </View>
                )}

                {/* Ingredients */}
                <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
                    <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.ingredients")} :</Text>
                    <View style={styles.ingredientsBoxInner}>
                        {drinkData.ingredients.map((item, index) => (
                            <View key={index} style={styles.ingredientRow}>
                                <Text style={[styles.ingredientName, { color: textColor }]}>{item.name}</Text>
                                <Text style={[styles.ingredientMeasure, { color: textColor }]}>{item.measure}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Glass */}
                <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
                    <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.glass")} :</Text>
                    <Text style={[styles.glass, { color: textColor }]}>{drinkData.glass}</Text>
                </View>

                {/* Instructions */}
                <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
                    <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.instructions")} :</Text>
                    <View style={styles.instructionsBoxInner}>
                        {drinkData.instructions.map((instruction, index) => (
                            <Text key={index} style={[styles.instructions, { color: textColor }]}>{instruction.step}</Text>
                        ))}
                    </View>
                </View>

                {/* Category */}
                <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
                    <Text style={[styles.subtitle, { color: textColor }]}>{t("myBar.category")} :</Text>
                    <Text style={[styles.category, { color: textColor }]}>{drinkData.category}</Text>
                </View>

                {/* Notes */}
                <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
                    <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.notes")} :</Text>
                    <TextInput
                        style={[styles.notesInput, { color: textColor, backgroundColor: isDarkMode ? '#232323' : '#f9f9f9' }]}
                        multiline
                        numberOfLines={4}
                        value={notes}
                        onChangeText={handleSaveNotes}
                        placeholder={t("particularDrink.notes_place_holder")}
                        placeholderTextColor={isDarkMode ? "#ccc" : "#555"}
                    />
                </View>

                {/* Delete Button */}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteDrink} activeOpacity={0.85}>
                    <LinearGradient
                        colors={['#ff5858', '#e82e2e']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.deleteGradient}
                    >
                        <Text style={styles.deleteButtonText}>{t("particularDrink.deleteDrink")}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        marginTop: 24,
        letterSpacing: 0.5,
    },
    imageCardShadow: {
        alignSelf: 'center',
        borderRadius: 18,
        marginBottom: 18,
        marginTop: 6,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
        backgroundColor: 'transparent',
    },
    image: {
        width: 320,
        height: 220,
        borderRadius: 18,
        resizeMode: 'cover',
    },
    // Glass card
    card: {
        borderRadius: 18,
        marginHorizontal: 16,
        marginBottom: 18,
        padding: 18,
        borderWidth: 1,
    },
    cardDark: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderColor: 'rgba(255,255,255,0.10)',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    cardLight: {
        backgroundColor: 'rgba(0,0,0,0.04)',
        borderColor: 'rgba(0,0,0,0.08)',
        shadowColor: '#000',
        shadowOpacity: 0.10,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.2,
    },
    ingredientsBoxInner: {
        // Remove border, padding handled by card
    },
    ingredientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingVertical: 7,
    },
    ingredientName: {
        fontSize: 16,
        fontWeight: '600',
    },
    ingredientMeasure: {
        fontSize: 15,
        opacity: 0.8,
    },
    glass: {
        fontSize: 16,
        marginBottom: 2,
        marginTop: 2,
    },
    instructionsBoxInner: {
        // Remove border, padding handled by card
    },
    instructions: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 6,
    },
    category: {
        fontSize: 16,
        marginBottom: 2,
        marginTop: 2,
    },
    notesInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 14,
        marginTop: 6,
        marginBottom: 0,
        backgroundColor: '#f9f9f9',
        textAlignVertical: 'top',
        fontSize: 15,
    },
    deleteButton: {
        marginTop: 30,
        marginBottom: 40,
        marginHorizontal: 40,
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 2,
    },
    deleteGradient: {
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 24,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
});


