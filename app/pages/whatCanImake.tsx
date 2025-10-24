import React, { useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, useColorScheme, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Link, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import cocktails from '../../assets/database/cocktails.json';
import { getImage } from '@/cocktails/imagepath';
import { red } from 'react-native-reanimated/lib/typescript/Colors';

const WhatCanIMake: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation();

  const colorScheme = useColorScheme(); // Get the current color scheme
  const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

  const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
  const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
  const boxColor = isDarkMode ? '#121212' : '#deebc7'; // Set box color
  const boxColor1 = isDarkMode ? '#121212' : '#deebc7'; // Set box color
  const boxColor2 = isDarkMode ? '#403b35' : '#deebc7'; // Set box color popular base background
  const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color
  const headerBackgroundColor = isDarkMode ? '#403b35' : '#42db7a'; // Brown for dark, green for light

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const allIngredients = Array.from(
    new Set(
      cocktails.flatMap((cocktail) =>
        i18n.language === 'ja' ? cocktail.ingredientsJA : cocktail.ingredients
      )
    )
  ).filter(Boolean);

  const filteredIngredients = searchQuery
    ? allIngredients
        .filter((ingredient): ingredient is string => 
          typeof ingredient === 'string' && ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : [];

  const filteredDrinks = cocktails.filter((cocktail) => {
    const ingredientsList = i18n.language === 'ja' ? cocktail.ingredientsJA : cocktail.ingredients;
    return selectedIngredients.every((ingredient) =>
      Array.isArray(ingredientsList) && ingredientsList.includes(ingredient)
    );
  });

  const drinksCountMessage = selectedIngredients.length > 0
    ? `${filteredDrinks.length} ${t('whatCanIMake.drinksFound')}`
    : `${t('whatCanIMake.all')}${cocktails.length} ${t('whatCanIMake.allDrinksFound')}`;

  const handleAddIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
      setSearchQuery(''); // Clear the search tab
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient));
  };

  const handleScrollBeginDrag = () => {
    Keyboard.dismiss();
  };

  const getBubbleColor = (ingredient: string) => {
    const letters = [ingredient[0], ingredient[2], ingredient[4], ingredient[ingredient.length - 1]].filter(Boolean);
    const colorValue = letters.reduce((acc, letter) => acc + letter.charCodeAt(0), 0);
    const randomColor = `#${((colorValue * 1234567) % 16777215).toString(16).padStart(6, '0')}`; // Generate color
    return randomColor;
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.bubble, { backgroundColor: getBubbleColor(item) }]} // Use calculated color
      onPress={() => handleAddIngredient(item)}
    >
      <Text style={styles.bubbleText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, { backgroundColor }]}>
        <View style={[styles.headerContainer, { backgroundColor: headerBackgroundColor }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} />
          </TouchableOpacity>
          <Text style={[styles.header, { color: textColor }]}>{t('whatCanIMake.whatCanIMake')}</Text>
          <Text style={[styles.subheader, { color: textColor }]}>{t("whatCanIMake.sub1")}</Text>
          <TextInput
            style={[
              styles.searchBar,
              {
                backgroundColor: textColor, // Invert color
                color: backgroundColor, // Invert text color
              },
            ]}
            placeholder={t('whatCanIMake.search_placeholder')}
            placeholderTextColor={isDarkMode ? '#555' : '#888'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <FlatList
          data={['ingredients', 'yourIngredients', 'drinks']}
          keyExtractor={(item) => item}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={handleScrollBeginDrag} // Dismiss keyboard when scrolling starts
          renderItem={({ item }) => {
            switch (item) {
              case 'ingredients':
                return (
                  <FlatList
                    data={filteredIngredients}
                    key={`ingredients-${filteredIngredients.length}`}
                    keyExtractor={(ingredient) => ingredient}
                    renderItem={renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.bubblesContainer}
                    keyboardShouldPersistTaps="handled"
                    onScrollBeginDrag={handleScrollBeginDrag} // Dismiss keyboard when scrolling starts
                  />
                );
              case 'yourIngredients':
                return (
                  <View style={styles.whatIHaveContainer}>
                    <Text style={[styles.sectionTitle, { color: textColor }]}>
                      {t('whatCanIMake.yourIngredients')}
                    </Text>
                    {selectedIngredients.length === 0 ? (
                      <Text style={[styles.noneSelectedText]}>
                        {t('whatCanIMake.noneSelected', 'None selected')}
                      </Text>
                    ) : (
                      <FlatList
                        data={selectedIngredients}
                        keyExtractor={(ingredient) => ingredient}
                        horizontal
                        onScrollBeginDrag={handleScrollBeginDrag}
                        renderItem={({ item }) => (
                          <View style={[styles.selectedBubble, { backgroundColor: boxColor2 }]}>
                            <Text style={[styles.selectedBubbleText, { color: textColor }]}>{item}</Text>
                            <TouchableOpacity onPress={() => handleRemoveIngredient(item)}>
                              <Ionicons name="close-circle" size={20} color="#ff0000" />
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    )}
                    <Text style={[styles.drinksCount, { color: textColor }]}>
                      {drinksCountMessage}
                    </Text>
                  </View>
                );
              case 'drinks':
                return (
                  <View style={styles.drinksContainer}>
                    <Text style={[styles.sectionTitle, { color: textColor, marginLeft: 10 }]}>
                      {t('whatCanIMake.drinks', 'Drinks')}
                    </Text>
                    <FlatList
                      data={filteredDrinks}
                      keyExtractor={(item) => item.idDrink}
                      onScrollBeginDrag={handleScrollBeginDrag}
                      renderItem={({ item }) => {
                        const ingredientsList = i18n.language === 'ja' ? item.ingredientsJA : item.ingredients;
                        const remainingIngredients = Array.isArray(ingredientsList)
                          ? ingredientsList.filter((ingredient) =>
                              ingredient && !selectedIngredients.includes(ingredient)
                            ).slice(0, 4)
                          : [];
                        const displayName =
                          i18n.language.startsWith('ja') && item.strDrinkJa
                            ? item.strDrinkJa
                            : item.strDrink;
                        return (
                          <Link href={`/cocktails/particulardrink?idDrink=${item.idDrink}`} asChild>
                            <TouchableOpacity style={styles.drinkBox}>
                              <Image source={getImage(item.strDrinkThumb)} style={styles.drinkImage} />
                              <View style={styles.drinkDetails}>
                                <Text style={[styles.drinkName, { color: textColor }]}>{displayName}</Text>
                                {remainingIngredients.length > 0 && (
                                  <Text style={styles.remainingIngredients}>
                                    {remainingIngredients.join(', ')}
                                  </Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          </Link>
                        );
                      }}
                    />
                  </View>
                );
              default:
                return null;
            }
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
   paddingTop: 50,
    padding: 16,
    height: 210,
   
    
    marginBottom: 16,
  },
  header: {
    paddingTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 15,
    marginBottom: 16,
  },
  searchBar: {
    borderRadius: 8,
    padding: 10,
  },
  bubblesContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  bubble: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  whatIHaveContainer: {
    marginBottom: 16,
    marginLeft: 10,
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selectedBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  selectedBubbleText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  drinksCount: {
    fontSize: 16,
    marginTop: 8,
  },
  drinksContainer: {
    flex: 1,
  },
  drinkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  drinkImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  drinkDetails: {
    flex: 1,
  },
  drinkName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  remainingIngredients: {
    color: 'red',
    fontSize: 12,
  },
  noneSelectedText: {
    fontStyle: 'italic',
    marginTop: 8,
    color: 'red'
  },
});

export default WhatCanIMake;