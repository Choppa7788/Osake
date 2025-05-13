import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addFavourite, removeFavourite, isFavourite } from '../../assets/database/favouritesStorage';
import { getNotes, saveNotes } from '../../assets/database/notesDatabase';
import { getImage } from './imagepath';
import { useTranslation } from 'react-i18next';
import "../../i18n";
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { Headlights } from 'phosphor-react-native';

type Drink = {
    strDrinkJa: string;
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
    strCategory: string;
    strInstructions: string;
    strInstructionsJA?: string;
    ingredients: string[];
    ingredientsJA: string[];
    strAlcoholic: string;
    strGlass: string;
    measures: string[];
    measuresJA: string[];
    isFree:boolean; 
};

export default function ParticularDrinkScreen() {
    const { idDrink } = useLocalSearchParams();
    const [drink, setDrink] = useState<Drink | null>(null);
    const [loading, setLoading] = useState(true);
    const [servings, setServings] = useState(1);
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(false);
    const [notes, setNotes] = useState('');
    const { t, i18n } = useTranslation();
    const [unit, setUnit] = useState<'standard' | 'ml' | 'oz'>('standard');
    const [isPremium, setIsPremium] = useState(false); // State to track if the drink is premium
    const [hasPremiumAccess, setHasPremiumAccess] = useState(false); // State to track premium access
    
    const colorScheme = useColorScheme(); // Move this inside the component
    const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

    const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
    const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
    const boxColor = isDarkMode ? '#121212' : '#deebc7'; // Set box color
    const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
    const headerBackgroundColor = isDarkMode ? '#74512D' : '#42db7a'; // Brown for dark, green for light

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation, isDarkMode, drink?.strCategory]);

    const fetchDrinkDetails = async () => {
        try {
            const cocktails = require('../../assets/database/cocktails.json');
            const drinkDetails = cocktails.find((drink: Drink) => drink.idDrink === idDrink);
            setDrink(drinkDetails || null);
            if (drinkDetails) {
                setNotes(drinkDetails.strNotes || '');
                
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

    useEffect(() => {
        const fetchPremiumAccess = async () => {
            try {
                const premiumAccess = await AsyncStorage.getItem('hasPremiumAccess');
                setHasPremiumAccess(premiumAccess === 'true'); // Set state based on stored value
            } catch (error) {
                console.error('Error fetching premium access:', error);
            }
        };

        fetchPremiumAccess();
    }, []);

    const handleSaveNotes = async (text: string) => {
        if (drink) {
            setNotes(text);
            await saveNotes(drink.idDrink, text);
        }
    };

    const handleServingsChange = (value: number) => {
        setServings(value);
    };

    const toggleUnit = () => {
        setUnit((prevUnit) => {
            if (prevUnit === 'standard') return 'ml';
            if (prevUnit === 'ml') return 'oz';
            return 'standard';
        });
    };

    const getMeasure = (measure: string | { standard: string; ml: number; oz: number }) => {
        if (typeof measure === 'string') {
            return measure; // Return the measure directly if it's a string
        }
        return measure[unit]; // Return the measure based on the selected unit (standard, ml, or oz)
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
    const canIDisplay = () => {
        if (drink?.isFree) {
            return true;
        } else if (hasPremiumAccess) {
            return true;
        } else {
            return false;
        }
    };
    console.log(idDrink, "isFree", drink?.isFree , " can I display", canIDisplay(), " hasPremiumAccess", hasPremiumAccess);



    const Instructions =
        i18n.language === 'ja' && drink.strInstructionsJA
            ? drink.strInstructionsJA
            : drink.strInstructions;

    const drinkTitle =
        i18n.language === 'ja' && drink.strDrinkJa ? drink.strDrinkJa : drink.strDrink;
    const strIngredient = i18n.language === 'ja' ? drink.ingredientsJA : drink.ingredients;

    const instructions = i18n.language === 'ja'
        ? Instructions.split('。').filter((instruction) => instruction.trim() !== '').map((instruction, index) => `ステップ${index + 1}: ${instruction.trim()}`)
        : Instructions.split('. ').filter((instruction) => instruction.trim() !== '').map((instruction, index) => `Step ${index + 1}: ${instruction.trim()}`);

    const handleAddToFavourite = async () => {
        if (drink) {
            if (isFavorite) {
                await removeFavourite(drink.idDrink);
            } else {
                await addFavourite({
                    idDrink: drink.idDrink,
                    strDrink: drink.strDrink,
                    strDrinkThumb: drink.strDrinkThumb,
                    strDrinkJa: drink.strDrinkJa,
                    strCategory: drink.strCategory,
                    strIngredients: drink.ingredients,
                    strIngredientsJA: drink.ingredientsJA,
                    
                });
            }
            setIsFavorite(!isFavorite);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={[styles.headerContainer, { backgroundColor: boxColor2}]}>
                <Text style={[styles.title,{color:textColor}]}>{drinkTitle}</Text>
            </View>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity>

            <ScrollView style={[styles.container,{backgroundColor}]}>
                {drink.strDrinkThumb && <Image source={getImage(drink.strDrinkThumb)} style={styles.image} />}
                <View style={styles.sliderContainer}>
                    <Text style={[styles.sliderLabel,{color:textColor}]}>{t("particularDrink.serving")} : {servings}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={servings}
                        onValueChange={handleServingsChange}
                    />
                </View>
                <View style={styles.ingredientsHeader}>
                    <Text style={[styles.subtitle,{color:textColor}]}>{t("particularDrink.ingredients")}:</Text>
                    <TouchableOpacity style={styles.toggleButton} onPress={toggleUnit}>
                        <Text style={styles.toggleButtonText}>{unit.toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.ingredientsBox, { backgroundColor: boxColor2, opacity: canIDisplay() ? 0.3 : 1 }]}>
                    {strIngredient.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <Text style={[styles.ingredient, { color: textColor, opacity: canIDisplay() ? 0.3 : 1 }]}>{ingredient}</Text>
                            {drink.measuresJA && drink.measuresJA[index] && (
                                <Text style={[styles.measure, { color: textColor,opacity: canIDisplay() ? 0.3 : 1}]}>
                                    {getMeasure(drink.measuresJA[index])}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
                <Text style={[styles.subtitle,{color:textColor}]}>{t("particularDrink.instructions")}:</Text>
                <View style={[styles.instructionsBox,{backgroundColor:boxColor2}]}>
                    {!canIDisplay() && (
                        <View style={styles.overlay}>
                            <Text style={styles.overlayText}>Premium Drink, Upgrade to See</Text>
                        </View>
                    )}
                    {canIDisplay() ? (
                        instructions.map((instruction, index) => (
                            <Text key={index} style={[styles.instructions,{color:textColor}]}>{instruction}</Text>
                        ))
                    ) : null}
                </View>
                <Text style={[styles.subtitle1,{color:textColor}]}>{t("particularDrink.notes")}:</Text>
                <TextInput
                    style={[styles.notesInput,{color:textColor},{backgroundColor}]}
                    multiline
                    numberOfLines={4}
                    value={notes}
                    onChangeText={handleSaveNotes}
                    placeholder={t("particularDrink.notes_place_holder")}
                />
                <TouchableOpacity style={styles.favouriteButton} onPress={handleAddToFavourite}>
                    <Text style={styles.favorite}>
                        {isFavorite
                            ? t("particularDrink.removeFav")
                            : t("particularDrink.addFav")
                        }
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    backButton: {
        top: 16,
        left: 10,
        zIndex: 10,
        padding: 10,
        marginTop: 30,
        width: 50,
        marginBottom: 20
    
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 120,
        position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 10,
    },
    title: {
        fontSize: 32,
        height: 50,
        fontWeight: 'bold',
        marginTop:100,
        marginBottom: 16,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginTop:50,
        marginBottom: 16,
        resizeMode: 'contain',
    },
    subtitle: {
        
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle1: {
        marginTop: 16,
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ingredientsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    toggleButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
    },
    toggleButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
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
        fontWeight: 'bold',
    },
    measure: {
        fontSize: 16,
        color: '#555',
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
        backgroundColor: 'red',
        padding: 16,
        borderRadius: 8,
        
        alignItems: 'center',
        marginBottom: 100,
    },
    favorite:
    {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
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
    overlay: {

        height:100,

        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    overlayText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
