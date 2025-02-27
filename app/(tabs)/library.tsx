import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import "../../i18n";
import imagePath from '../../assets/database/imagePath.json';

export default function LibraryScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

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

  const handleRandomDrinkPress = () => {
    const randomIndex = Math.floor(Math.random() * imagePath.length);
    const randomDrinkId = imagePath[randomIndex];
    router.push(`/cocktails/particulardrink?idDrink=${randomDrinkId}`);
    console.log('Random drink ID:', randomDrinkId);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{t("headers.yourLibrary")}</Text>
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
              <Text style={styles.itemText}>{item.text}</Text>
            </TouchableOpacity>
          </Link>
        ) : (
          <TouchableOpacity
            style={styles.item}
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
            <Text style={styles.itemText}>{item.text}</Text>
          </TouchableOpacity>
        )
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  header: {
    marginTop: 35,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
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
