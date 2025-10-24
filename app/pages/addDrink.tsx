import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, Dimensions, useColorScheme, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { saveDrinkToDatabase } from '../services/database'; // Assume this is a function to save the drink to your database
import { LinearGradient } from 'expo-linear-gradient';
import "../../i18n";
import { useTranslation } from 'react-i18next';
const screenWidth = Dimensions.get('window').width;

export default function AddDrink() {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [drinkName, setDrinkName] = useState('');
    const [ingredients, setIngredients] = useState([{ id: 1, name: '', measure: '' }]);
    const [glassName, setGlassName] = useState('');
    const [instructions, setInstructions] = useState([{ id: 1, step: '' }]);
    const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const colorScheme = useColorScheme(); // Get the current color scheme
    const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

    // Set text color: dark in light mode, light in dark mode
    const textColor = isDarkMode ? '#ffffff' : '#222222'; // <-- changed from '#000000'
    const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
    const boxColor = isDarkMode ? '#4d4f4e' : '#deebc7'; // Set box color
    const boxColor1 = isDarkMode ? '#121212' : '#deebc7'; // Set box color
    const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
    const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color
    const headerBackgroundColor = isDarkMode ? '#403b35' : '#42db7a'; // Brown for dark, green for light

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Ionicons  name="arrow-back" size={24} color={isDarkMode ? "white" : "#222222"} onPress={() => navigation.goBack()} />
            ),
            title: t("myBar.drinks"),
        });
    }, [navigation, isDarkMode, t]);

    const addIngredient = () => {
        if (ingredients.length < 15) {
            setIngredients([...ingredients, { id: ingredients.length + 1, name: '', measure: '' }]);
        }
    };

    const addInstruction = () => {
        setInstructions([...instructions, { id: instructions.length + 1, step: '' }]);
    };

    const handleIngredientChange = (id: number, field: string, value: string) => {
        const updatedIngredients = ingredients.map(ingredient => 
            ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
        );
        setIngredients(updatedIngredients);
    };

    const handleInstructionChange = (id: number, value: string) => {
        const updatedInstructions = instructions.map(instruction => 
            instruction.id === id ? { ...instruction, step: value } : instruction
        );
        setInstructions(updatedInstructions);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert(t("myBar.cameraPermission"));
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadImage = () => {
        Alert.alert(
            t("myBar.UploadImage"),
            t("myBar.ChooseOption"),
            [
                { text: t("myBar.takePhoto"), onPress: takePhoto },
                { text: t("myBar.chooseFromGallery"), onPress: pickImage },
                { text: t("myBar.cancel"), style: "cancel" }
            ],
            { cancelable: true }
        );
    };

    const saveDrink = () => {
        if (!drinkName.trim()) {
            alert(t("myBar.alert01"));
            return;
        }

        const newDrink = {
            name: drinkName,
            ingredients,
            glass: glassName,
            instructions,
            category,
            notes,
            image,
        };

        saveDrinkToDatabase(newDrink)
            .then(() => {
                alert(t("myBar.drinkSaved"));
                navigation.goBack();
            })
            .catch((error) => {
                alert(t("myBar.drinkSavedError"));
                console.error(error);
            });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
                    <Text style={[styles.title, { color: textColor }]}>{t("myBar.addNew2")}</Text>

                    {/* Basic Info */}
                    <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
                        <TextInput
                            style={[styles.drinkNameInput, { color: textColor, backgroundColor: boxColor }]}
                            placeholder={t("myBar.DrinkName")}
                            placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
                            value={drinkName}
                            onChangeText={setDrinkName}
                        />
                        <TextInput
                            style={[styles.categoryInput, { color: textColor, backgroundColor: boxColor }]}
                            placeholder={t("myBar.category")}
                            placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
                            value={category}
                            onChangeText={setCategory}
                        />
                    </View>

                    {/* Ingredients */}
                    <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
                        <Text style={[styles.subtitle, { color: textColor }]}>{t("myBar.ingredients")}:</Text>
                        {ingredients.map((ingredient, index) => (
                            <View key={index} style={styles.ingredientRow}>
                                <TextInput
                                    style={[styles.ingredientInput, { color: textColor, backgroundColor: boxColor }]}
                                    placeholder={`${t("myBar.ingredients")} ${index + 1}`}
                                    placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
                                    value={ingredient.name}
                                    onChangeText={(text) => handleIngredientChange(ingredient.id, 'name', text)}
                                />
                                <TextInput
                                    style={[styles.input, { color: textColor, backgroundColor: boxColor }]}
                                    placeholder={t("myBar.measure")}
                                    placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
                                    value={ingredient.measure}
                                    onChangeText={(text) => handleIngredientChange(ingredient.id, 'measure', text)}
                                />
                            </View>
                        ))}
                        <TouchableOpacity style={styles.pillButton} onPress={addIngredient} activeOpacity={0.85}>
                            <Text style={styles.pillButtonText}>{t("myBar.addIngredient")}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Glass */}
                    <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
                        <TextInput
                            style={[styles.input, { color: textColor, backgroundColor: boxColor }]}
                            placeholder={t("myBar.Glassname")}
                            placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
                            value={glassName}
                            onChangeText={setGlassName}
                        />
                    </View>

                    {/* Instructions */}
                    <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
                        <Text style={[styles.subtitle, { color: textColor }]}>{t("myBar.Instructions")}:</Text>
                        {instructions.map((instruction, index) => (
                            <TextInput
                                key={index}
                                style={[styles.input, { color: textColor, backgroundColor: boxColor }]}
                                placeholder={`${t("myBar.Steps")} ${index + 1}`}
                                placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
                                value={instruction.step}
                                onChangeText={(text) => handleInstructionChange(instruction.id, text)}
                            />
                        ))}
                        <TouchableOpacity style={styles.pillButton} onPress={addInstruction} activeOpacity={0.85}>
                            <Text style={styles.pillButtonText}>{t("myBar.addnextStep")}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Image and Notes */}
                    <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
                        <View style={styles.imageContainer}>
                            {image && <Image source={{ uri: image }} style={styles.image} />}
                            <TouchableOpacity style={styles.pillButtonOutline} onPress={uploadImage} activeOpacity={0.85}>
                                <Text style={styles.pillButtonOutlineText}>{t("myBar.UploadImage")}</Text>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={[styles.input, { color: textColor, backgroundColor: boxColor }]}
                            placeholder={t("myBar.Notes")}
                            placeholderTextColor={isDarkMode ? "#ccc" : "#888"}
                            value={notes}
                            onChangeText={setNotes}
                            multiline
                        />
                    </View>

                    {/* Save */}
                    <TouchableOpacity style={styles.saveButton} onPress={saveDrink} activeOpacity={0.9}>
                        <LinearGradient
                            colors={isDarkMode ? ['#1DB954', '#17a64a'] : ['#34e27a', '#20c05f']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.saveGradient}
                        >
                            <Text style={styles.saveButtonText}>{t("myBar.saveDrink")}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        // background moved to prop for theming
        backgroundColor: 'transparent',
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#fff',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 10,
        color: '#fff',
    },
    // Glass cards
    card: {
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
    },
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
    drinkNameInput: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        backgroundColor: '#1c1c1c',
        color: '#fff',
        fontSize: 21, // Increased font size by 5
        height: 50, // Increased height
    },
    categoryInput: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 8,
        marginTop: 8, // Increased margin top
        backgroundColor: '#1c1c1c',
        color: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        backgroundColor: '#1c1c1c',
        color: '#fff',
    },
    ingredientInput: {
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        backgroundColor: '#1c1c1c',
        color: '#fff',
        width: screenWidth / 2 - 24, // Fixed width to half the screen size minus padding
    },
    ingredientRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    // Primary pill action
    pillButton: {
        marginTop: 6,
        alignSelf: 'flex-start',
        backgroundColor: 'rgba(29,185,84,0.12)',
        borderColor: '#1DB954',
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 18,
    },
    pillButtonText: {
        color: '#1DB954',
        fontWeight: '700',
        fontSize: 13,
        letterSpacing: 0.2,
    },
    // Outline pill action
    pillButtonOutline: {
        alignSelf: 'center',
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginBottom: 8,
    },
    pillButtonOutlineText: {
        color: '#fff',
        fontWeight: '700',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
    // Gradient Save
    saveButton: {
        marginTop: 6,
        borderRadius: 28,
        overflow: 'hidden',
    },
    saveGradient: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
});
