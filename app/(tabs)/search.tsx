import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, FlatList, Image, Dimensions, Keyboard, useColorScheme,TouchableWithoutFeedback  } from 'react-native';
import axios from 'axios';
import { MagnifyingGlass, X } from 'phosphor-react-native';
import { Link } from 'expo-router';
import { getImage } from "../cocktails/imagepath.js"
import localCocktail from '../../assets/database/cocktails.json'; 
import { useTranslation } from "react-i18next";
import "../../i18n";

// Function to get color based on the 3rd letter of the drink's name
const getColorByLetter = (name: string | any[]) => {
    if (name.length < 3) return '#888'; // Default color if name is too short
    const letter: keyof typeof colorMap = name[2].toLowerCase() as keyof typeof colorMap;
    const colorMap: { [key: string]: string } = {
        a: '#FF0800', // Apple Red
        b: '#FFE135', // Banana Yellow
        c: '#32CD32', // Lime Green
        d: '#8B0000', // Dark Red
        e: '#FFD700', // Gold
        f: '#FF69B4', // Hot Pink
        g: '#FF8C00', // Dark Orange
        h: '#4B0082', // Indigo
        i: '#87CEEB', // Sky Blue
        j: '#008000', // Green
        k: '#D2691E', // Chocolate
        l: '#800000', // Maroon
        m: '#DA70D6', // Orchid
        n: '#FF4500', // Orange Red
        o: '#4682B4', // Steel Blue
        p: '#FF1493', // Deep Pink
        q: '#7B68EE', // Medium Slate Blue
        r: '#A52A2A', // Brown
        s: '#FF00FF', // Magenta
        t: '#8A2BE2', // Blue Violet
        u: '#228B22', // Forest Green
        v: '#DC143C', // Crimson
        w: '#4169E1', // Royal Blue
        x: '#9932CC', // Dark Orchid
        y: '#9ACD32', // Yellow Green
        z: '#00FFFF', // Aqua
    };
    return colorMap[letter] || '#333'; // Default to dark gray if letter is not in map
};

