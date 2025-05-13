import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import i18n from '../../i18n';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import { useLayoutEffect } from 'react';
import { t } from 'i18next';
const initializeI18n = async () => {
    if (!i18n.isInitialized) {
        await i18n.init();  // Ensure initialization before using `i18n.language`
    }
};
initializeI18n();


const LanguageSelection: React.FC = () => {


    const colorScheme = useColorScheme(); // Get the current color scheme
    const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled
    const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
    const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
    const boxColor = isDarkMode ? '#121212' : '#deebc7'; // Set box color
    const boxColor1 = isDarkMode ? '#000000' : '#ffffff'; // Set box color
    const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
    const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color
    const headerBackgroundColor = isDarkMode ? '#403b35' : '#42db7a'; // Brown for dark, green for light
  
    

    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                 <Ionicons  name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} onPress={() => navigation.goBack()} />
            ),
            title: t("headers.selectLanguage"),
        });
    }, [navigation]);

    useEffect(() => {
        const initializeAndSetOptions = async () => {
            await initializeI18n();

            const changeLanguage = async (language: string) => {
                await i18n.changeLanguage(language);
                setSelectedLanguage(language);
            };
            changeLanguage(i18n.language);
        };
        initializeAndSetOptions();
    }, [navigation]);

    const handleLanguageChange = async (language: string) => {
        await i18n.changeLanguage(language);
        setSelectedLanguage(language);
    };

    return (
      <View style={[styles.container, { backgroundColor:boxColor }]}>
        <Text style={[styles.title,{ color: textColor}]}>
            {selectedLanguage === 'ja' ? '現在の言語は日本語' : 'Current language is English'} 
        </Text>
        <TouchableOpacity
            style={[styles.button, selectedLanguage === 'en' && styles.selectedButton]}
            onPress={() => handleLanguageChange('en')}
        >
            <Text style={styles.buttonText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.button, selectedLanguage === 'ja' && styles.selectedButton]}
            onPress={() => handleLanguageChange('ja')}
        >
            <Text style={styles.buttonText}>日本語</Text>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginVertical: 5,
    },
    selectedButton: {
        backgroundColor: 'green',
    },
    buttonText: {
        color: 'Black',
        fontSize: 18,
        fontWeight: 'bold',
        
    },
});

export default LanguageSelection;