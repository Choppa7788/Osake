import React, { useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Alert, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { t } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const UpgradePage = () => {

          const colorScheme = useColorScheme(); // Get the current color scheme
          const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled
        
          const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
          const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
          const boxColor = isDarkMode ? '#4d4f4e' : '#deebc7'; // Set box color
          const boxColor1 = isDarkMode ? '#121212' : '#deebc7'; // Set box color
          const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
          const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color
          const headerBackgroundColor = isDarkMode ? '#403b35' : '#42db7a'; // Brown for dark, green for light
        
    


    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                 <Ionicons  name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} onPress={() => navigation.goBack()} />
            ),
            title: t("upgrade.upgradeTitle"),
        });
    }, [navigation]);

    const handlePayment = async () => {
        try {
            await AsyncStorage.setItem('hasPremiumAccess', 'true'); // Store the premium access flag
            Alert.alert(t("upgrade.upgrade_successful"), 'You have successfully purchased the Remove Ads feature!');
        } catch (error) {
            console.error('Error during payment:', error);
            Alert.alert(t("upgrade.upgrade_failed"), 'An error occurred during the payment process.');
        }
    };

    return (
        <View style={[styles.container,{ backgroundColor:boxColor1 }]}>
            <Text style={[styles.title,{color:textColor}]}>{t("upgrade.upgrade")}</Text>
            <Text style={[styles.description,{color:textColor}]}>
                {t("upgrade.upgrade_text")}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handlePayment}>
                <Text style={styles.buttonText}>{t("upgrade.upgrade_button")}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#555',
    },
    button: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UpgradePage;