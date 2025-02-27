import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import * as ImagePicker from 'expo-image-picker';
import { saveDrinkToDatabase } from '../services/database'; // Assume this is a function to save the drink to your database

const screenWidth = Dimensions.get('window').width;

export default function AddDrink() {
    const navigation = useNavigation();
    const [drinkName, setDrinkName] = useState('');
    const [ingredients, setIngredients] = useState([{ id: 1, name: '', measure: '' }]);
    const [glassName, setGlassName] = useState('');
    const [instructions, setInstructions] = useState([{ id: 1, step: '' }]);
    const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [image, setImage] = useState<string | null>(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderBackButton onPress={() => navigation.goBack()} />
            ),
            title: 'Drink',
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
            alert('Sorry, we need camera permissions to make this work!');
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
            "Upload a Picture",
            "Choose an option",
            [
                { text: "Take a Picture", onPress: takePhoto },
                { text: "Choose from Library", onPress: pickImage },
                { text: "Cancel", style: "cancel" }
            ],
            { cancelable: true }
        );
    };

    const saveDrink = () => {
        if (!drinkName.trim()) {
            alert('Please enter a drink name.');
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
                alert('Drink saved successfully!');
                navigation.goBack();
            })
            .catch((error) => {
                alert('Failed to save drink. Please try again.');
                console.error(error);
            });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Add a New Drink</Text>
            <TextInput
                style={styles.drinkNameInput}
                placeholder="Drink Name"
                placeholderTextColor="#ccc"
                value={drinkName}
                onChangeText={setDrinkName}
            />
            <TextInput
                style={styles.categoryInput}
                placeholder="Category"
                placeholderTextColor="#ccc"
                value={category}
                onChangeText={setCategory}
            />
            <Text style={styles.subtitle}>Ingredients:</Text>
            {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientRow}>
                    <TextInput
                        style={styles.ingredientInput}
                        placeholder="Ingredient Name"
                        placeholderTextColor="#ccc"
                        value={ingredient.name}
                        onChangeText={(text) => handleIngredientChange(ingredient.id, 'name', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Measure"
                        placeholderTextColor="#ccc"
                        value={ingredient.measure}
                        onChangeText={(text) => handleIngredientChange(ingredient.id, 'measure', text)}
                    />
                </View>
            ))}
            <Button title="Add Ingredient" onPress={addIngredient} />
            <TextInput
                style={styles.input}
                placeholder="Glass Name"
                placeholderTextColor="#ccc"
                value={glassName}
                onChangeText={setGlassName}
            />
            <Text style={styles.subtitle}>Instructions:</Text>
            {instructions.map((instruction, index) => (
                <TextInput
                    key={index}
                    style={styles.input}
                    placeholder={`Step ${index + 1}`}
                    placeholderTextColor="#ccc"
                    value={instruction.step}
                    onChangeText={(text) => handleInstructionChange(instruction.id, text)}
                />
            ))}
            <Button title="Add Next Step" onPress={addInstruction} />
            <View style={styles.imageContainer}>
                {image && <Image source={{ uri: image }} style={styles.image} />}
                <Button title="Upload a Picture" onPress={uploadImage} />
            </View>
            <TextInput
                style={styles.input}
                placeholder="Notes"
                placeholderTextColor="#ccc"
                value={notes}
                onChangeText={setNotes}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveDrink}>
                <Text style={styles.saveButtonText}>Save Drink</Text>
            </TouchableOpacity>
        </ScrollView>
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
