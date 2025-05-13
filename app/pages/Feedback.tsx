import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Alert,useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/elements';
import { useNavigation } from 'expo-router';
import { t } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  
    

    useEffect(() => {
        const fetchPremiumAccess = async () => {
            try {
                const premiumAccess = await AsyncStorage.getItem('hasPremiumAccess');
                setHasPremiumAccess(premiumAccess === 'true');
            } catch (error) {
                console.error('Error fetching premium access:', error);
            }
        };

        fetchPremiumAccess();
    }, []);

    const handleRemovePremiumAccess = async () => {
        try {
            await AsyncStorage.setItem('hasPremiumAccess', 'false');
            setHasPremiumAccess(false);
            Alert.alert('Premium Access Removed', 'You no longer have premium access.');
        } catch (error) {
            console.error('Error removing premium access:', error);
        }
    };

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
        <View style={[styles.container, { backgroundColor:boxColor }]}>
            <TouchableOpacity onPress={handleEmailPress} style={styles.section}>
                <View style={styles.sectionContent}>
                    <Ionicons name="mail" size={50} color={isDarkMode ? "white" : "black"} />
                    <Text style={[styles.sectionText,{color:textColor}]}>Email</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLinkedInPress} style={styles.section}>
                <View style={styles.sectionContent}>
                    <Ionicons name="logo-linkedin" size={50} color={isDarkMode ? "white" : "black"} />
                    <Text style={[styles.sectionText,{color:textColor}]}>LinkedIn</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInstagramPress} style={styles.section}>
                <View style={styles.sectionContent}>
                    <Ionicons name="logo-instagram" size={50} color={isDarkMode ? "white" : "black"} />
                    <Text style={[styles.sectionText,{color:textColor}]}>Instagram</Text>
                </View>
            </TouchableOpacity>
            {hasPremiumAccess && (
                <TouchableOpacity onPress={handleRemovePremiumAccess} style={styles.removePremiumButton}>
                    <Text style={styles.removePremiumButtonText}>Remove Premium Access</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#000',
    },
    backButton: {
        marginBottom: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#fff',
    },
    section: {
        marginBottom: 16,
    },
    sectionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionText: {
        marginLeft: 8,
        fontSize: 18,
        color: '#fff',
    },
    removePremiumButton: {
        marginTop: 20,
        backgroundColor: '#FF0000',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
        alignItems: 'center',
    },
    removePremiumButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Feedback;