export default function SearchScreen() {
    const { t, i18n } = useTranslation();
    const colorScheme = useColorScheme(); // Get the current color scheme
    const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

    const backgroundColor = isDarkMode ? 'black' : 'white'; // Set background color
    const textColor = isDarkMode ? 'white' : 'black'; // Set text color

    const boxColor = isDarkMode ? '#121212' : '#deebc7'; // Set box color
    const boxColor1 = isDarkMode ? '#121212' : '#ffffff'; // Set box color
    const boxColor2 = isDarkMode ? '#28283f' : '#ffffff'; // Set box color popular base background
    const boxColor3 = isDarkMode ? '#403b35' : '#bd8435'; // Set box color
  
    const [searchTerm, setSearchTerm] = useState('');
    const [cocktails, setCocktails] = useState<{idDrink: string, strDrink: string, strDrinkThumb: string, strDrinkJa: string}[]>([]);
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const getRandomDrinks = (numDrinks: number) => {
        const shuffled = localCocktail.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numDrinks);
    };

    const popularDrinks = getRandomDrinks(20).map(drink => ({
        idDrink: drink.idDrink,
        strDrink: drink.strDrink,
        strDrinkThumb: drink.strDrinkThumb || '', // Provide a default value if missing
        strDrinkJa: drink.strDrinkJa || '', // Provide a default value if missing
    }));

    useEffect(() => {
        if (searchTerm.length > 0) {
            const fetchCocktails = () => {
                try {
                    // Ensure localCocktail.drinks exists and is an array
                    const localCocktails = localCocktail || [];
    
                    // Filter drinks by ID or name
                    const filteredDrinks = localCocktails.filter((drink) => 
                        drink.idDrink.includes(searchTerm) || 
                        drink.strDrink.toLowerCase().includes(searchTerm.toLowerCase())
                    );
    
                    setCocktails(filteredDrinks.map(drink => ({
                        idDrink: drink.idDrink,
                        strDrink: drink.strDrink,
                        strDrinkThumb: drink.strDrinkThumb || '', // Provide a default value if missing
                        strDrinkJa: drink.strDrinkJa || '', // Provide a default value if missing
                    })));
                } catch (error) {
                    console.error('Error fetching local cocktails:', error);
                    setCocktails([]);
                }
            };
    
            fetchCocktails();
        } else {
            setCocktails([]);
        }
    }, [searchTerm]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, { backgroundColor:boxColor2 }]}>
                {/* Fixed Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: boxColor3 }]}>
                    <Text style={[styles.titleText, { color: textColor }]}>{t("search.search")}</Text>
                    <View style={styles.inputWrapper}>
                        <MagnifyingGlass size={20}  style={styles.searchIcon} />
                        <TextInput
                            style={[styles.searchInput, { color: textColor, backgroundColor: boxColor1, borderColor: isDarkMode ? '#333' : '#ccc' }]}
                            placeholder={t("search.search_placeholder")}
                            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                            value={searchTerm}
                            onChangeText={setSearchTerm}
                        
                        />
                        {searchTerm.length > 0 && (
                            <TouchableOpacity onPress={() => { setSearchTerm(''); Keyboard.dismiss(); }} style={styles.clearButton}>
                                <X size={20} color={textColor} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Scrollable Content */}
                <FlatList
                    data={searchTerm.length > 0 ? cocktails : popularDrinks}
                    keyExtractor={(item, index) => item.idDrink || index.toString()} // Fix key extractor
                    renderItem={({ item }) => {
                        const drinkTitle = i18n.language === 'ja' && item.strDrinkJa ? item.strDrinkJa : item.strDrink; // Use strDrinkJa if language is Japanese
                        return (
                            <Link href={`/cocktails/particulardrink?idDrink=${item.idDrink}`} asChild>
                                <TouchableOpacity>
                                    <View style={[styles.box, { backgroundColor: getColorByLetter(item.strDrink) }]}>
                                        <View style={styles.boxView}>
                                            <Text style={[styles.boxTitle, { color: textColor }]} numberOfLines={2}>{drinkTitle}</Text>
                                            <View style={styles.imageView}>
                                                <Image source={getImage(item.strDrinkThumb)} style={styles.boxImage} />
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </Link>
                        );
                    }}
                    contentContainerStyle={styles.contentContainer}
                    numColumns={2}
                    keyboardShouldPersistTaps="handled" // Ensure taps are handled even when the keyboard is open
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
    },
    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 10,
    },
    titleText: {
        fontSize: 24,
        
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
    },
    searchIcon: {
        position: 'absolute',
        color: '#888',
        left: 10,
        top: '50%',
        transform: [{ translateY: -10 }],
        zIndex: 1,
    },
    searchInput: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingLeft: 40,
        paddingRight: 40,
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    contentContainer: {
        width: '100%',
        marginTop: 150, // Ensures content starts 50px below search bar
        paddingBottom: 50, // Extra padding to avoid navbar overlap
    alignItems: 'center',
    },
    box: {
     height: 100,
     width: 180,
     borderRadius: 4,
     justifyContent: 'space-between',
     alignItems: 'center',
     margin: 5,
     flexDirection: 'row',
     
     shadowColor: '#000', // Shadow color
     shadowOffset: { width: 2, height: 2 }, // Shadow offset
     shadowOpacity: 3, // Shadow opacity
     shadowRadius: 3.84, // Shadow radius
     elevation: 5, // Elevation for Android shadow
    },
    boxView: {
        height: '100%', // Full height of the box
        width: '100%', // Full width of the box
        borderRadius: 4, // Inherit border radius
       
        justifyContent: 'space-between', // Inherit alignment
        alignItems: 'center', // Inherit alignment
        flexDirection: 'row', // Inherit flex direction
        paddingRight: 10, // Inherit padding
        overflow: 'hidden', // Ensure content is clipped
    },
    boxTitle: {
     top: 10,
     fontSize: 15,
     width: 100,
     fontWeight: 'bold',
     textAlign: 'left',
     flexWrap: 'wrap', // Allow text wrapping
    marginLeft:5,
    maxWidth: 100, // Adjust max width as needed
    marginBottom: 60, // Add margin to the bottom
    },
    imageView: {
        right: 0,

        shadowColor: '#000', // Shadow color
     shadowOffset: { width: -2, height: 2 }, // Shadow offset
     shadowOpacity: 3, // Shadow opacity
     shadowRadius: 3.84, // Shadow radius
     elevation: 5, // Elevation for Android shadow

        width: 80,
        height: 80,
        backgroundColor:"white",
        marginTop: 20,
        marginLeft: 20,
        transform: [{ rotate: '60deg' }], // Tilt the ImageView by 45 degrees
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10, // Inherit border radius
        overflow: 'hidden', // Ensure content is clipped
    },
    boxImage: {
        width: 80,
        height: 80,
        marginTop: 20,
        transform: [{ rotate: '315deg' },{scale:1}], // Keep the image straight
    },
});
