import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { deleteDrinkFromDatabase, getSavedDrinks, updateDrinkNotesInDatabase } from '../services/database'; // Import the delete, update, and get functions

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

    useEffect(() => {
        if (drink) {
            const parsedDrink = JSON.parse(drink as string);
            setDrinkData(parsedDrink);
            setNotes(parsedDrink.notes);
            navigation.setOptions({
                title: parsedDrink.name,
                headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
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
            "Delete Drink",
            "Are you sure you want to delete this drink?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: async () => {
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
                <Text style={styles.title}>Drink not found</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.container}>
                <Text style={styles.title}>{drinkData.name}</Text>
                {drinkData.image && <Image source={{ uri: drinkData.image }} style={styles.image} />}
                <Text style={styles.subtitle}>Ingredients:</Text>
                <View style={styles.ingredientsBox}>
                    {drinkData.ingredients.map((item, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <Text style={styles.ingredientName}>{item.name}</Text>
                            <Text style={styles.ingredientMeasure}>{item.measure}</Text>
                        </View>
                    ))}
                </View>
                <Text style={styles.subtitle}>Glass:</Text>
                <Text style={styles.glass}>{drinkData.glass}</Text>
                <Text style={styles.subtitle}>Instructions:</Text>
                <View style={styles.instructionsBox}>
                    {drinkData.instructions.map((instruction, index) => (
                        <Text key={index} style={styles.instructions}>{instruction.step}</Text>
                    ))}
                </View>
                <Text style={styles.subtitle}>Category:</Text>
                <Text style={styles.category}>{drinkData.category}</Text>
                <Text style={styles.subtitle}>Notes:</Text>
                <TextInput
                    style={styles.notesInput}
                    multiline
                    numberOfLines={4}
                    value={notes}
                    onChangeText={handleSaveNotes}
                    placeholder="Add your notes here..."
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
        marginTop: 16,
        backgroundColor: 'red',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
