import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme, Linking, StyleSheet, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLayoutEffect } from 'react';
import { useNavigation } from 'expo-router';
import { t } from 'i18next';
import { LinearGradient } from 'expo-linear-gradient';

const INSTAGRAM_URL = 'https://www.instagram.com/ace___eel77/';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61580342671430/';
const X_URL = 'https://twitter.com/https://x.com/gopvivre?s=21';
const APP_STORE_URL = 'itms-apps://itunes.apple.com/app/6751738718?action=write-review'; // TODO: replace with real id
const APP_SHARE_LINK = 'https://apps.apple.com/app/6751738718'; // public store link

export default function Social() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const navigation = useNavigation();


  const textColor = isDarkMode ? '#fff' : '#1c1c1e';
  const subColor = isDarkMode ? '#AAA' : '#444';
  const cardBg = isDarkMode ? 'rgba(32,32,32,0.65)' : 'rgba(255,255,255,0.55)';
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.4)';
  const headingIconColor = isDarkMode ? '#1DB954' : '#E1306C';
  const neutralBtnBg = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const neutralBtnText = isDarkMode ? '#f0f0f0' : '#232323';
  const secondaryBtnBg = isDarkMode ? '#2d2d2d' : '#f7f7f7';
  const secondaryBtnText = isDarkMode ? '#232323' : '#232323';
  const outlineBtnBg = isDarkMode ? 'rgba(255,215,0,0.06)' : 'rgba(255,215,0,0.13)';
  const outlineBtnText = isDarkMode ? '#232323' : '#232323';
  const shareIconColor = isDarkMode ? '#fff' : secondaryBtnText;
  const rateIconColor = isDarkMode ? '#fff' : outlineBtnText;

  const openUrl = (url) => Linking.openURL(url).catch(()=>{});
  const openInstagram = () => openUrl(INSTAGRAM_URL);
  const openFacebook = () => openUrl(FACEBOOK_URL);
  const openX = () => openUrl(X_URL);
  const openStore = () => openUrl(APP_STORE_URL);
  const shareApp = async () => {
    try {
      await Share.share({
        message: `${t('social.shareText') || 'Check out this awesome cocktail app!'} ${APP_SHARE_LINK}`,
      });
    } catch {}
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackgroundColor: { backgroundColor: isDarkMode ? '#121212' : '#ffffff' },
      headerLeft: () => (
        <Ionicons
          name="arrow-back"
          size={24}
          color={isDarkMode ? 'white' : 'black'}
          onPress={() => navigation.goBack()}
        />
      ),
      title: t('social.socialTitle'),
    });
  }, [navigation, isDarkMode]);

  return (
    <LinearGradient
      colors={isDarkMode ? ['#0d0d0d', '#141414', '#1e1e1e'] : ['#f9fafc', '#eef1f5', '#e9ecef']}
      style={styles.flex}
    >
      <View style={styles.wrapper}>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
          <View style={styles.headerRow}>
            <Ionicons name="share-social" size={40} color={headingIconColor} />
            <Text style={[styles.heading, { color: textColor }]}>
              {t('social.followUs') || 'Follow & Support'}
            </Text>
          </View>
          <Text style={[styles.sub, { color: subColor }]}>
            {t('social.subtitle') || 'Follow us, rate us, and share the app.'}
          </Text>

            <TouchableOpacity style={[styles.primaryBtn]} activeOpacity={0.85} onPress={openInstagram}>
              <Ionicons name="logo-instagram" size={20} color="#fff" style={styles.btnIcon} />
              <Text style={styles.primaryText}>{t('social.openInstagram') || 'Open Instagram'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.neutralBtn, { backgroundColor: neutralBtnBg }]} activeOpacity={0.85} onPress={openFacebook}>
              <Ionicons name="logo-facebook" size={20} color="#1877F2" style={styles.btnIcon} />
              <Text style={[styles.neutralText, { color: neutralBtnText }]}>{t('social.openFacebook') || 'Open Facebook'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.neutralBtn, { backgroundColor: neutralBtnBg }]} activeOpacity={0.85} onPress={openX}>
              <Ionicons name="logo-twitter" size={20} color="#1DA1F2" style={styles.btnIcon} />
              <Text style={[styles.neutralText, { color: neutralBtnText }]}>{t('social.openX') || 'Open X'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: secondaryBtnBg }]} activeOpacity={0.85} onPress={shareApp}>
              <Ionicons name="send" size={18} color={shareIconColor} style={styles.btnIcon} />
              <Text style={[styles.secondaryText, { color: neutralBtnText }]}>{t('social.shareApp') || 'Share App'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.outlineBtn, { backgroundColor: outlineBtnBg }]} activeOpacity={0.85} onPress={openStore}>
              <Ionicons name="star" size={18} color={rateIconColor} style={styles.btnIcon} />
              <Text style={[styles.outlineText, { color: neutralBtnText }]}>{t('social.rateApp') || 'Rate us on the App Store'}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  wrapper: { flex: 1, paddingHorizontal: 26, paddingVertical: 36, justifyContent: 'center' },
  card: {
    borderRadius: 30,
    padding: 28,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  heading: { fontSize: 24, fontWeight: '800' },
  sub: { fontSize: 14, lineHeight: 20, marginBottom: 26 },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#E1306C', paddingVertical: 15, borderRadius: 18,
    shadowColor: '#E1306C', shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 6 },
    marginBottom: 14,
  },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.5 },
  neutralBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 16,
    marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  neutralText: { fontSize: 14, fontWeight: '600', letterSpacing: 0.4 },
  secondaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 15, borderRadius: 16,
    marginTop: 4, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  secondaryText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
  outlineBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 16,
    borderWidth: 1.5, borderColor: '#FFD70033',
  },
  outlineText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.6 },
  btnIcon: { marginRight: 8 },
});