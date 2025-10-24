import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, useColorScheme, Modal, Dimensions, Linking, Alert, Share, StyleSheet as RNStyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { addFavourite, removeFavourite, isFavourite } from '../../assets/database/favouritesStorage';
import { getNotes, saveNotes } from '../../assets/database/notesDatabase';
import { getRating, saveRating } from '../../assets/database/ratingsStorage';
import { getImage } from './imagepath';
import { useTranslation } from 'react-i18next';
import "../../i18n";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Export, X } from 'phosphor-react-native';
import ViewShot from 'react-native-view-shot';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useUser } from '../_layout';

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
    premium: boolean; 
};

export default function ParticularDrinkScreen() {
    const { idDrink } = useLocalSearchParams();
    const [drink, setDrink] = useState<Drink | null>(null);
    const [loading, setLoading] = useState(true);
    const [servings, setServings] = useState<number>(1);
    const navigation = useNavigation();
    const [isFavorite, setIsFavorite] = useState(false);
    const [notes, setNotes] = useState('');
    const [rating, setRating] = useState(0);
    const { t, i18n } = useTranslation();
    const [unit, setUnit] = useState<'standard' | 'ml' | 'oz'>('standard');
    const [isPremium, setIsPremium] = useState(false);
    const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showIngredientModal, setShowIngredientModal] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const viewShotRef = useRef<ViewShot>(null);

    const {isPro} = useUser();

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
        const fetchRating = async () => {
            if (typeof idDrink === 'string') {
                const savedRating = await getRating(idDrink);
                setRating(savedRating || 0);
            }
        };
        fetchNotes();
        fetchRating();
    }, [idDrink]);
    

    useEffect(() => {
        setHasPremiumAccess(isPro);
        setIsPremium(isPro);
    }, [isPro]);

    const handleSaveNotes = async (text: string) => {
        if (drink) {
            setNotes(text);
            await saveNotes(drink.idDrink, text);
        }
    };

    const handleSaveRating = async (newRating: number) => {
        if (drink) {
            setRating(newRating);
            await saveRating(drink.idDrink, newRating);
        }
    };

    // Helper: category bubble color
    const getCategoryColor = (cat?: string) => {
        if (!cat) return '#888';
        const lower = cat.toLowerCase();
        if (lower.includes('shot')) return '#1976D2'; // blue
        if (lower.includes('cocktail')) return '#FB8C00'; // orange
        const palette = ['#8e44ad', '#16a085', '#e67e22', '#c0392b', '#2980b9', '#27ae60', '#f39c12'];
        const idx = (cat.charCodeAt(0) || 0) % palette.length;
        return palette[idx];
    };

    // Choose the correct measures array by language (VERY IMPORTANT)
    const measuresArray: Array<any> | undefined = (() => {
        if (!drink) return undefined;
        if (i18n.language === 'ja') return (drink as any).measuresJA ?? (drink as any).measures;
        return (drink as any).measuresEN ?? (drink as any).measures;
    })();

    // Updated servings change logic: when slider != 1 default to ML and hide STD
    const handleServingsChange = (value: number) => {
        setServings(value);
        if (value === 1) {
            // when slider set to 1 allow standard
            setUnit('standard');
        } else {
            // when slider used (not 1), default to ml and make STD unavailable
            if (unit === 'standard') setUnit('ml');
        }
    };

    // Robust measure renderer handling strings and structured measures, converts ml<->oz where possible
    const getMeasure = (measure: any) => {
        if (measure == null || measure === '') return '';
        // If measure is an object with standard/ml/oz fields
        if (typeof measure === 'object') {
            const std = measure.standard ?? '' ;
            const mlVal = typeof measure.ml === 'number' ? measure.ml : parseFloat(measure.ml as any) || null;
            const ozVal = typeof measure.oz === 'number' ? measure.oz : parseFloat(measure.oz as any) || null;

            if (unit === 'standard') {
                if (std) return servings > 1 ? `${servings} x ${std}` : std;
                if (ozVal != null) return `${(ozVal * servings).toFixed(2)} oz`;
                if (mlVal != null) return `${(mlVal * servings).toFixed(1)} ml`;
            }

            if (unit === 'ml') {
                if (mlVal != null) return `${(mlVal * servings).toFixed(1)} ml`;
                if (ozVal != null) return `${(ozVal * servings * 29.5735).toFixed(1)} ml`; // convert oz -> ml
                return std || '';
            }

            if (unit === 'oz') {
                if (ozVal != null) return `${(ozVal * servings).toFixed(2)} oz`;
                if (mlVal != null) return `${(mlVal * servings / 29.5735).toFixed(2)} oz`; // convert ml -> oz
                return std || '';
            }
        }

        // If measure is a string like "30 ml" or "1 oz" or textual "dash"
        if (typeof measure === 'string') {
            const s = measure.trim();
            // detect numeric ml
            const mlMatch = s.match(/(\d+(?:\.\d+)?)\s*ml/i);
            const ozMatch = s.match(/(\d+(?:\.\d+)?)\s*oz/i);

            if (unit === 'standard') {
                return servings > 1 ? `${servings} x ${s}` : s;
            }

            if (unit === 'ml') {
                if (mlMatch) {
                    const v = parseFloat(mlMatch[1]) * servings;
                    return `${v.toFixed(1)} ml`;
                }
                if (ozMatch) {
                    const vOz = parseFloat(ozMatch[1]) * servings;
                    const vMl = vOz * 29.5735;
                    return `${vMl.toFixed(1)} ml`;
                }
                // no numeric unit: keep text, with multiplier if >1
                return servings > 1 ? `${servings} x ${s}` : s;
            }

            if (unit === 'oz') {
                if (ozMatch) {
                    const v = parseFloat(ozMatch[1]) * servings;
                    return `${v.toFixed(2)} oz`;
                }
                if (mlMatch) {
                    const vMl = parseFloat(mlMatch[1]) * servings;
                    const vOz = vMl / 29.5735;
                    return `${vOz.toFixed(2)} oz`;
                }
                return servings > 1 ? `${servings} x ${s}` : s;
            }
        }

        return String(measure);
    };

    const renderStars = () => {
        return (
            <View style={styles.ratingContainer}>
                <Text style={[styles.ratingLabel, { color: textColor }]}>{t("particularDrink.rateThisDrink")}:</Text>
                <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                            key={star}
                            onPress={() => handleSaveRating(star)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={star <= rating ? "star" : "star-outline"}
                                size={30}
                                color={star <= rating ? "#FFD700" : "#666"}
                                style={styles.star}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
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
    // REPLACE gating logic
    const premiumActive = hasPremiumAccess || isPremium;
    const isDrinkFree = !drink?.premium; // free when premium flag is false or undefined
    const canDisplay = isDrinkFree || premiumActive;
    const isLocked = !canDisplay;



    const Instructions =
        i18n.language === 'ja' && drink.strInstructionsJA
            ? drink.strInstructionsJA
            : drink.strInstructions;

    const drinkTitle =
        i18n.language === 'ja' && drink.strDrinkJa ? drink.strDrinkJa : drink.strDrink;
    const strIngredient = i18n.language === 'ja' ? drink.ingredientsJA : drink.ingredients;

    // Enable vertical scroll for long titles
    const isLongTitle = (drinkTitle?.length || 0) > 19;

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

    const formatDrinkNameForShare = (title: string) => {
        if (!title || title.length <= 16) {
            return { firstLine: title, secondLine: '' };
        }

        const words = title.split(' ');
        let firstLine = '';
        let secondLine = '';
        
        for (const word of words) {
            if (firstLine.length === 0) {
                firstLine = word;
            } else if ((firstLine + ' ' + word).length <= 16) {
                firstLine += ' ' + word;
            } else {
                secondLine = words.slice(words.indexOf(word)).join(' ');
                break;
            }
        }
        
        return { firstLine, secondLine };
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Premium Gradient Header */}
            <LinearGradient
                colors={isDarkMode ? ['#272822','#1b1c19','#121212'] : ['#baf9c9','#8ceea7','#42db7a']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={[styles.headerContainer]}
            >
                {/* Title wrapped in a vertical ScrollView */}
                <View style={styles.titleWrapper}>
                    <ScrollView
                        style={styles.titleScroll}
                        contentContainerStyle={styles.titleScrollContent}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={isLongTitle}
                    >
                        <Text
                            style={[styles.title, { color: textColor }]}
                            numberOfLines={isLongTitle ? undefined : 1}
                        >
                            {drinkTitle}
                        </Text>
                    </ScrollView>
                </View>

                <TouchableOpacity style={styles.headerShareButton} onPress={handleShare} activeOpacity={0.85}>
                    <Export size={30} color="#fff" weight="bold" />
                </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
            </TouchableOpacity>

            <ScrollView style={[styles.container, { backgroundColor }]}>
                {/* Image with premium shadow - Full width */}
                {drink?.strDrinkThumb && (
                    <View style={styles.fullWidthImageContainer}>
                        <Image source={getImage(drink.strDrinkThumb)} style={styles.fullWidthImage} />
                    </View>
                )}

                {/* Category bubble below image */}
                <View style={styles.bubbleRow}>
                    <View style={[styles.categoryBubble, { backgroundColor: getCategoryColor(drink?.strCategory) }]}>
                        <Text style={styles.bubbleText}>{drink?.strCategory}</Text>
                    </View>
                </View>

                {/* Slider */}
                <View style={styles.sliderContainer}>
                    <Text style={[styles.sliderLabel, { color: textColor }]}>{t("particularDrink.serving")} : {servings}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={servings}
                        onValueChange={handleServingsChange}
                        minimumTrackTintColor={isDarkMode ? "#1DB954" : "#42db7a"}
                        thumbTintColor={isDarkMode ? "#1DB954" : "#42db7a"}
                    />
                </View>

                {/* Ingredients header + unit selector */}
                <View style={styles.ingredientsHeader}>
                    <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.ingredients")}:</Text>
                    {!isLocked && (
                        <View style={styles.unitSelector}>
                            {servings === 1 ? (
                                ['standard', 'ml', 'oz'].map(opt => (
                                    <TouchableOpacity
                                        key={opt}
                                        onPress={() => setUnit(opt as 'standard' | 'ml' | 'oz')}
                                        style={[styles.unitOption, unit === opt && styles.unitOptionActive]}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.unitOptionText, unit === opt && styles.unitOptionTextActive]}>
                                            {opt === 'standard' ? 'STD' : opt.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                ['ml', 'oz'].map(opt => (
                                    <TouchableOpacity
                                        key={opt}
                                        onPress={() => setUnit(opt as 'ml' | 'oz')}
                                        style={[styles.unitOption, unit === opt && styles.unitOptionActive]}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.unitOptionText, unit === opt && styles.unitOptionTextActive]}>
                                            {opt.toUpperCase()}
                                        </Text>
                                    </TouchableOpacity>
                                ))
                            )}
                        </View>
                    )}
                </View>

                {/* Ingredients list */}
                <View style={[
                    styles.ingredientsBox, 
                    isDarkMode ? styles.glassDark : styles.glassLight,
                    isLocked && styles.lockedSection
                ]}>
                    {isLocked ? (
                        <View style={styles.lockedContent}>
                            <TouchableOpacity
                                style={styles.upgradeButton}
                                onPress={() => navigation.navigate('pages/upgrade' as never)}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.upgradeButtonText}>{t("particularDrink.upgrade")}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        strIngredient.map((ingredient, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.ingredientRow}
                                onPress={() => handleIngredientPress(ingredient)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.ingredient, { color: textColor }]}>{ingredient}</Text>
                                {measuresArray && measuresArray[index] && (
                                    <Text style={[styles.measure, { color: textColor }]}>
                                        {getMeasure(measuresArray[index])}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                {/* Glass section below ingredients */}
                <View style={[styles.glassSection, isDarkMode ? styles.glassDark : styles.glassLight]}>
                    <Text style={[styles.glassLabel, { color: textColor }]}>{t("particularDrink.glass")}</Text>
                    <Text style={[styles.glassValue, { color: textColor }]}>{drink.strGlass}</Text>
                </View>

                <Text style={[styles.subtitle, { color: textColor }]}>{t("particularDrink.instructions")}:</Text>
                <View style={[
                    styles.instructionsBox,
                    isDarkMode ? styles.glassDark : styles.glassLight,
                    isLocked && styles.lockedInstructionsSection
                ]}>
                    {isLocked ? (
                        <View style={styles.lockedContent}>
                            <TouchableOpacity
                                style={styles.upgradeButton}
                                onPress={() => navigation.navigate('pages/upgrade' as never)}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        instructions.map((instruction, index) => (
                            <Text key={index} style={[styles.instructions, { color: textColor }]}>{instruction}</Text>
                        ))
                    )}
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

                {/* Rating Section */}
                {renderStars()}

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
                                <View style={styles.drinkNameOverlay}>
                                    {(() => {
                                        const { firstLine, secondLine } = formatDrinkNameForShare(drinkTitle || '');
                                        return secondLine ? (
                                            <>
                                                <Text style={styles.shareImageName}>{firstLine}</Text>
                                                <Text style={styles.shareImageName}>{secondLine}</Text>
                                            </>
                                        ) : (
                                            <Text style={styles.shareImageName}>{firstLine}</Text>
                                        );
                                    })()}
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
    bubbleRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    backButton: {
        position: 'absolute',
        top: 56,
        left: 16,
        zIndex: 20,
        padding: 10,
        width: 50,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 12,
        height: 120,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      
        overflow: 'hidden',
    },
    // Title wrapper and scroll styles for long titles
    titleWrapper: {
        width: '70%',
        height: 90,
        marginTop: 80,
        marginBottom: 16,
        overflow: 'hidden',
    },
    titleScroll: {
        flex: 1,
    },
    titleScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    // Simplified title text style (layout handled by wrapper)
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    headerShareButton: {
        position: 'absolute',
        right: 18,
        bottom: 18,
        padding: 12,
        borderRadius: 32,
        backgroundColor: '#1DB954',
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
    fullWidthImageContainer: {
        width: '100%',
        marginTop: 120,
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    fullWidthImage: {
        width: '100%',
        height: 400,
        resizeMode: 'cover',
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
    unitSelector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        padding: 4,
        borderRadius: 28,
        gap: 6,
    },
 unitOption: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        backgroundColor: 'transparent',
    },
    unitOptionActive: {
        backgroundColor: '#1DB954',
        borderColor: '#1DB954',
    },
    unitOptionText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#cfcfcf',
        letterSpacing: 0.5,
    },
    unitOptionTextActive: {
        color: '#fff',
    },
    ingredientsBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        position: 'relative', // allow absolute blur overlay
    },
    glassDark: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        borderRadius: 18,
        padding: 16,
        marginBottom: 18,
    },
    glassLight: {
        backgroundColor: 'rgba(0,0,0,0.04)',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
        borderRadius: 18,
        padding: 16,
        marginBottom: 18,
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
        position: 'relative', // allow absolute blur overlay
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
    tailTenderBrandOverlay: {
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
    BrandText: {
        color: '#000',
        fontSize: 16,
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
        maxWidth: 180,
        alignItems: 'flex-end',
    },
    shareImageName: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'right',
        lineHeight: 16,
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
    overlayCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        zIndex: 5,
    },
    overlayShade: {
        zIndex: 4,
    },
    // CTA styles for upgrade
    upgradeCta: {
        backgroundColor: '#1DB954',
        paddingVertical: 12,
        paddingHorizontal: 22,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 6,
    },
    upgradeCtaText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    imageShadowWrap: {
        alignSelf: 'center',
        borderRadius: 16,
        marginBottom: 10,
        marginTop: 18,
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
        backgroundColor: 'transparent',
        width: '98%',
    },
    categoryBubble: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    bubbleText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 0.2,
        textAlign: 'center',
    },
    glassSection: {
        borderWidth: 0,
        borderRadius: 16,
        padding: 14,
        marginBottom: 18,
        marginHorizontal: 8,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    glassLabel: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
    glassValue: { fontSize: 15, opacity: 0.95 },
    lockedSection: {
        minHeight: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedInstructionsSection: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedContent: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    upgradeButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 6,
    },
    upgradeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    ratingContainer: {
        marginTop: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    ratingLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    star: {
        marginHorizontal: 2,
    },
});
