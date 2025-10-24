import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, ArrowLeft } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import "../../i18n";

const PrivacyPolicy: React.FC = () => {
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

  const openTermsOfService = () => {
    Linking.openURL('https://sites.google.com/view/sipster-terms-of-service');
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
            {isJapanese ? 'プライバシーポリシー' : 'Privacy Policy'}
          </Text>
        </View>

        {/* Privacy Policy Content */}
        <View style={[styles.contentContainer, { backgroundColor: cardColor, borderColor: cardBorder }]}>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={true}
          >
            {isJapanese ? (
              // Japanese Privacy Policy
              <>
                <Text style={[styles.mainTitle, { color: textColor }]}>
                  プライバシーポリシー
                </Text>

                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  発効日：2024年1月
                </Text>
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  最終更新日：2024年1月
                </Text>

                <Text style={[styles.contentText, { color: textColor }]}>
                  Sipster（以下「本アプリ」）をご利用いただきありがとうございます。本プライバシーポリシーは、本アプリがどのように情報を収集、使用、保護するかを説明します。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  1. 収集する情報
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  本アプリは、以下の情報を収集する場合があります：
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • デバイス情報（OS、バージョン、デバイスID）
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • お気に入り、評価、カスタムレシピなどのアプリ使用データ
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • サブスクリプションステータス（RevenueCat経由）
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • クラッシュレポートおよびパフォーマンスデータ
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  2. 情報の使用方法
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  収集した情報は以下の目的で使用されます：
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • アプリの機能およびユーザー体験の提供・改善
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • サブスクリプションおよび購入の管理
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • 技術的な問題の診断と解決
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • 法的要件への対応
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  3. データの共有
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  当社は、以下の場合を除き、お客様の個人情報を第三者と共有しません：
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • サブスクリプション管理のためのRevenueCat
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • アプリストア（Apple、Google）
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • 法律により義務付けられた場合
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  4. データの保存
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  お気に入り、評価、カスタムレシピなどのデータは、お使いのデバイスにローカル保存されます。当社のサーバーには保存されません。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  5. セキュリティ
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  当社は、お客様の情報を保護するため、業界標準のセキュリティ対策を講じています。ただし、インターネット上での送信方法や電子保存方法に100%安全なものは存在しません。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  6. お子様のプライバシー
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  本アプリは法定飲酒年齢に達したユーザーを対象としています。当社は、未成年から故意に個人情報を収集することはありません。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  7. お客様の権利
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  お客様には以下の権利があります：
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • アプリ内のデータへのアクセス、編集、削除
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • サブスクリプションのキャンセル（App Store設定より）
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • アプリをアンインストールしてデータ削除
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  8. 本ポリシーの変更
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  当社は、本プライバシーポリシーを随時更新する場合があります。変更は、このページに掲載され、アプリ内で通知されます。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  9. お問い合わせ
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  本プライバシーポリシーに関するご質問は、アプリ内のフィードバック機能からお問い合わせください。
                </Text>
              </>
            ) : (
              // English Privacy Policy
              <>
                <Text style={[styles.mainTitle, { color: textColor }]}>
                  Privacy Policy
                </Text>

                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  Effective Date: January 2024
                </Text>
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  Last Updated: January 2024
                </Text>

                <Text style={[styles.contentText, { color: textColor }]}>
                  Welcome to Sipster ("the App"). This Privacy Policy explains how we collect, use, and protect your information when you use our App.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  1. Information We Collect
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  We may collect the following types of information:
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Device Information: Device type, operating system, version, and unique device identifiers
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Usage Data: Favorites, ratings, custom recipes, and app interactions
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Subscription Status: Managed through RevenueCat and the App Store/Google Play
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Crash Reports and Performance Data: To improve app stability
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  2. How We Use Your Information
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  We use the collected information to:
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Provide and improve app features and user experience
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Manage subscriptions and purchases
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Diagnose and fix technical issues
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Comply with legal requirements
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  3. Data Sharing
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  We do not share your personal information with third parties, except:
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • RevenueCat for subscription management
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • App stores (Apple, Google) for purchases
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • When required by law
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  4. Data Storage
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  Your favorites, ratings, and custom recipes are stored locally on your device. We do not store this data on our servers.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  5. Security
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  We implement industry-standard security measures to protect your information. However, no method of transmission over the internet or electronic storage is 100% secure.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  6. Children's Privacy
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  This App is intended for users of legal drinking age. We do not knowingly collect personal information from minors.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  7. Your Rights
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  You have the right to:
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Access, edit, or delete your data within the app
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Cancel your subscription through App Store settings
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Uninstall the app to remove all local data
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  8. Changes to This Policy
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  We may update this Privacy Policy from time to time. Changes will be posted on this page and notified within the app.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  9. Contact Us
                </Text>
                <Text style={[styles.contentText, { color: textColor }]}>
                  If you have any questions about this Privacy Policy, please contact us through the feedback section in the app.
                </Text>
              </>
            )}

            <View style={styles.linkContainer}>
              <TouchableOpacity style={styles.linkButton} onPress={openTermsOfService}>
                <Text style={[styles.linkText, { color: accent }]}>
                  {isJapanese ? '利用規約を表示' : 'View Terms of Service'}
                </Text>
              </TouchableOpacity>
            </View>

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
  linkContainer: {
    marginTop: 20,
    gap: 10,
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  bottomSpacing: {
    height: 50,
  },
});

export default PrivacyPolicy;
