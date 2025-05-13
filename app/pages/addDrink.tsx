import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, Dimensions, useColorScheme, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import * as ImagePicker from 'expo-image-picker';
import { saveDrinkToDatabase } from '../services/database'; // Assume this is a function to save the drink to your database
import "../../i18n";
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
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
    
      const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
      const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
      const boxColor = isDarkMode ? '#4d4f4e' : '#deebc7'; // Set box color
      const boxColor1 = isDarkMode ? '#121212' : '#deebc7'; // Set box color
      const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
      const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color
      const headerBackgroundColor = isDarkMode ? '#403b35' : '#42db7a'; // Brown for dark, green for light
    


      
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Ionicons  name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} onPress={() => navigation.goBack()} />
            ),
            title: t("myBar.drinks"),
        });
    }, [navigation]);

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
                    <TextInput
                        style={[styles.drinkNameInput, { color: textColor, backgroundColor: boxColor }]}
                        placeholder={t("myBar.DrinkName")}
                        placeholderTextColor="#ccc"
                        value={drinkName}
                        onChangeText={setDrinkName}
                    />
                    <TextInput
                        style={[styles.categoryInput, { color: textColor, backgroundColor: boxColor }]}
                        placeholder={t("myBar.category")}
                        placeholderTextColor="#ccc"
                        value={category}
                        onChangeText={setCategory}
                    />
                    <Text style={[styles.subtitle, { color: textColor }]}>{t("myBar.ingredients")}:</Text>
                    {ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientRow}>
                            <TextInput
                                style={[styles.ingredientInput, { color: textColor, backgroundColor: boxColor }]}
                                placeholder={`${t("myBar.ingredients")} ${index + 1}`}
                                placeholderTextColor="#ccc"
                                value={ingredient.name}
                                onChangeText={(text) => handleIngredientChange(ingredient.id, 'name', text)}
                            />
                            <TextInput
                                style={[styles.input, { color: textColor, backgroundColor: boxColor }]}
                                placeholder={t("myBar.measure")}
                                placeholderTextColor="#ccc"
                                value={ingredient.measure}
                                onChangeText={(text) => handleIngredientChange(ingredient.id, 'measure', text)}
                            />
                        </View>
                    ))}
                    <Button title={t("myBar.addIngredient")} onPress={addIngredient} />
                    <TextInput
                        style={[styles.input, { color: textColor, backgroundColor: boxColor }]}
                        placeholder={t("myBar.Glassname")}
                        placeholderTextColor="#ccc"
                        value={glassName}
                        onChangeText={setGlassName}
                    />
                    <Text style={[styles.subtitle, { color: textColor }]}>{t("myBar.Instructions")}:</Text>
                    {instructions.map((instruction, index) => (
                        <TextInput
                            key={index}
                            style={[styles.input, { color: textColor, backgroundColor: boxColor }]}
                            placeholder={`${t("myBar.Steps")} ${index + 1}`}
                            placeholderTextColor="#ccc"
                            value={instruction.step}
                            onChangeText={(text) => handleInstructionChange(instruction.id, text)}
                        />
                    ))}
                    <Button title={t("myBar.addnextStep")} onPress={addInstruction} />
                    <View style={styles.imageContainer}>
                        {image && <Image source={{ uri: image }} style={styles.image} />}
                        <Button title={t("myBar.UploadImage")} onPress={uploadImage} />
                    </View>
                    <TextInput
                        style={[styles.input, { color: textColor, backgroundColor: boxColor }]}
                        placeholder={t("myBar.Notes")}
                        placeholderTextColor="#ccc"
                        value={notes}
                        onChangeText={setNotes}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={saveDrink}>
                        <Text style={styles.saveButtonText}>{t("myBar.saveDrink")}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#fff',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
        color: '#fff',
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
    },
    saveButton: {
        marginTop: 16,
        backgroundColor: '#1DB954',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
    },
});
