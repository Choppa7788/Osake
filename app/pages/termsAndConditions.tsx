import React, { useState, useLayoutEffect, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useUser } from '../_layout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import "../../i18n";

const TermsAndConditions: React.FC = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { t, i18n } = useTranslation();
  const { acceptTerms } = useUser();
  const router = useRouter();
  const navigation = useNavigation();

  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);

  const backgroundColor = isDarkMode ? '#0a0a0a' : '#f8fafb';
  const textColor = isDarkMode ? '#ffffff' : '#1a1a1a';
  const cardColor = isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.95)';
  const cardBorder = isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  const accent = isDarkMode ? '#1DB954' : '#42db7a';
  const subtitleColor = isDarkMode ? '#b3b3b3' : '#666666';

  useEffect(() => {
    // Check if user has already accepted terms
    const checkTermsStatus = async () => {
      const termsAccepted = await AsyncStorage.getItem('termsAccepted');
      setIsViewOnly(termsAccepted === 'true');
    };
    checkTermsStatus();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleScroll = ({ nativeEvent }: { nativeEvent: any }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    setHasScrolledToBottom(isCloseToBottom);
  };

  const handleAcceptTerms = async () => {
    await acceptTerms();
    // Navigation will happen automatically when termsAccepted state changes
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://sites.google.com/view/sipster-privacy-policy');
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
        {/* Back button for view-only mode */}
        {isViewOnly && (
          <TouchableOpacity
            style={[styles.backButton, { top: 10 }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <View style={[styles.backButtonContainer, {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255, 255, 255, 0.98)',
              borderColor: isDarkMode ? 'rgba(255,255,255,0.3)' : '#C5E89A'
            }]}>
              <Ionicons name="arrow-back" size={22} color={isDarkMode ? '#fff' : '#1a1a1a'} />
            </View>
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.brandText, { color: textColor }]}>
               <Ionicons
              name="wine"
              size={32}
              color={isDarkMode ? '#1DB954' : '#42db7a'}
            />
            {isViewOnly ? (
              isJapanese ? '利用規約' : 'Terms & Conditions'
            ) : (
              <>
          {isJapanese ? 'Sipsterへようこそ' : 'Welcome to Sipster'}
          {'\n'}
          <Text style={[styles.headerSubtitle, { color: subtitleColor }]}>
            {isJapanese ? 'Welcome to Sipster' : 'Sipsterへようこそ'}
          </Text>
              </>
            )}
          </Text>
     
        </View>

        {/* Terms Content */}
        <View style={[styles.termsContainer, { backgroundColor: cardColor, borderColor: cardBorder }]}>
          <ScrollView 
            style={styles.scrollView}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={true}
          >
            {isJapanese ? (
              // Japanese Terms
              <>
                <Text style={[styles.mainTitle, { color: textColor }]}>
                  利用規約（ユーザー契約）
                </Text>
                
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  発効日：2024年1月
                </Text>
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  最終更新日：2024年1月
                </Text>

                <Text style={[styles.termsText, { color: textColor }]}>
                  Sipster（以下「本アプリ」）をご利用いただきありがとうございます。本アプリのダウンロード、アクセス、または使用を行うことにより、以下の利用規約に同意したものとみなされます。ご利用前に必ずお読みください。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  1. 利用許諾
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  本アプリは、個人かつ非商用目的での利用に限り、非独占的、譲渡不可、取消可能な利用権を付与します。
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  本アプリの一部または全部を無断で改変、配布、販売、リース、リバースエンジニアリングすることは禁止します。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  2. 年齢制限とアルコール責任
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  本アプリは、利用者が居住国における法定飲酒年齢を満たしていることを前提としています。
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  本アプリの利用により、法定飲酒年齢に達していることを確認したものとみなされます。
                </Text>
                <Text style={[styles.importantText, { color: '#ff6b35' }]}>
                  重要: 本アプリのレシピやコンテンツは、情報提供および娯楽目的です。アルコールを摂取する場合は自己責任で行ってください。
                </Text>
                <Text style={[styles.liabilityText, { color: '#ff4444' }]}>
                  免責事項: アルコール摂取、レシピの誤用、または影響下での行動に起因する健康被害、事故、損害、その他の結果について、当社は一切責任を負いません。飲酒は節度を守り、飲酒運転は絶対に行わないでください。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  3. ユーザーアカウント
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  アカウント情報およびログイン認証情報の管理はユーザー自身の責任です。
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  不正利用が発覚した場合は、直ちに当社に通知してください。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  4. 購入およびサブスクリプション
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  一部機能は有料です。購入やサブスクリプションは、App StoreまたはGoogle Playを通じて処理されます。
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  価格、請求期間、利用条件はアプリ内で表示され、地域によって異なる場合があります。
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  返金は、App Store / Google Play のポリシーに準じ、当社が直接対応するものではありません。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  5. 禁止事項
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  以下の行為は禁止です：
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • 本アプリのコンテンツやレシピを無断で複製、共有、配布すること
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • 無断で商用利用すること
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • サブスクリプションやセキュリティ、決済システムを回避する行為
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • 有害、攻撃的、または違法なコンテンツをアップロードすること
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  6. 利用停止・終了
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  本規約違反、海賊行為、またはアプリの不適切な利用があった場合、当社は利用停止またはアクセス権の終了を行う権利を留保します。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  7. 免責事項
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  本アプリは「現状のまま」提供されます。特定目的への適合性やエラーが発生しないことを保証するものではありません。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  8. 責任の制限
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  法令の許す限りにおいて：
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • 本アプリの利用に起因する損害、損失、怪我等について当社は一切責任を負いません。
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • これには、過度の飲酒、レシピへの依存、影響下での行動に起因する結果も含まれます。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  9. 準拠法
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  本規約は日本の法律に準拠します。紛争は日本の裁判所で解決されます。
                </Text>

                {/* Japanese Anti-Piracy Policy Section */}
                <Text style={[styles.mainTitle, { color: '#ff4444', marginTop: 30 }]}>
                  🚫 海賊行為防止ポリシー
                </Text>
                
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  発効日：2024年1月
                </Text>
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  最終更新日：2024年1月
                </Text>

                <Text style={[styles.termsText, { color: textColor }]}>
                  Sipsterは知的財産の保護と、ユーザーに公正な体験を提供することに努めています。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  1. 海賊行為とは
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
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
                <Text style={[styles.termsText, { color: textColor }]}>
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
                <Text style={[styles.termsText, { color: textColor }]}>
                  本アプリの海賊版を発見した場合は、アプリ内のフィードバック機能を通じて直ちにご連絡ください。
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  4. 当社の取り組み
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  当社は、開発者および有料ユーザーを保護するため、海賊行為に対して継続的に監視・対応を行います。
                </Text>
              </>
            ) : (
              // English Terms (existing content)
              <>
                <Text style={[styles.mainTitle, { color: textColor }]}>
                  User Agreement (Terms of Service)
                </Text>
                
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  Effective Date: January 2024
                </Text>
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  Last Updated: January 2024
                </Text>

                <Text style={[styles.termsText, { color: textColor }]}>
                  Welcome to Sipster. By downloading, accessing, or using this App, you agree to comply with and be bound by the following Terms of Service. Please read them carefully before using the App.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  1. License to Use
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  We grant you a limited, non-exclusive, non-transferable, revocable license to use the App solely for your personal and non-commercial use.
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  You may not modify, distribute, sell, lease, or reverse-engineer any part of the App without prior written permission.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  2. Age Restriction & Alcohol Responsibility
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  This App is intended for users of legal drinking age in their country of residence.
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  By using the App, you confirm that you meet the legal drinking age requirement.
                </Text>
                <Text style={[styles.importantText, { color: '#ff6b35' }]}>
                  Important: The recipes and content in the App are for informational and entertainment purposes only. If you consume alcohol, you do so at your own risk.
                </Text>
                <Text style={[styles.liabilityText, { color: '#ff4444' }]}>
                  Liability Disclaimer: We are not responsible for any health issues, accidents, damages, or consequences arising from alcohol consumption, misuse of recipes, or actions taken under the influence of alcohol. Please drink responsibly and never drink and drive.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  3. User Accounts
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  You are responsible for maintaining the confidentiality of your account and login credentials.
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  You agree to notify us immediately of any unauthorized use of your account.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  4. Purchases & Subscriptions
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  Some features of the App require payment. Purchases and subscriptions are processed through the App Store or Google Play.
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  Prices, billing periods, and terms are displayed in-app and may vary by region.
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  Refunds are governed by the policies of the App Store/Google Play and not by us directly.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  5. Prohibited Uses
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  You agree not to:
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Copy, share, or distribute the App's content or recipes without authorization.
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Use the App for commercial purposes without consent.
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Circumvent or attempt to bypass subscription requirements, security measures, or payment systems.
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Upload or share harmful, offensive, or illegal content through the App.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  6. Termination of Access
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  We reserve the right to suspend or terminate your access if you violate these Terms, engage in piracy, or misuse the App.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  7. Disclaimer of Warranties
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  The App is provided "as is" without any warranties or guarantees, including fitness for a particular purpose. We do not guarantee that the App will be error-free or uninterrupted.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  8. Limitation of Liability
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  To the fullest extent permitted by law:
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • We are not liable for damages, losses, or injuries resulting from the use of the App.
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • This includes (but is not limited to) consequences of excessive alcohol consumption, reliance on recipes, or actions taken under the influence of alcohol.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  9. Governing Law
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  These Terms are governed by the laws of [Your Country/Region]. Any disputes will be resolved in the courts of [Your City/Region].
                </Text>

                {/* Anti-Piracy Policy Section */}
                <Text style={[styles.mainTitle, { color: '#ff4444', marginTop: 30 }]}>
                  🚫 Anti-Piracy Policy
                </Text>
                
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  Effective Date: January 2024
                </Text>
                <Text style={[styles.dateText, { color: subtitleColor }]}>
                  Last Updated: January 2024
                </Text>

                <Text style={[styles.termsText, { color: textColor }]}>
                  At Sipster, we are committed to protecting our intellectual property and ensuring a fair experience for all users.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  1. What Counts as Piracy
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  Piracy includes, but is not limited to:
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Distributing or downloading unauthorized versions of the App.
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Sharing or reselling subscription features without payment.
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Using cracks, hacks, or modified APK/IPA files.
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Uploading the App or its recipes to third-party sites.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  2. Consequences of Piracy
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  If you engage in piracy, we may:
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Terminate or suspend your account.
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Permanently ban you from accessing the App.
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Report violations to Apple, Google, or other relevant authorities.
                </Text>
                <Text style={[styles.bulletText, { color: textColor }]}>
                  • Pursue legal action to recover damages.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  3. Reporting Piracy
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  If you become aware of pirated copies of this App, please notify us immediately through the feedback section in the app.
                </Text>

                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  4. Our Commitment
                </Text>
                <Text style={[styles.termsText, { color: textColor }]}>
                  We continuously monitor and act against piracy to protect both our developers and our paying customers.
                </Text>
              </>
            )}

            <View style={styles.linkContainer}>
              <TouchableOpacity style={styles.linkButton} onPress={openPrivacyPolicy}>
                <Text style={[styles.linkText, { color: accent }]}>
                  {isJapanese ? 'プライバシーポリシー' : 'Privacy Policy'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.linkButton} onPress={openTermsOfService}>
                <Text style={[styles.linkText, { color: accent }]}>
                  {isJapanese ? 'サポートに連絡' : 'Contact Support'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>

        {/* Accept Button - Only show for first-time users */}
        {!isViewOnly && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.acceptButton,
                { backgroundColor: hasScrolledToBottom ? accent : '#ccc' },
                !hasScrolledToBottom && styles.disabledButton
              ]}
              onPress={handleAcceptTerms}
              disabled={!hasScrolledToBottom}
              activeOpacity={0.8}
            >
              <Text style={styles.acceptButtonText}>
                {isJapanese ? '同意して続行' : 'Accept & Continue'}
              </Text>
            </TouchableOpacity>

            {!hasScrolledToBottom && (
              <Text style={[styles.scrollPrompt, { color: subtitleColor }]}>
                {isJapanese ? '続行するには最後までスクロールしてください' : 'Please scroll to the bottom to continue'}
              </Text>
            )}
          </View>
        )}
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
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  termsContainer: {
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
  termsText: {
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
    marginBottom: 12,
    fontWeight: '600',
  },
  liabilityText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
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
  buttonContainer: {
    paddingBottom: 20,
  },
  acceptButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollPrompt: {
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    zIndex: 20,
  },
  backButtonContainer: {
    width: 42,
    height: 42,
    borderRadius: 50,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});

export default TermsAndConditions;
