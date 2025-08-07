import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, useColorScheme, Modal, Dimensions, Linking, Alert, Share } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addFavourite, removeFavourite, isFavourite } from '../../assets/database/favouritesStorage';
import { getNotes, saveNotes } from '../../assets/database/notesDatabase';
import { getImage } from './imagepath';
import { useTranslation } from 'react-i18next';
import "../../i18n";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Export, X } from 'phosphor-react-native';
import ViewShot from 'react-native-view-shot';

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
    const [isPremium, setIsPremium] = useState(false);
    const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const viewShotRef = useRef<ViewShot>(null);
    
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
            // Check if measure contains numeric values (oz or ml)
            const ozMatch = measure.match(/(\d+(?:\.\d+)?)\s*oz/i);
            const mlMatch = measure.match(/(\d+(?:\.\d+)?)\s*ml/i);
            
            if (ozMatch) {
                const value = parseFloat(ozMatch[1]);
                const adjustedValue = (value * servings).toFixed(1);
                return measure.replace(ozMatch[0], `${adjustedValue} oz`);
            } else if (mlMatch) {
                const value = parseFloat(mlMatch[1]);
                const adjustedValue = (value * servings).toFixed(1);
                return measure.replace(mlMatch[0], `${adjustedValue} ml`);
            } else {
                // For text-heavy measures, prepend with servings multiplier
                return servings > 1 ? `${servings} x ${measure}` : measure;
            }
        }
        
        // For object measures, multiply by servings
        if (unit === 'ml') {
            return `${(measure.ml * servings).toFixed(1)} ml`;
        } else if (unit === 'oz') {
            return `${(measure.oz * servings).toFixed(1)} oz`;
        } else {
            // For standard unit, check if it contains numeric values
            const ozMatch = measure.standard.match(/(\d+(?:\.\d+)?)\s*oz/i);
            const mlMatch = measure.standard.match(/(\d+(?:\.\d+)?)\s*ml/i);
            
            if (ozMatch) {
                const value = parseFloat(ozMatch[1]);
                const adjustedValue = (value * servings).toFixed(1);
                return measure.standard.replace(ozMatch[0], `${adjustedValue} oz`);
            } else if (mlMatch) {
                const value = parseFloat(mlMatch[1]);
                const adjustedValue = (value * servings).toFixed(1);
                return measure.standard.replace(mlMatch[0], `${adjustedValue} ml`);
            } else {
                // For text-heavy measures, prepend with servings multiplier
                return servings > 1 ? `${servings} x ${measure.standard}` : measure.standard;
            }
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

    const handleShare = () => {
        setShowShareModal(true);
    };

    const handleCloseShareModal = () => {
        setShowShareModal(false);
    };

    const handleSocialShare = async () => {
        try {
            // Capture the share image as base64
            const imageUri = await viewShotRef.current?.capture?.();
            
            if (!imageUri) {
                Alert.alert('Error', 'Failed to generate image');
                return;
            }

            const shareText = `${t("particularDrink.checkThisOut1")} ${drinkTitle} ${t("particularDrink.checkThisOut2")}`;
            const shareUrl = 'Dummy website https://osakeapp.com';

            // Use native share API - this will show all available sharing options
            await Share.share({
                title: shareText,
                message: `${shareText}\n\nGet the full recipe: ${shareUrl}`,
                url: imageUri,
            });
        } catch (error) {
            console.error('Error sharing:', error);
            Alert.alert('Error', 'Unable to share. Please try again.');
        }
        
        setShowShareModal(false);
    };

    const handleIngredientPress = (ingredient: string) => {
        setSelectedIngredient(ingredient);
        setShowIngredientModal(true);
    };

    const handleCloseIngredientModal = () => {
        setShowIngredientModal(false);
        setSelectedIngredient('');
    };

    const handleSearchIngredient = async () => {
        try {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(selectedIngredient + `${t("particularDrink.forcocktail")}`)}`;
            const supported = await Linking.canOpenURL(searchUrl);
            if (supported) {
                await Linking.openURL(searchUrl);
            } else {
                Alert.alert('Error', 'Unable to open browser');
            }
        } catch (error) {
            console.error('Error opening search:', error);
            Alert.alert('Error', 'Unable to search for ingredient');
        }
        setShowIngredientModal(false);
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={[styles.headerContainer, { backgroundColor: boxColor2}]}>
                <Text style={[styles.title,{color:textColor}]}>{drinkTitle}</Text>
                <TouchableOpacity style={styles.headerShareButton} onPress={handleShare}>
                    <Export size={24} color={textColor} weight="bold" />
                </TouchableOpacity>
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
                <View style={[styles.ingredientsBox, { backgroundColor: boxColor2 }]}>
                    {strIngredient.map((ingredient, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.ingredientRow}
                            onPress={() => handleIngredientPress(ingredient)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.ingredient, { color: textColor }]}>{ingredient}</Text>
                            {drink.measuresJA && drink.measuresJA[index] && (
                                <Text style={[styles.measure, { color: textColor }]}>
                                    {getMeasure(drink.measuresJA[index])}
                                </Text>
                            )}
                        </TouchableOpacity>
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

            {/* Ingredient Modal */}
            <Modal
                visible={showIngredientModal}
                transparent
                animationType="fade"
                onRequestClose={handleCloseIngredientModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.ingredientModalContent, { backgroundColor }]}>
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={handleCloseIngredientModal}
                        >
     
                        </TouchableOpacity>
                        
                        <Text style={[styles.ingredientModalTitle, { color: textColor }]}>
                            {t("particularDrink.searchfor")} {selectedIngredient}?
                        </Text>
                        
                        <Text style={[styles.ingredientModalSubtitle, { color: textColor }]}>
                            {t("particularDrink.searchDescription")}
                        </Text>

                        <View style={styles.ingredientModalButtons}>
                            <TouchableOpacity 
                                style={styles.searchButton} 
                                onPress={handleSearchIngredient}
                            >
                                <Text style={styles.searchButtonText}>{t("particularDrink.searchPlaceholder")}</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={handleCloseIngredientModal}
                            >
                                <Text style={styles.cancelButtonText}>{t("particularDrink.cancel")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Share Modal */}
            <Modal
                visible={showShareModal}
                transparent
                animationType="fade"
                onRequestClose={handleCloseShareModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.shareModalContent, { backgroundColor }]}>
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={handleCloseShareModal}
                        >
                            <X size={24} color={textColor} weight="bold" />
                        </TouchableOpacity>
                        
                        <ViewShot 
                            ref={viewShotRef}
                            options={{ 
                                fileName: `${drinkTitle}-cocktail`, 
                                format: "jpg", 
                                quality: 0.9,
                                result: "tmpfile"
                            }}
                        >
                            <View style={styles.shareImageContainer}>
                                {drink.strDrinkThumb && (
                                    <Image 
                                        source={getImage(drink.strDrinkThumb)} 
                                        style={styles.shareImage} 
                                    />
                                )}
                                <View style={styles.osakerBrandOverlay}>
                                    <Text style={styles.osakeBrandText}>OSAKE</Text>
                                </View>
                                <View style={styles.drinkNameOverlay}>
                                    <Text style={styles.shareImageName}>{drinkTitle}</Text>
                                </View>
                                <View style={styles.ingredientsOverlay}>
                                    <Text style={styles.ingredientsOverlayTitle}>Ingredients:</Text>
                                    {strIngredient.slice(0, 4).map((ingredient, index) => (
                                        <Text key={index} style={styles.ingredientsOverlayText}>
                                            • {ingredient}
                                        </Text>
                                    ))}
                                    {strIngredient.length > 4 && (
                                        <Text style={styles.ingredientsOverlayText}>
                                            ...and {strIngredient.length - 4} more
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </ViewShot>

                        <View style={styles.shareButtonContainer}>
                            <TouchableOpacity 
                                style={styles.bigShareButton} 
                                onPress={handleSocialShare}
                            >
                                <Export size={32} color="#fff" weight="bold" />
                                <Text style={styles.bigShareButtonText}>{t("particularDrink.shareImage") ? t("particularDrink.shareImage") : "Share Image"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    backButton: {
        top: 40,
        left: 10,
        zIndex: 10,
        padding: 10,
        marginTop: 30,
        width: 50,
        marginBottom: 20
    
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        height: 120,
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0,
        zIndex: 10,
    },
    title: {
        fontSize: 30,
        height: 50,
        fontWeight: 'bold',
        marginTop: 100,
        marginBottom: 16,
        textAlign: 'center',
        width: '70%',
        overflow: 'hidden',
    },
    headerShareButton: {
        position: 'absolute',
        right: 20,
        top: 75,
        padding: 8,
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
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    shareButton: {
        backgroundColor: '#FF6B35',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    shareModalContent: {
        width: Dimensions.get('window').width * 0.9,
        maxHeight: Dimensions.get('window').height * 0.8,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1000,
        padding: 5,
    },
    shareImageContainer: {
        position: 'relative',
        marginTop: 30,
        marginBottom: 30,
        backgroundColor: '#fff',
    },
    shareImage: {
        width: 300,
        height: 300,
        borderRadius: 15,
        resizeMode: 'cover',
    },
    osakerBrandOverlay: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    osakeBrandText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    drinkNameOverlay: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    shareImageName: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    ingredientsOverlay: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        maxWidth: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    ingredientsOverlayTitle: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    ingredientsOverlayText: {
        color: '#333',
        fontSize: 10,
        lineHeight: 14,
    },
    shareButtonContainer: {
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    bigShareButton: {
        backgroundColor: '#FF7A30',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    bigShareButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
        gap: 10,
    },
    ingredientModalContent: {
        width: Dimensions.get('window').width * 0.85,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        position: 'relative',
    },
    ingredientModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    ingredientModalSubtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: 'center',
        opacity: 0.8,
        lineHeight: 22,
    },
    ingredientModalButtons: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
    },
    searchButton: {
        flex: 1,
        backgroundColor: '#1DB954',
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#666',
        paddingVertical: 15,
        borderRadius: 20,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
