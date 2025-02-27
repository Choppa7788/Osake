import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, FlatList, Image, Dimensions, Keyboard } from 'react-native';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [cocktails, setCocktails] = useState<{idDrink: string, strDrink: string, strDrinkThumb: string }[]>([]);
    const scrollY = React.useRef(new Animated.Value(0)).current;
    const getRandomDrinks = (numDrinks: number) => {
        const shuffled = localCocktail.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, numDrinks);
    };

    const popularDrinks = getRandomDrinks(20);

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
        
                        setCocktails(filteredDrinks);
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
        <View style={styles.container}>
            {/* Fixed Search Bar */}
            <View style={styles.searchContainer}>
                <Text style={styles.titleText}>{t("search.search")}</Text>
                <View style={styles.inputWrapper}>
                    <MagnifyingGlass size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t("search.search_placeholder")}
                        placeholderTextColor="#888"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                    {searchTerm.length > 0 && (
                        <TouchableOpacity onPress={() => { setSearchTerm(''); Keyboard.dismiss(); }} style={styles.clearButton}>
                            <X size={20} color="#888" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Scrollable Content */}
            <FlatList
                data={searchTerm.length > 0 ? cocktails : popularDrinks}
                keyExtractor={(item, index) => item.idDrink || index.toString()} // Fix key extractor
                renderItem={({ item }) => (
                    <Link href={`/cocktails/particulardrink?idDrink=${item.idDrink}`} asChild>
                        <TouchableOpacity>
                            <View style={[styles.box, { backgroundColor: getColorByLetter(item.strDrink) }]}>
                                <Text style={styles.boxTitle} numberOfLines={2}>{item.strDrink}</Text>
                                <Image source={getImage(item.strDrinkThumb)} style={styles.boxImage} />
                            </View>
                        </TouchableOpacity>
                    </Link>
                )}
                contentContainerStyle={styles.contentContainer}
                numColumns={2}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: 'black',
    },
    searchContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: 'black',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 10,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
    },
    searchIcon: {
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    searchInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        paddingVertical: 10,
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: '#222',
        color: '#fff',
    },
    clearButton: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    contentContainer: {
        width: Dimensions.get('window').width,
        marginTop: 170, // Ensures content starts 50px below search bar
        paddingBottom: 50, // Extra padding to avoid navbar overlap
        paddingHorizontal: 10,
  
    },
    box: {
        height: 70,
        width: 170,
        borderRadius: 4,
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 8,
        flexDirection: 'row',
        paddingRight: 10, // Add padding to the right
    },
    boxTitle: {
        top: 10,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
        flexWrap: 'wrap', // Allow text wrapping
        maxWidth: 90, // Adjust max width as needed
        marginLeft: 10, // Add margin to the left
        marginBottom: 25, // Add margin to the bottom
    },
    
    boxImage: {
        width: 60,
        height: 60,
        borderRadius: 15,
    },
});
