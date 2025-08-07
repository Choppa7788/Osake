import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';

const INSTAGRAM_URL = 'https://www.instagram.com/your_instagram_username/';

export default function Social() {
    const openInstagram = () => {
        Linking.openURL(INSTAGRAM_URL);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Follow us on Instagram!</Text>
            <TouchableOpacity style={styles.button} onPress={openInstagram}>
                <Text style={styles.buttonText}>Go to Instagram</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#E1306C',
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});