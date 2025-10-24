import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Alert,useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/elements';
import { useNavigation } from 'expo-router';
import { t } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const Feedback: React.FC<{ navigation: any }> = ({ }) => {
    const navigation = useNavigation();
    const [hasPremiumAccess, setHasPremiumAccess] = useState(false);

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
    const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
    const boxColor = isDarkMode ? '#121212' : '#deebc7'; // Set box color
    const boxColor1 = isDarkMode ? '#000000' : '#ffffff'; // Set box color
    const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
    const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color
    const headerBackgroundColor = isDarkMode ? '#403b35' : '#42db7a'; // Brown for dark, green for light
  
    const handleEmailPress = () => {
        Linking.openURL('mailto:vivregop@gmail.com?subject=Feedback for the cocktail app');
    };

    const handleLinkedInPress = () => {
        Linking.openURL('https//jp.linkedin.com/in/ashis-kharel-b59611224');
    };

    const handleInstagramPress = () => {
        Linking.openURL('https://www.instagram.com/ace___eel77?igsh=MTBscXRxemdibzN4aQ%3D%3D&utm_source=qr');
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackgroundColor: {backgroundColor},
            headerLeft: () => (
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} onPress={() => navigation.goBack()} />
            ),
            title: t("feedback.feedback"),
        });
    }, [navigation]);

    return (
        <LinearGradient
            colors={isDarkMode ? ['#232526', '#1c1c1c', '#121212'] : ['#e0ffe8', '#baf9c9', '#42db7a']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
        >
            <TouchableOpacity
                style={[styles.backButton, { top: 50 }]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <View style={[styles.backButtonContainer, {
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255, 255, 255, 0.98)',
                    borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : '#C5E89A'
                }]}>
                    <Ionicons name="arrow-back" size={22} color={isDarkMode ? '#fff' : '#1a1a1a'} />
                </View>
            </TouchableOpacity>
            <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                <LinearGradient
                    colors={isDarkMode ? ['#232526', '#1c1c1c'] : ['#fff', '#e0ffe8']}
                    style={styles.card}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                    <Text style={[styles.header, { color: textColor }]}>{t("feedback.feedback")}</Text>
                    <TouchableOpacity onPress={handleEmailPress} style={styles.section}>
                        <View style={styles.sectionContent}>
                            <Ionicons name="mail" size={50} color={isDarkMode ? "#42db7a" : "#42db7a"} />
                            <Text style={[styles.sectionText, { color: textColor }]}>Email</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLinkedInPress} style={styles.section}>
                        <View style={styles.sectionContent}>
                            <Ionicons name="logo-linkedin" size={50} color="#0077b5" />
                            <Text style={[styles.sectionText, { color: textColor }]}>LinkedIn</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleInstagramPress} style={styles.section}>
                        <View style={styles.sectionContent}>
                            <Ionicons name="logo-instagram" size={50} color="#e1306c" />
                            <Text style={[styles.sectionText, { color: textColor }]}>Instagram</Text>
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width: '100%',
        backgroundColor: 'transparent',
    },
    card: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
        letterSpacing: 0.5,
        color: '#fff',
    },
    section: {
        marginBottom: 24,
        width: '100%',
        alignItems: 'center',
    },
    sectionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(66,219,122,0.08)',
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 24,
        width: 260,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    sectionText: {
        marginLeft: 18,
        fontSize: 20,
        fontWeight: '700',
        color: '#222',
    },
    removePremiumButton: {
        marginTop: 20,
        backgroundColor: '#FF0000',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    removePremiumButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    backButton: {
        position: 'absolute',
        left: 16,
        zIndex: 20,
    },
    backButtonContainer: {
        width: 42,
        height: 42,
        borderRadius: 50,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
    },
});

export default Feedback;

