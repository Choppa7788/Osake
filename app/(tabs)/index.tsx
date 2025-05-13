import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, TextInput, FlatList, TouchableOpacity, View, Text, ScrollView, useColorScheme } from 'react-native';
import { Link } from 'expo-router';
import { getFavoriteDrinks } from '../../assets/database/favouritesStorage';
import { useTranslation } from "react-i18next";
import "../../i18n";
import { getImage } from '@/cocktails/imagepath';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import returnMustDrink from '../services/returnMustDrink'; // Import returnMustDrink
import cocktails from '../../assets/database/cocktails.json'; // Import cocktails.json

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [cocktail, setCocktail] = useState<{ idDrink: string; strDrink: string; strDrinkThumb: string }[]>([]);
  const [favouriteDrinks, setFavouriteDrinks] = useState<{
    strDrinkJa: string; idDrink: string; strDrink: string; strDrinkThumb: string 
    }[]>([]);
  const [mustDrinkDrinks, setMustDrinkDrinks] = useState<{ idDrink: string; strDrink: string; strDrinkThumb: string }[]>([]);

  const popularDrinks = [
    { idDrink: '11003',strDrink:"Negroni",strDrinkJa:"ネグロに",  strDrinkThumb: "11003.jpg" },
    { idDrink: '11004',strDrink:"Whiskey Sour",strDrinkJa:"ウイスキサワー",  strDrinkThumb: "11004.jpg" },
    { idDrink: '11005',strDrink:"Dry Martini",strDrinkJa:"ドライマーチニ",   strDrinkThumb: "11005.jpg" },
    { idDrink: '11006',strDrink:"Daiquiri",strDrinkJa:"ダイキリ",  strDrinkThumb: "11006.jpg" },
    { idDrink: '11007',strDrink:"Margarita",strDrinkJa:"マルゲリタ",   strDrinkThumb: "11007.jpg" },
    { idDrink: '11728',strDrink:"Martini",strDrinkJa:"マーチニ",  strDrinkThumb: "11728.jpg" },
    { idDrink: '11000',strDrink:"Mojito",strDrinkJa:"モジト",  strDrinkThumb: "11000.jpg" },
    { idDrink: '11001',strDrink:"Old Fashioned ",strDrinkJa:"オールドファッション",  strDrinkThumb: "11001.jpg" },
    { idDrink: '11002',strDrink:"Long Island Tea",strDrinkJa:"ロングアイランドテイ",  strDrinkThumb: "11002.jpg" },
  ];

  const greet = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return t("greetings.good_morning");
    } else if (currentHour < 18) {
      return t("greetings.good_afternoon");
    } else {
      return t("greetings.good_evening");
    }
  };
  const colorScheme = useColorScheme(); // Get the current color scheme
  const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

  const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
  const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
  const boxColor = isDarkMode ? '#121212' : '#deebc7'; // Set box color
  const boxColor1 = isDarkMode ? '#121212' : '#deebc7'; // Set box color
  const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
  const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color
  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const rumResponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Rum');
        const whiskyResponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Whisky');
        const allResponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail');
        
        const rumData = await rumResponse.json();
        const whiskyData = await whiskyResponse.json();
        const allData = await allResponse.json();
        
        const combinedCocktails = [...rumData.drinks, ...whiskyData.drinks, ...allData.drinks].slice(0, 8);
        setCocktail(combinedCocktails);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFavouriteDrinks = async () => {
      try {
        const favourites = await getFavoriteDrinks();
        setFavouriteDrinks(favourites);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCocktails();
    fetchFavouriteDrinks();
  }, []);

  useEffect(() => {
    const fetchMustDrinkDrinks = async () => {
      try {
        const mustDrinkIds = await returnMustDrink(); // Fetch mustDrink IDs
        const mustDrinkDetails = [];
        console.log("Must Drink IDs:", mustDrinkIds);
        for (const id of mustDrinkIds) {
          const drink = cocktails.find((cocktail) => cocktail.idDrink === id);
          if (drink) {
            mustDrinkDetails.push({
              idDrink: drink.idDrink,
              strDrink: drink.strDrink,
              strDrinkThumb: drink.strDrinkThumb,
            });
          }
        }
        console.log("Must Drink Details:", mustDrinkDetails);
        setMustDrinkDrinks(mustDrinkDetails);
      } catch (error) {
        console.error('Error fetching mustDrink drinks:', error);
      }
    };

    fetchMustDrinkDrinks();
  }, []);

  const displayedDrinks = favouriteDrinks.length >= 6 
    ? favouriteDrinks.slice(0, 6) 
    : [...favouriteDrinks, ...popularDrinks.slice(0, 6 - favouriteDrinks.length)];
  const navigation = useNavigation();

  return (
    <View style={[styles.outerContainer, { backgroundColor }]}>
      {/* Greeting */}
      <View style={[styles.greetingContainer, { backgroundColor: boxColor3 }]}>
        <Text style={[styles.greeting, { color: textColor }]}>{greet()}</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContainer}>
        {/* Cocktails */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>{t("headers.cocktails", "Cocktails")}</Text>
        <View style={[styles.cocktailContainer, { backgroundColor }]}>
          {displayedDrinks.map((drink, index) => {
            const drinkName = i18n.language === 'ja' ? drink.strDrinkJa : drink.strDrink;
            return (
              <Link key={index} href={`/cocktails/particulardrink?idDrink=${drink.idDrink}`} asChild>
                <TouchableOpacity style={styles.box}>
                  <Text style={styles.boxText}>{drinkName}</Text>
                  <Image source={getImage(drink.strDrinkThumb)} style={styles.boxImage} />
                </TouchableOpacity>
              </Link>
            );
          })}
        </View>

        {/* Favourites */}
        <Text style={[styles.sectionTitle, { color: textColor }]}>{t("headers.bases")}</Text>
        <FlatList
          data={[
            { id: '1', linkName: "Rum", name: t("bases.rum"), image: 'https://www.thecocktaildb.com/images/ingredients/rum-Medium.png' },
            { id: '2', linkName: "Gin", name: t("bases.gin"), image: 'https://www.thecocktaildb.com/images/ingredients/gin-Medium.png' },
            { id: '3', linkName: "Whisky", name: t("bases.whisky"), image: 'https://www.thecocktaildb.com/images/ingredients/whisky-Medium.png' },
            { id: '4', linkName: "Vodka", name: t("bases.vodka"), image: 'https://www.thecocktaildb.com/images/ingredients/vodka-Medium.png' },
            { id: '5', linkName: "Tequila", name: t("bases.tequila"), image: 'https://www.thecocktaildb.com/images/ingredients/tequila-Medium.png' },
            { id: '6', linkName: "Brandy", name: t("bases.brandy"), image: 'https://www.thecocktaildb.com/images/ingredients/brandy-Medium.png' },
          ].filter((item) => typeof item.name === 'string')} // Ensure name exists and is a string
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.playlistContainer, { backgroundColor: boxColor2 }]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/cocktails/drinkList?base=${item.linkName}`} asChild>
              <TouchableOpacity style={styles.playlistItem}>
                <View style={styles.playlistImgContainer}>
                  <Image source={{ uri: item.image }} style={styles.playlistImage} />
                </View>
                <Text style={styles.playlistText}>{item.name}</Text>
              </TouchableOpacity>
            </Link>
          )}
        />

        {/* Must Drink at a Bar */}
        <View style={styles.mustDrinkContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>{t("mustDrink.must_drink")}</Text>
          <FlatList
            data={mustDrinkDrinks}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.idDrink}
            renderItem={({ item }) => (
              <Link href={`/cocktails/particulardrink?idDrink=${item.idDrink}`} asChild>
                <TouchableOpacity style={styles.barItem}>
                  <Image source={getImage(item.strDrinkThumb)} style={styles.barImage} />
                  <Text style={[styles.barText, { color: textColor }]}>{item.strDrink}</Text>
                </TouchableOpacity>
              </Link>
            )}
          />
        </View>

        {/* Something Special */}
        <View style={styles.somethingSpecialContainer}>
          <Text style={[styles.sectionTitle, { marginLeft: 10,color: textColor }]}>{t("somethingCasual.Something_special")}</Text>
          <View style={[styles.specialGrid, { backgroundColor }]}>
            {[
              { id: '1', name: t("somethingCasual.hard_drinks"), link: '/cocktails/somethingSpecial?category=hard_drinks', image: "13847.jpg" },
              { id: '2', name: t("somethingCasual.something_casual"), link: '/cocktails/somethingSpecial?category=casual', image: "15427.jpg" },
              { id: '3', name: t("somethingCasual.fruity"), link: '/cocktails/somethingSpecial?category=fruity', image: "178336.jpg" },
              { id: '4', name: t("somethingCasual.creamy_desserts"), link: '/cocktails/somethingSpecial?category=creamy_desserts', image: "11000.jpg" },
              { id: '5', name: t("somethingCasual.unique_taste"), link: '/cocktails/somethingSpecial?category=unique_taste', image: "11003.jpg" },
              { id: '6', name: t("somethingCasual.soft_drinks"), link: '/cocktails/somethingSpecial?category=soft_drinks', image: "12672.jpg" },
            ].map((item, index) => (
              <Link key={index} href={item.link as any} asChild>
                <TouchableOpacity style={styles.specialBox}>
                  <Image source={getImage(item.image)} style={styles.specialIMG}></Image>
                  <Text style={[styles.specialBoxText,{color:textColor}]}>{item.name}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>

        {/* "What Can I Make?" Button */}
        <Link href="../pages/whatCanImake" asChild>
          <TouchableOpacity style={styles.whatCanIMakeButton}>
            <Image source={require("../../assets/icons/cocktailGlass.png")} style={styles.whatCanIMakeImage} />
            <View style={styles.whatCanIMakeTextContainer}>
              <Text style={styles.whatCanIMakeButtonText}>{t("whatCanIMake.whatCanIMake")}</Text>
              <Text style={styles.whatCanIMakeSubtitle}>
                {t("whatCanIMake.subtitle")}
              </Text>
            </View>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  greetingContainer: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: '#121212', // Adjust based on color scheme
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  sectionTitle: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  playlistItem: {
    marginLeft: 5,
    marginRight: 15,
    width: 165,
    height: 165,
    backgroundColor: '#2e2020',
    alignItems: 'center',
    borderRadius: 150,
    overflow: 'hidden',
  },
  playlistImgContainer: {
    width: 140,
    height: 140,
    overflow: 'hidden',
    marginTop: 10,
  },
  playlistImage: {
    width: 140,
    height: 140, // Adjusted to render the whole image
    resizeMode: 'contain', // Ensure the image fits within the container
  },
  playlistText: {
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: '600',
    backgroundColor: '#69615d',
    width: 165,
    height: 35,
    marginTop: -20,
  },
  cocktailContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginLeft: -15,
    marginRight: -15,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
  },
  box: {
    width: '48%',
    height: 70,
    borderRadius: 8,
    flexDirection: 'row',
    backgroundColor: '#595953',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    paddingTop: 15,
    marginBottom: 10,
  },
  boxImage: {
    width: 55,
    height: 55,
    borderRadius: 25,
    marginBottom: 8,
  },
  boxText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'left', // Align text to the left
    
    width: '65%',
    // Remove or adjust the width property if necessary
  },
  mustDrinkContainer: {
    marginTop: 20,
    width: 400,
    height: 300,
  },
  barItem: {
    marginRight: 16,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  barImage: {
    width: 200,
    height: 200, // Adjusted to render the whole image
    resizeMode: 'contain', // Ensure the image fits within the container
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
    },
    barText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    },
    somethingSpecialContainer: {
    marginLeft: -30,
    marginRight: -30,
    borderRadius: 8,
    padding: 16,
  
    },
    specialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    },
    specialBox: {
    width: '48%',
    height: 220,
    backgroundColor: 'transparent',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
    },
    specialBoxText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    marginTop: -10,
    },
    specialIMG: {
    width: '100%', // Adjusted to render the whole image
    height: '100%', // Adjusted to render the whole image
    borderRadius: 8,

    resizeMode: 'contain', // Ensure the image fits within the container
  },
  playlistContainer: {
    marginLeft: -20,
    marginRight: -20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  whatCanIMakeButton: {
    flexDirection: 'row', // Align image and text horizontally
    alignItems: 'center',
    height: 200,
    width: '100%',
    backgroundColor: '#1DB954',
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  whatCanIMakeImage: {
    width: 100,
    height: 150,
    marginRight: 16,
    resizeMode: 'contain', // Ensure the image fits within the container
  },
  whatCanIMakeTextContainer: {
    flex: 1,
  },
  whatCanIMakeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  whatCanIMakeSubtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
});
