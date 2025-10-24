import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import "../../i18n";

const PiracyPolicy: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const backgroundColor = isDarkMode ? '#0a0a0a' : '#f8fafb';
  const textColor = isDarkMode ? '#ffffff' : '#1a1a1a';
  const cardColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.95)';
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  const accent = isDarkMode ? '#1DB954' : '#42db7a';
  const subtitleColor = isDarkMode ? '#b3b3b3' : '#666666';

  const handleBack = () => {
    router.back();
  };

  const isJapanese = i18n.language === 'ja';

  return (
    <LinearGradient
      colors={isDarkMode
        ? ['#0a0a0a', '#1a1a1a', '#0f0f0f']
        : ['#f8fafb', '#e8f2f7', '#deeef5']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={textColor} />
          </TouchableOpacity>
          <View style={styles.brandContainer}>
            <Ionicons name="wine" size={32} color={accent} />
            <Text style={[styles.brandText, { color: textColor }]}>Sipster</Text>
          </View>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {isJapanese ? '🚫 海賊行為防止ポリシー' : '🚫 Anti-Piracy Policy'}
          </Text>
        </View>

        {/* Piracy Policy Content */}
        <View style={[styles.contentContainer, { backgroundColor: cardColor, borderColor: cardBorder }]}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
          >
            {isJapanese ? (
              // Japanese Piracy Policy
              <>
                <Text style={[styles.mainTitle, { color: '#ff4444' }]}>
                  🚫 海賊行為防止ポリシー
                </Text>

                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  発効日：2025年9月6日
                </Text>
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  最終更新日：2025年9月6日
                </Text>

                <Text style={[styles.contentText, { color: textColor }]}>
                  Sipsterは知的財産の保護と、ユーザーに公正な体験を提供することに努めています。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  1. 海賊行為とは
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  海賊行為には以下が含まれます（これに限られません）：
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • 無許可の本アプリの配布やダウンロード
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • サブスクリプション機能の無断共有・転売
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • クラック、ハック、改造されたAPK/IPAファイルの使用
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • 本アプリやレシピの第三者サイトへのアップロード
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  2. 海賊行為の結果
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  海賊行為が判明した場合、当社は以下の措置を取ることがあります：
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • アカウントの停止または削除
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • アプリへのアクセスの恒久的な禁止
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Apple、Google、その他関連当局への通報
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • 損害回復のための法的措置
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  3. 海賊行為の通報
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  本アプリの海賊版を発見した場合は、アプリ内のフィードバック機能を通じて直ちにご連絡ください。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  4. 当社の取り組み
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  当社は、開発者および有料ユーザーを保護するため、海賊行為に対して継続的に監視・対応を行います。
                </Text>

                <Text style={[styles.importantText, { color: '#ff4444' }]}>
                  重要: 海賊行為は知的財産の窃盗です。本アプリを楽しむ場合は、正規の方法でご利用ください。
                </Text>
              </>
            ) : (
              // English Piracy Policy
              <>
                <Text style={[styles.mainTitle, { color: '#ff4444' }]}>
                  🚫 Anti-Piracy Policy
                </Text>

                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  Effective Date: September 6, 2025
                </Text>
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  Last Updated: September 6, 2025
                </Text>

                <Text style={[styles.contentText, { color: textColor }]}>
                  At Sipster, we are committed to protecting our intellectual property and ensuring a fair experience for all users.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  1. What Counts as Piracy
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  Piracy includes, but is not limited to:
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Distributing or downloading unauthorized versions of the App
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Sharing or reselling subscription features without payment
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Using cracks, hacks, or modified APK/IPA files
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Uploading the App or its recipes to third-party sites
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  2. Consequences of Piracy
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  If you engage in piracy, we may:
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Terminate or suspend your account
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Permanently ban you from accessing the App
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Report violations to Apple, Google, or other relevant authorities
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Pursue legal action to recover damages
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  3. Reporting Piracy
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  If you become aware of pirated copies of this App, please notify us immediately through the feedback section in the app.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  4. Our Commitment
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  We continuously monitor and act against piracy to protect both our developers and our paying customers.
                </Text>

                <Text style={[styles.importantText, { color: '#ff4444' }]}>
                  Important: Piracy is theft of intellectual property. Please support the app by using it legitimately.
                </Text>
              </>
            )}

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 20,
    padding: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
    marginLeft: 10,
  },
  importantText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  bottomSpacing: {
    height: 50,
  },
});

export default PiracyPolicy;
