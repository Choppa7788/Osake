import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { HeaderBackButton } from '@react-navigation/elements';
import { useNavigation } from 'expo-router';


const Feedback: React.FC<{ navigation: any }> = ({ }) => {
    const navigation = useNavigation();
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
            headerLeft: () => (
                <HeaderBackButton onPress={() => navigation.goBack()} />
            ),
            title: 'Favourite',
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleEmailPress} style={styles.section}>
                <View style={styles.sectionContent}>
                    <Ionicons name="mail" size={50} color="white" />
                    <Text style={styles.sectionText}>Email: vivregop@gmail.com</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLinkedInPress} style={styles.section}>
                <View style={styles.sectionContent}>
                    <Ionicons name="logo-linkedin" size={50} color="white" />
                    <Text style={styles.sectionText}>LinkedIn</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInstagramPress} style={styles.section}>
                <View style={styles.sectionContent}>
                    <Ionicons name="logo-instagram" size={50} color="white" />
                    <Text style={styles.sectionText}>Instagram</Text>
                </View>
            </TouchableOpacity>
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
});

export default Feedback;

