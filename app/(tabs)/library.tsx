import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, useColorScheme } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import "../../i18n";
import imagePath from '../../assets/database/imagePath.json';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useState, useEffect } from 'react'; // Import useState and useEffect

export default function LibraryScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false); // State to track premium access

  useEffect(() => {
    const fetchPremiumAccess = async () => {
      try {
        const premiumAccess = await AsyncStorage.getItem('hasPremiumAccess');
        setHasPremiumAccess(premiumAccess === 'true'); // Set state based on stored value
      } catch (error) {
        console.error('Error fetching premium access:', error);
      }
    };

    fetchPremiumAccess();
  }, []);

  const items = [
    {
      key: 'likedDrinks',
      text: t('library.liked'),
      icon: require('../../assets/icons/Favourite.jpg'),
      link: '../pages/favourite',
    },
    {
      key: 'myBar',
      text: t('library.mybar'),
      icon: require('../../assets/icons/MyBar.jpg'),
      link: '../pages/myBar',
    },
    {
      key: 'experimental',
      text: t('library.experimental'),
      icon: require('../../assets/icons/experiment.jpg'),
      link: '../pages/experimental',
    },
    {
      key: 'randomDrink',
      text: t('library.random'),
      icon: require('../../assets/icons/random.jpg'),
      placeholder: 'R',
    },
    {
      key: 'selectLanguage',
      text: t('library.language'),
      link: '../pages/languageSelection',
      icon: require('../../assets/icons/language.jpg'),
    },
    {
      key: 'feedback',
      text: t('library.feedback'),
      link: '../pages/Feedback',
      icon: require('../../assets/icons/feedback.jpg'),
    },
  ];

  // Append the upgrade button if the user does not have premium access
  if (!hasPremiumAccess) {
    items.push({
      key: 'upgrade',
      text: t('upgrade.upgradeTitle'),
      link: '../pages/upgrade',
      icon: require('../../assets/icons/upgrade.jpg'),
    });
  }

  const colorScheme = useColorScheme(); // Get the current color scheme
  const isDarkMode = colorScheme === 'dark'; // Check if dark mode is enabled

  const backgroundColor = isDarkMode ? '#121212' : '#deebc7'; // Set background color
  const textColor = isDarkMode ? '#ffffff' : '#000000'; // Set text color
  const boxColor = isDarkMode ? '#121212' : '#deebc7'; // Set box color
  const boxColor1 = isDarkMode ? '#121212' : '#deebc7'; // Set box color
  const boxColor2 = isDarkMode ? '#403b35' : '#f5ea73'; // Set box color popular base background
  const boxColor3 = isDarkMode ? '#403b35' : '#42db7a'; // Set box color

  const handleRandomDrinkPress = () => {
    const randomIndex = Math.floor(Math.random() * imagePath.length);
    const randomDrinkId = imagePath[randomIndex];
    router.push(`/cocktails/particulardrink?idDrink=${randomDrinkId}`);
    console.log('Random drink ID:', randomDrinkId);
  };

  return (
    <View style={[styles.outerContainer, { backgroundColor }]}>
      {/* Header Container */}
      <View style={[styles.headerContainer, { backgroundColor: boxColor3 }]}>
        <Text style={[styles.header, { color: textColor }]}>{t("headers.yourLibrary")}</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {items.map((item) => (
          item.link ? (
            <Link href={item.link as any} asChild key={item.key}>
              <TouchableOpacity style={styles.item}>
                {item.icon ? (
                  <Image source={item.icon} style={styles.icon} />
                ) : (
                  <View style={styles.placeholderIcon}>
                    <Text style={styles.placeholderText}>{item.placeholder}</Text>
                  </View>
                )}
                <Text style={[styles.itemText,{color:textColor}]}>{item.text}</Text>
              </TouchableOpacity>
            </Link>
          ) : (
            <TouchableOpacity
              style={[styles.item,{backgroundColor: boxColor1}]}
              key={item.key}
              onPress={item.key === 'randomDrink' ? handleRandomDrinkPress : undefined}
            >
              {item.icon ? (
                <Image source={item.icon} style={styles.icon} />
              ) : (
                <View style={styles.placeholderIcon}>
                  <Text style={styles.placeholderText}>{item.placeholder}</Text>
                </View>
              )}
              <Text style={[styles.itemText,{color:textColor}]}>{item.text}</Text>
            </TouchableOpacity>
          )
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  headerContainer: {
      paddingTop: 50,
      paddingBottom: 10,
      paddingHorizontal: 16,
      backgroundColor: '#121212', // Adjust based on color scheme
    },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomColor: '#ccc',
  },
  icon: {
    width: 70,
    height: 70,
    marginRight: 10,
    resizeMode: 'contain',
  },
  placeholderIcon: {
    width: 70,
    height: 70,
    marginRight: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  itemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
