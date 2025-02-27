import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import alcoholCompositionDB from '../../assets/database/alcoholComp';
import { addFavourite, removeFavourite, isFavourite } from '../../assets/database/favouritesStorage';
import { getNotes, saveNotes } from '../../assets/database/notesDatabase';
import { getImage } from './imagepath';
import * as FileSystem from 'expo-file-system';

type Drink = {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
    strCategory: string;
    strInstructions: string;
    [key: string]: any; // To accommodate dynamic ingredient and measure fields
};

const convertOzToMl = (measure: string) => {
    const ozToMl = 29.5735;
    const regex = /(\d+(\.\d+)?)(?:\s*-\s*(\d+(\.\d+)?))?\s*oz/;
    const match = measure.match(regex);

    if (match) {
        const lowerBound = parseFloat(match[1]) * ozToMl;
        const upperBound = match[3] ? parseFloat(match[3]) * ozToMl : null;

        if (upperBound) {
            return `${lowerBound.toFixed(2)}-${upperBound.toFixed(2)} ml`;
        } else {
            return `${lowerBound.toFixed(2)} ml`;
        }
    }

    return measure; // Return the original measure if it doesn't match the pattern
};

export default function ParticularDrinkScreen() {
    const { idDrink } = useLocalSearchParams(); // Correct way to retrieve params in expo-router
    const [drink, setDrink] = useState<Drink | null>(null);
    const [loading, setLoading] = useState(true);
    const [servings, setServings] = useState(1);
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(false);
    const [notes, setNotes] = useState('');

    const fetchDrinkDetails = async () => {
        try {
            const cocktails = require('../../assets/database/cocktails.json');
            const drinkDetails = cocktails.find((drink: Drink) => drink.idDrink === idDrink);
            setDrink(drinkDetails || null);
            if (drinkDetails) {
                setNotes(drinkDetails.strNotes || '');
                navigation.setOptions({
                    title: drinkDetails.strCategory,
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                    ),
                });
            }
        } catch (error) {
            console.error('Error fetching drink details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (idDrink) fetchDrinkDetails();
        const checkFavourite = async () => {
            if (typeof idDrink === 'string') {
                const fav = await isFavourite(idDrink);
                setIsFavorite(fav);
            }
        };
        checkFavourite();
    }, [idDrink]);

    useEffect(() => {
        const fetchNotes = async () => {
            if (typeof idDrink === 'string') {
                const savedNotes = await getNotes(idDrink);
                setNotes(savedNotes || '');
            }
        };
        fetchNotes();
    }, [idDrink]);

    const handleSaveNotes = async (text: string) => {
        if (drink) {
            setNotes(text);
            await saveNotes(drink.idDrink, text);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!drink) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Drink not found</Text>
            </View>
        );
    }

    const ingredients = [];
    let totalAlcoholComposition = 0;
    let alcoholicIngredientCount = 0;

    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        let measure = drink[`strMeasure${i}`];
        if (ingredient) {
            const alcoholInfo = alcoholCompositionDB.find(item => item.name.toLowerCase() === ingredient.toLowerCase());
            const abv = alcoholInfo ? alcoholInfo.abv : '0';
            if (measure) {
                measure = convertOzToMl(measure);
                const measureValue = parseFloat(measure.replace(/[^\d.-]/g, ''));
                if (!isNaN(measureValue)) {
                    measure = `${(measureValue * servings).toFixed(2)} ml`;
                } else {
                    measure = '';
                }
            }
            ingredients.push({ ingredient, measure, abv });
            if (alcoholInfo) {
                totalAlcoholComposition += parseInt(abv.split('-')[0], 10); // Taking the lower bound of the ABV range
                alcoholicIngredientCount++;
            }
        }
    }

    const averageAlcoholComposition = alcoholicIngredientCount > 0 ? (totalAlcoholComposition / alcoholicIngredientCount).toFixed(2) : '0';

    const instructions = drink.strInstructions.split('. ').map((instruction, index) => `Step ${index + 1}: ${instruction.trim()}`);

    const handleAddToFavourite = async () => {
        if (drink) {
            if (isFavorite) {
                await removeFavourite(drink.idDrink);
            } else {
                await addFavourite({
                    idDrink: drink.idDrink,
                    strDrink: drink.strDrink,
                    strDrinkThumb: drink.strDrinkThumb,
                });
            }
            setIsFavorite(!isFavorite);
        }
    };

    const renderImage = (imagePath: string) => {
        return <Image source={getImage(imagePath)} style={styles.image} />;
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={styles.container}>
                <Text style={styles.title}>{drink.strDrink}</Text>
                {drink.strDrinkThumb && renderImage(drink.strDrinkThumb)}

                {parseFloat(averageAlcoholComposition as string) > 0 && (
                    <Text style={styles.alcoholComposition}>Average Alcohol Composition: {averageAlcoholComposition}%</Text>
                )}
                <Text style={styles.warning}>* Could differ depending on volume of other ingredients</Text>
                <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>Servings: {servings}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={servings}
                        onValueChange={(value: number) => setServings(value)}
                    />
                </View>
                <Text style={styles.subtitle}>Ingredients:</Text>
                <View style={styles.ingredientsBox}>
                    {ingredients.map((item, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <Text style={[styles.ingredient, item.abv !== '0' && styles.alcoholicIngredient]}>
                                <Text style={styles.ingredientName}>{item.ingredient}</Text>
                            </Text>
                            {item.measure && <Text style={styles.ingredientMeasure}>{item.measure}</Text>}
                        </View>
                    ))}
                </View>
                <Text style={styles.subtitle}>Instructions:</Text>
                <View style={styles.instructionsBox}>
                    {instructions.map((instruction, index) => (
                        <Text key={index} style={styles.instructions}>{instruction}</Text>
                    ))}
                </View>
                <Text style={styles.subtitle}>Notes:</Text>
                <TextInput
                    style={styles.notesInput}
                    multiline
                    numberOfLines={4}
                    value={notes}
                    onChangeText={handleSaveNotes}
                    placeholder="Add your notes here..."
                />
                <TouchableOpacity style={styles.favouriteButton} onPress={handleAddToFavourite}>
                    <Text>{isFavorite ? 'Remove from Favourite' : 'Add to Favourite'}</Text>
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
    alcoholComposition: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10, // Changed from 8 to 10
        marginBottom: 16,
        resizeMode: 'contain', // Added to contain the whole image within the specified size
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sliderContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    sliderLabel: {
        fontSize: 16,
        marginBottom: 8,
    },
    slider: {
        width: '80%',
        height: 40,
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
    ingredient: {
        fontSize: 16,
        lineHeight: 24,
    },
    ingredientName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    ingredientMeasure: {
        fontSize: 16,
        color: '#555',
    },
    alcoholicIngredient: {
        color: 'red',
    },
    warning: {
        fontSize: 7,
        color: 'red',
        textAlign: 'center',
        marginTop: -8,
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
    favouriteButton: {
        marginTop: 16,
        marginBottom: 50,
        backgroundColor: 'red',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
});
