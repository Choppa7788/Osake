import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const truths = [
    "What's your biggest fear?",
    "Have you ever lied to your best friend?",
    "What's a secret you've never told anyone?",
    "Who was your first crush?",
    "What's the most embarrassing thing you've done?"
];

const dares = [
    "Do 10 jumping jacks.",
    "Sing a song loudly.",
    "Do your best animal impression.",
    "Speak in a silly accent for the next round.",
    "Dance for 30 seconds without music."
];

// Mode can be 'truth', 'dare', or null

export default function TruthDare() {
    const [mode, setMode] = useState(null);
    const [prompt, setPrompt] = useState('');

    const handleChoice = (choice) => {
        setMode(choice);
        if (choice === 'truth') {
            setPrompt(truths[Math.floor(Math.random() * truths.length)]);
        } else if (choice === 'dare') {
            setPrompt(dares[Math.floor(Math.random() * dares.length)]);
        }
    };

    const handleReset = () => {
        setMode(null);
        setPrompt('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Truth or Dare</Text>
            {!mode ? (
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={() => handleChoice('truth')}>
                        <Text style={styles.buttonText}>Truth</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleChoice('dare')}>
                        <Text style={styles.buttonText}>Dare</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.promptContainer}>
                    <Text style={styles.subtitle}>{mode === 'truth' ? 'Truth' : 'Dare'}:</Text>
                    <Text style={styles.prompt}>{prompt}</Text>
                    <TouchableOpacity style={styles.playAgainButton} onPress={handleReset}>
                        <Text style={styles.playAgainText}>Play Again</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maxWidth: 400,
        alignSelf: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 32,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
    },
    promptContainer: {
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 16,
    },
    prompt: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 32,
    },
    playAgainButton: {
        backgroundColor: '#34C759',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    playAgainText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
});