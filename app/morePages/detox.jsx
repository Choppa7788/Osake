import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const detoxDrinks = [
    "Lemon Ginger Detox Water",
    "Cucumber Mint Detox Juice",
    "Apple Cider Vinegar Drink",
    "Turmeric Detox Tea",
    "Green Tea with Lemon",
    "Beetroot and Carrot Juice",
    "Coconut Water with Lime",
    "Aloe Vera Detox Juice"
];

export default function DetoxDrinksPage() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Alcohol Detox Drinks</Text>
            <FlatList
                data={detoxDrinks}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.item}>{'\u2022'} {item}</Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    item: {
        fontSize: 18,
        marginBottom: 8,
    },
});