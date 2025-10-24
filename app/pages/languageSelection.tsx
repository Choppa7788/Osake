import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Dimensions, NativeModules, Platform } from 'react-native';
import * as Localization from 'expo-localization';
import i18n from '../../i18n';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { t } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initializeI18n = async () => {
    if (!i18n.isInitialized) {
        await i18n.init();
    }
};

const LanguageSelection: React.FC = () => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const backgroundColor = isDarkMode ? '#0a0a0a' : '#f8fafb';
    const textColor = isDarkMode ? '#ffffff' : '#1a1a1a';
    const cardColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.95)';
    const cardBorder = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
    const accent = isDarkMode ? '#1DB954' : '#42db7a';
    const subtitleColor = isDarkMode ? '#b3b3b3' : '#666666';

    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
    const [isDeviceLanguage, setIsDeviceLanguage] = useState(false);
    const navigation = useNavigation();
    const window = Dimensions.get('window');

    // Detect device language using expo-localization
    const getDeviceLanguage = () => {
        try {
            // Get device locales using expo-localization
            const deviceLocales = Localization.getLocales(); // Array of preferred locales
            
            console.log('Device locales:', deviceLocales);
            
            // Extract language code from primary locale
            const primaryLanguage = deviceLocales[0]?.languageCode?.toLowerCase();
            
            // Check if Japanese is preferred
            if (primaryLanguage === 'ja') {
                return 'ja';
            }
            
            // Check secondary languages for Japanese
            for (const locale of deviceLocales) {
                if (locale.languageCode === 'ja') {
                    return 'ja';
                }
            }
            
            return 'en'; // Default to English
        } catch (error) {
            console.log('Could not detect device language, defaulting to English:', error);
            return 'en';
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation, isDarkMode]);

    useEffect(() => {
        const initializeLanguage = async () => {
            await initializeI18n();
            
            // Check if user has manually set a language
            const storedLang = await AsyncStorage.getItem('appLanguage');
            const deviceLang = getDeviceLanguage();
            
            if (storedLang) {
                // User has manually set language
                await i18n.changeLanguage(storedLang);
                setSelectedLanguage(storedLang);
                // Check if stored language matches device language
                setIsDeviceLanguage(storedLang === deviceLang);
            } else {
                // Use device language
                await i18n.changeLanguage(deviceLang);
                setSelectedLanguage(deviceLang);
                setIsDeviceLanguage(true);
                await AsyncStorage.setItem('appLanguage', deviceLang);
            }
        };
        initializeLanguage();
    }, []);

    const handleLanguageChange = async (language: string) => {
        const deviceLang = getDeviceLanguage();
        
        await i18n.changeLanguage(language);
        setSelectedLanguage(language);
        setIsDeviceLanguage(language === deviceLang);
        await AsyncStorage.setItem('appLanguage', language);
    };

    return (
        <LinearGradient
            colors={isDarkMode 
                ? ['#0a0a0a', '#1a1a1a', '#0f0f0f'] 
                : ['#f8fafb', '#e8f2f7', '#deeef5']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.root}
        >
            {/* Back Button */}
            <TouchableOpacity 
                style={[styles.backButton, { top: 50 }]} 
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
            >
                <View style={[styles.backButtonContainer, { backgroundColor: cardColor, borderColor: cardBorder }]}>
                    <Ionicons name="arrow-back" size={22} color={textColor} />
                </View>
            </TouchableOpacity>

            {/* Main Content */}
            <View style={styles.contentContainer}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={[styles.mainTitle, { color: textColor }]}>
                        {t("headers.selectLanguage")}
                    </Text>
                    <Text style={[styles.subtitle, { color: subtitleColor }]}>
                        {selectedLanguage === 'ja' 
                            ? '言語設定を変更できます' 
                            : 'Choose your preferred language'
                        }
                    </Text>
                    {isDeviceLanguage && (
                        <View style={[styles.deviceBadge, { backgroundColor: isDarkMode ? 'rgba(29, 185, 84, 0.15)' : 'rgba(66, 219, 122, 0.15)' }]}>
                            <Text style={[styles.deviceBadgeText, { color: accent }]}>
                                {selectedLanguage === 'ja' ? 'デバイス言語' : 'Device Language'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Language Options */}
                <View style={[styles.optionsContainer, { backgroundColor: cardColor, borderColor: cardBorder }]}>
                    <TouchableOpacity
                        style={[
                            styles.languageOption,
                            selectedLanguage === 'en' && styles.selectedOption,
                        ]}
                        onPress={() => handleLanguageChange('en')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.languageContent}>
                            <View style={styles.languageInfo}>
                                <Text style={[styles.languageName, { color: textColor }]}>English</Text>
                                <Text style={[styles.languageNative, { color: subtitleColor }]}>English</Text>
                            </View>
                            <View style={[
                                styles.radioButton,
                                selectedLanguage === 'en' && { backgroundColor: accent, borderColor: accent }
                            ]}>
                                {selectedLanguage === 'en' && (
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: cardBorder }]} />

                    <TouchableOpacity
                        style={[
                            styles.languageOption,
                            selectedLanguage === 'ja' && styles.selectedOption,
                        ]}
                        onPress={() => handleLanguageChange('ja')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.languageContent}>
                            <View style={styles.languageInfo}>
                                <Text style={[styles.languageName, { color: textColor }]}>Japanese</Text>
                                <Text style={[styles.languageNative, { color: subtitleColor }]}>日本語</Text>
                            </View>
                            <View style={[
                                styles.radioButton,
                                selectedLanguage === 'ja' && { backgroundColor: accent, borderColor: accent }
                            ]}>
                                {selectedLanguage === 'ja' && (
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <Text style={[styles.infoText, { color: subtitleColor }]}>
                        {selectedLanguage === 'ja' 
                            ? 'アプリの言語設定は自動的に保存されます'
                            : 'Your language preference will be saved automatically'
                        }
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        zIndex: 10,
    },
    backButtonContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 120,
        alignItems: 'center',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 22,
    },
    deviceBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    deviceBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    optionsContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        borderWidth: 1,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    languageOption: {
        borderRadius: 14,
        padding: 20,
    },
    selectedOption: {
        backgroundColor: 'rgba(29, 185, 84, 0.08)',
    },
    languageContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    languageInfo: {
        flex: 1,
        alignItems: 'flex-start',
    },
    languageName: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2,
    },
    languageNative: {
        fontSize: 14,
        fontWeight: '500',
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#d1d5db',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        marginVertical: 4,
        marginHorizontal: 16,
        backgroundColor: '#d1d5db',
    },
    infoSection: {
        marginTop: 32,
        paddingHorizontal: 20,
    },
    infoText: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 20,
    },
});
export default LanguageSelection;