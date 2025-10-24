import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useColorScheme, Modal } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LockSimple, Heart, Wine, Flask, Shuffle, GlobeHemisphereWest, ChatCircle, CrownSimple } from 'phosphor-react-native';
import "../../i18n";
import imagePath from '../../assets/database/imagePath.json';
import { useState } from 'react';
import { useUser } from '../_layout';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LibraryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isPro } = useUser();
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const gradientColors: [string, string, string] = isDarkMode
    ? ['#0d1b2a', '#1b263b', '#0d1b2a']
    : ['#2c5f8d', '#1e3a5f', '#0d2238'];

  const menuItems = [
    {
      key: 'liked',
      title: t('library.liked'),
      icon: Heart,
      iconColor: '#FF6B6B',
      route: '../pages/favourite',
    },
    {
      key: 'myBar',
      title: t('library.mybar'),
      icon: Wine,
      iconColor: '#8B4513',
      route: '../pages/myBar',
      locked: !isPro,
    },
    {
      key: 'experimental',
      title: t('library.experimental'),
      icon: Flask,
      iconColor: '#4ECDC4',
      route: '../pages/experimental',
    },
    {
      key: 'random',
      title: t('library.random'),
      icon: Shuffle,
      iconColor: '#FFD93D',
      onPress: () => {
        const randomIndex = Math.floor(Math.random() * imagePath.length);
        const randomDrinkId = imagePath[randomIndex];
        router.push(`/cocktails/particulardrink?idDrink=${randomDrinkId}`);
      },
    },
    {
      key: 'language',
      title: t('library.language'),
      icon: GlobeHemisphereWest,
      iconColor: '#6C5CE7',
      route: '../pages/languageSelection',
    },
    {
      key: 'feedback',
      title: t('library.feedback'),
      icon: ChatCircle,
      iconColor: '#A8E6CF',
      route: '../pages/Feedback',
    },
  ];

  if (!isPro) {
    menuItems.push({
      key: 'upgrade',
      title: t('upgrade.upgradeTitle'),
      icon: CrownSimple,
      iconColor: '#FFD700',
      route: '../pages/upgrade',
    });
  }


  return (
    <LinearGradient colors={gradientColors} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, {
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255, 255, 255, 0.98)',
          borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : '#C5E89A'
        }]}>
          <View style={styles.headerIconCircle}>
            <Wine size={28} color="#fff" weight="fill" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#1a1a1a' }]}>
              {t("headers.yourLibrary")}
            </Text>
            <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#e0e0e0' : '#3a5a0a' }]}>
              {t("library.subtitle", "Your personal collection")}
            </Text>
          </View>
        </View>

        {/* Settings List */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isLocked = item.locked;

            const handlePress = () => {
              if (isLocked) {
                setShowPremiumPopup(true);
              } else if (item.onPress) {
                item.onPress();
              } else if (item.route) {
                router.push(item.route as any);
              }
            };

            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.settingsItem,
                  isDarkMode
                    ? {
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        borderColor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                      }
                    : {
                        backgroundColor: '#E6FFF7', // mint pastel
                        borderColor: '#A8E6CF', // mint border
                        borderWidth: 2,
                        shadowColor: '#A8E6CF',
                        shadowOpacity: 0.18,
                        shadowRadius: 16,
                        backdropFilter: 'blur(10px)',
                      },
                ]}
                onPress={handlePress}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox]}> 
                  <Icon size={34} weight="fill" color={item.iconColor} />
                </View>
                <Text style={[styles.itemTitle, { color: isDarkMode ? '#fff' : '#1a1a1a' }]}>
                  {item.title}
                </Text>
                {isLocked && (
                  <LockSimple size={20} color={isDarkMode ? '#fff' : '#666'} style={styles.lockIcon} />
                )}
              </TouchableOpacity>
            );
          })}

          {/* Legal Links at Bottom */}
          <View style={styles.legalLinksContainer}>
            <TouchableOpacity onPress={() => router.push('../pages/termsView')}>
              <Text style={[styles.legalLink, { color: isDarkMode ? '#ccc' : '#fff' }]}>
                {t('library.terms', 'Terms & Conditions')}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.legalSeparator, { color: isDarkMode ? '#ccc' : '#fff' }]}>•</Text>
            <TouchableOpacity onPress={() => router.push('../pages/privacyPolicy')}>
              <Text style={[styles.legalLink, { color: isDarkMode ? '#ccc' : '#fff' }]}>
                {t('library.privacy', 'Privacy Policy')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Premium Modal */}
      <Modal
        visible={showPremiumPopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPremiumPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {
            backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff'
          }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#1a1a1a' }]}>
              {t('upgrade.premiumRequired')}
            </Text>
            <Text style={[styles.modalDescription, { color: isDarkMode ? '#e0e0e0' : '#3a5a0a' }]}>
              {t('upgrade.myBarDescription')}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.cancelButton, {
                  backgroundColor: isDarkMode ? '#333333' : '#e0e0e0'
                }]}
                onPress={() => setShowPremiumPopup(false)}
              >
                <Text style={[styles.cancelButtonText, { color: isDarkMode ? '#fff' : '#1a1a1a' }]}>
                  {t('common.cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => {
                  setShowPremiumPopup(false);
                  router.push('../pages/upgrade');
                }}
              >
                <Text style={styles.upgradeButtonText}>
                  {t('upgrade.upgradeNow')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
    marginHorizontal: 18,
    borderRadius: 32,
    borderWidth: 1.5,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  headerIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#58CC02',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 18,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.85,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 100,
  },
  legalLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 30,
    paddingVertical: 20,
    gap: 8,
  },
  legalLink: {
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    fontSize: 11,
    marginHorizontal: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 85,
    marginBottom: 14,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  iconBox: {
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
  lockIcon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: 20,
    padding: 24,
    borderRadius: 14,
    minWidth: 300,
    alignItems: 'center',
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 22,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  upgradeButton: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 6,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
