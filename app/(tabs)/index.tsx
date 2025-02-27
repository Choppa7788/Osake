import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, TextInput, FlatList, TouchableOpacity, View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { getFavoriteDrinks } from '../../assets/database/favouritesStorage';
import { useTranslation } from "react-i18next";
import "../../i18n";
import { getImage } from '@/cocktails/imagepath';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [cocktails, setCocktails] = useState<{ idDrink: string; strDrink: string; strDrinkThumb: string }[]>([]);
  const [favouriteDrinks, setFavouriteDrinks] = useState<{ idDrink: string; strDrink: string; strDrinkThumb: string }[]>([]);
  const mustDrink = [
    { idDrink: '11007', strDrink: 'Margarita', strDrinkThumb:"11007.jpg" },
    { idDrink: '11728', strDrink: 'Martini', strDrinkThumb: "11728.jpg" },
    { idDrink: '11000', strDrink: 'Mojito', strDrinkThumb: "11000.jpg" },
    { idDrink: '11002', strDrink: 'Whiskey Sour', strDrinkThumb: "11002.jpg" },
  ];
  const popularDrinks = [
    { idDrink: '11003', strDrink: 'Negroni', strDrinkThumb: "11003.jpg" },
    { idDrink: '11004', strDrink: 'Moscow Mule', strDrinkThumb: "11004.jpg" },
    { idDrink: '11005', strDrink: 'Daiquiri', strDrinkThumb: "11005.jpg" },
    { idDrink: '11006', strDrink: 'Manhattan', strDrinkThumb: "11006.jpg" },
    { idDrink: '11007', strDrink: 'Margarita', strDrinkThumb: "11007.jpg" },
    { idDrink: '11728', strDrink: 'Martini', strDrinkThumb: "11728.jpg" },
    { idDrink: '11000', strDrink: 'Mojito', strDrinkThumb: "11000.jpg" },
    { idDrink: '11001', strDrink: 'Old Fashioned', strDrinkThumb: "11001.jpg" },
    { idDrink: '11002', strDrink: 'Whiskey Sour', strDrinkThumb: "11002.jpg" },
    { idDrink: '11003', strDrink: 'Negroni', strDrinkThumb: "11003.jpg" },
    { idDrink: '11004', strDrink: 'Moscow Mule', strDrinkThumb: "11004.jpg" },
    { idDrink: '11005', strDrink: 'Daiquiri', strDrinkThumb: "11005.jpg" },
    { idDrink: '11006', strDrink: 'Manhattan', strDrinkThumb: "11006.jpg" },
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
        setCocktails(combinedCocktails);
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

  const displayedDrinks = favouriteDrinks.length >= 6 
    ? favouriteDrinks.slice(0, 6) 
    : [...favouriteDrinks, ...popularDrinks.slice(0, 6 - favouriteDrinks.length)];

  return (
    <ScrollView style={styles.container}>
      {/* Greeting */}
      <Text style={styles.greeting}>{greet()}</Text>{/* Make it so that it changes with time */}
      
       {/* Cocktails */}
       <Text style={styles.sectionTitle}>{t("headers.cocktails", "Cocktails")}</Text>
      <View style={styles.cocktailContainer}>
      {displayedDrinks.map((drink, index) => (
        <Link key={index} href={`/cocktails/particulardrink?idDrink=${drink.idDrink}`} asChild>
      <TouchableOpacity style={styles.box}>
        <Text style={styles.boxText}>{drink.strDrink}</Text>
        <Image source= {getImage(drink.strDrinkThumb) } style={styles.boxImage} />
      </TouchableOpacity>
        </Link>
      ))}
      </View>

      {/* Favourites */}
      <Text style={styles.sectionTitle}>{t("headers.bases")}</Text>
      <FlatList
      data={[
      { id: '1',linkName:"Rum", name: t("bases.rum"), image: 'https://www.thecocktaildb.com/images/ingredients/rum-Medium.png' },
      { id: '2',linkName:"Gin" , name: t("bases.gin"), image: 'https://www.thecocktaildb.com/images/ingredients/gin-Medium.png' },
      { id: '3',linkName:"Whisky", name: t("bases.whisky"), image: 'https://www.thecocktaildb.com/images/ingredients/whisky-Medium.png' },
      { id: '4',linkName:"Wodka", name: t("bases.vodka"), image: 'https://www.thecocktaildb.com/images/ingredients/vodka-Medium.png' },
      { id: '5',linkName:"Tequila", name: t("bases.tequila"), image: 'https://www.thecocktaildb.com/images/ingredients/tequila-Medium.png' },
      { id: '6',linkName:"Brandy", name: t("bases.brandy"), image: 'https://www.thecocktaildb.com/images/ingredients/brandy-Medium.png' },
      ]}
      horizontal
      showsHorizontalScrollIndicator={false}
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
      <Text style={styles.sectionTitle}>{t("mustDrink.must_drink")}</Text>
      <FlatList
        data={[
        { idDrink: '11007', strDrink: t("mustDrink.must_drink1"), strDrinkThumb:"11007.jpg" },
        { idDrink: '11728', strDrink: t("mustDrink.must_drink2"), strDrinkThumb: "11728.jpg" },
        { idDrink: '11000', strDrink: t("mustDrink.must_drink3"), strDrinkThumb: "11000.jpg" },
        { idDrink: '11002', strDrink: t("mustDrink.must_drink4"), strDrinkThumb: "11002.jpg" },
        ]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.idDrink}
        renderItem={({ item }) => (
        <Link href={`/cocktails/particulardrink?idDrink=${item.idDrink}`} asChild>
          <TouchableOpacity style={styles.barItem}>
          <Image source={getImage(item.strDrinkThumb)} style={styles.barImage} />
          <Text style={styles.barText}>{item.strDrink}</Text>
          </TouchableOpacity>
        </Link>
        )}
      />
      </View>

      {/* Something Special */}
      <View style={styles.somethingSpecialContainer}>
      <Text style={styles.sectionTitle}>{t("somethingCasual.Something_special")}</Text>
      <View style={styles.specialGrid}>
        {[
      { id: '1', name: t("somethingCasual.hard_drinks"), link: '/cocktails/somethingSpecial?category=hard_drinks',image:"13847.jpg" },
      { id: '2', name: t("somethingCasual.something_casual"), link: '/cocktails/somethingSpecial?category=casual',image:"15427.jpg" },
      { id: '3', name: t("somethingCasual.fruity"), link: '/cocktails/somethingSpecial?category=fruity',image:"11007.jpg" },
      { id: '4', name: t("somethingCasual.creamy_desserts"), link: '/cocktails/somethingSpecial?category=creamy_desserts',image:"11000.jpg" },
      { id: '5', name: t("somethingCasual.unique_taste"), link: '/cocktails/somethingSpecial?category=unique_taste', image:"11003.jpg" },
      { id: '6', name: t("somethingCasual.soft_drinks"), link: '/cocktails/somethingSpecial?category=soft_drinks', image:"12672.jpg" },
        ].map((item, index) => (
      <Link key={index} href={item.link as any} asChild>
        <TouchableOpacity style={styles.specialBox}>
        <Image source={getImage(item.image)} style={styles.specialIMG}></Image>
        <Text style={styles.specialBoxText}>{item.name}</Text>
        </TouchableOpacity>
      </Link>
        ))}
      </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  greeting: {
    marginTop: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  playlistItem: {
    marginRight: 16,
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
    marginTop: 10
  },
  playlistImage: {
    width: 140,
    height: 200,
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
  },
  box: {
    width: '48%',
    height: 70,
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    marginBottom: 16,
  },
  boxImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  boxText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  mustDrinkContainer: {
    marginTop: 20,
    marginBottom: 20,
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
    height: 210,
    marginBottom: 10,
  
  },
  barText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',

  },
  somethingSpecialContainer: {
    marginTop: 20,
    marginBottom: 100,
  },
  specialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specialBox: {
    width: '48%',
    height: 200,
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  specialBoxText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  specialIMG: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
});
