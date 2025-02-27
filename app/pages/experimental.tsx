import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderBackButton, HeaderShownContext } from '@react-navigation/elements';

const MAX_INGREDIENTS = 15;
const INITIAL_VOLUME = 200;

const ExperimentalPage: React.FC = () => {
    const [ingredients, setIngredients] = useState([{ name: '', volume: 0, alcoholPercentage: 0 }]);
    const navigation = useNavigation();

         useLayoutEffect(() => {
               navigation.setOptions({
                   headerShown: false,
               });
           }, [navigation]);
    const addIngredient = () => {
        if (ingredients.length < MAX_INGREDIENTS) {
            setIngredients([...ingredients, { name: '', volume: 0, alcoholPercentage: 0 }]);
        }
    };

    const handleNameChange = (index: number, value: string) => {
        const updatedIngredients = ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, name: value } : ingredient
        );
        setIngredients(updatedIngredients);
    };

    const handleVolumeChange = (index: number, value: number) => {
        const updatedIngredients = ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, volume: value } : ingredient
        );
        setIngredients(updatedIngredients);
    };

    const handleAlcoholPercentageChange = (index: number, value: number) => {
        const updatedIngredients = ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, alcoholPercentage: value } : ingredient
        );
        setIngredients(updatedIngredients);
    };

    const totalVolume = ingredients.reduce((total, ingredient) => total + ingredient.volume, 0);
    const totalAlcoholVolume = ingredients.reduce((total, ingredient) => total + (ingredient.volume * ingredient.alcoholPercentage / 100), 0);
    const totalAlcoholPercentage = totalVolume > 0 ? (totalAlcoholVolume / totalVolume) * 100 : 0;
    const maxVolume = INITIAL_VOLUME + (ingredients.length - 1) * INITIAL_VOLUME;

    const getAlcoholColor = (percentage: number) => {
        const red = Math.min(255, Math.floor(percentage * 2.55));
        const green = Math.min(255, Math.floor((100 - percentage) * 2.55));
        return `rgb(${red}, ${green}, 0)`;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <HeaderBackButton style={styles.backButton} onPress={() => navigation.goBack()} />
                <Text style={styles.header}>Experimental Cocktail</Text>
            <View style={styles.summary}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Alcohol Percentage:</Text>
                    <Text style={styles.summaryValue}>{totalAlcoholPercentage.toFixed(2)}%</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total Volume:</Text>
                    <Text style={styles.summaryValue}>{totalVolume.toFixed(2)} ml</Text>
                </View>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Alcohol Volume Index:</Text>
                    <Text style={styles.summaryValue}>{totalAlcoholVolume.toFixed(2)} ml</Text>
                </View>
            </View>
            <View style={styles.barContainer}>
                <View style={[styles.volumeBar, { width: `${(totalVolume / maxVolume) * 100}%` }]}>
                    <View style={[styles.alcoholBar, { width: `${totalAlcoholPercentage}%`, backgroundColor: getAlcoholColor(totalAlcoholPercentage) }]} />
                </View>
            </View>
            <Text style={styles.subtitle}>Ingredients:</Text>
            {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredient}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ingredient Name"
                        value={ingredient.name}
                        onChangeText={(value) => handleNameChange(index, value)}
                    />
                    <Text style={styles.ingredientLabel}>Volume: {ingredient.volume} ml</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={200}
                        step={1}
                        value={ingredient.volume}
                        onValueChange={(value) => handleVolumeChange(index, value)}
                    />
                    <Text style={styles.ingredientLabel}>Alcohol Percentage: {ingredient.alcoholPercentage}%</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={ingredient.alcoholPercentage}
                        onValueChange={(value) => handleAlcoholPercentageChange(index, value)}
                    />
                </View>
            ))}
            {ingredients.length < MAX_INGREDIENTS && (
                <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
                    <Text style={styles.addButtonText}>+ Add Ingredient</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 50, // Add padding to the top to shift the content down
        backgroundColor: '#121212',
    },
    backButton: {
        marginBottom: 16,
        marginLeft: -8,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#1DB954',
    },
    summary: {
        marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    barContainer: {
        height: 20,
        backgroundColor: '#282828',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 16,
    },
    volumeBar: {
        height: '100%',
        backgroundColor: '#1DB954',
    },
    alcoholBar: {
        height: '100%',
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1DB954',
    },
    ingredient: {
        marginBottom: 16,
        backgroundColor: '#282828',
        padding: 16,
        borderRadius: 8,
    },
    ingredientLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#FFFFFF',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    addButton: {
        marginTop: 16,
        backgroundColor: '#1DB954',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#1DB954',
        borderWidth: 1,
        marginBottom: 8,
        paddingHorizontal: 8,
        color: '#FFFFFF',
    },
});

export default ExperimentalPage;