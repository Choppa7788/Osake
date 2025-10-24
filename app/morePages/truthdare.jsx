import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
  Dimensions,
  useColorScheme,
  Platform
} from 'react-native';
import { useNavigation } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// REPLACED PROMPT ARRAYS
export const casualTruths = [
  "What’s the funniest thing you’ve done after drinking?",
  "What’s your go-to party drink?",
  "Have you ever pretended to like a drink you actually hated?",
  "What’s your weirdest hangover cure?",
  "What’s your record for most shots in a night?",
  "Ever spilled a drink on someone and acted like it wasn’t you?",
  "What’s the most expensive drink you’ve ever bought?",
  "Have you ever secretly swapped your drink for water?",
  "What’s the silliest drunk text you’ve sent?",
  "Have you ever stolen someone’s drink?",
  "What’s your most embarrassing bar moment?",
  "Ever gotten tipsy at work or school?",
  "What drink instantly reminds you of a bad night?",
  "Who here would you trust to mix your drink?",
  "What’s your go-to cocktail order?",
  "Have you ever made a drink so bad you had to throw it away?",
  "Who here is the lightweight?",
  "What’s your weirdest drinking game experience?",
  "Have you ever passed out before midnight?",
  "What’s your ultimate drunk food?",
  "Who here can’t handle tequila?",
  "What’s the worst drink you’ve ever tasted?",
  "Ever lied about how drunk you were?",
  "What’s your funniest memory involving a beer pong game?",
  "Have you ever woken up with a random drink in your hand?",
  "What’s your ideal drink if money wasn’t an issue?",
  "Ever gone to the bar in pajamas?",
  "Who here gets loudest after a drink?",
  "What’s your favorite drinking game?",
  "Who would you not trust to mix drinks?",
  "Have you ever bought a round for everyone?",
  "What’s your favorite bar snack?",
  "Ever played a drinking game and cheated?",
  "Who here has the funniest drunk story?",
  "What’s your best hangover prevention tip?",
  "Ever left a drink behind at the bar?",
  "Who’s most likely to start singing after a drink?",
  "What drink do you regret ever trying?",
  "Ever gotten free drinks by flirting?",
  "What’s your go-to beer?",
  "Who here would survive a shot-for-shot challenge?",
  "Ever danced on a table?",
  "Who here is most likely to order a fruity cocktail?",
  "What’s the strangest drink mix you’ve tried?",
  "Who has the fanciest taste in drinks?",
  "Ever pretended to be sober when you clearly weren’t?",
  "What’s your drink of choice for celebrations?",
  "Who here is the slowest drinker?",
  "What’s your ideal happy hour deal?",
  "Who here could win a chugging contest?"
];

export const casualDares = [
  "Take two sips of your drink.",
  "Finish your drink.",
  "Take a shot with the person to your right.",
  "Swap drinks with someone for one round.",
  "Sing a toast before drinking.",
  "Chug your drink for 5 seconds.",
  "Take a drink with no hands.",
  "Let someone else make your next drink.",
  "Do a silly dance while holding your drink.",
  "Take a drink and wink at everyone.",
  "Pretend to bartend and make a fake drink order.",
  "Spin around 5 times then drink.",
  "Drink with your non-dominant hand for the next round.",
  "Give a fake TED talk while holding your drink.",
  "Pretend you’re in a wine commercial.",
  "Take a drink every time someone says “cheers” until your turn comes again.",
  "Try to balance your drink on your head for 5 seconds.",
  "Act like you hate your favorite drink.",
  "Clink glasses with everyone before drinking.",
  "Swap seats with someone mid-drink.",
  "Speak in a British accent until your next turn.",
  "Take a selfie with your drink and show everyone.",
  "Pretend to be a bartender taking a complicated order.",
  "Hold your drink like it’s a priceless treasure.",
  "Pretend to chug but actually take a tiny sip.",
  "Do your best “cheers” in slow motion.",
  "Pretend to spill your drink (but don’t).",
  "Make up a toast for the group.",
  "Tell a bad joke before drinking.",
  "Pretend to faint after taking a sip.",
  "Take a drink without using your hands.",
  "Pretend to be an influencer reviewing your drink.",
  "Shout “Bottoms up!” before drinking.",
  "Take a drink while making eye contact with someone.",
  "Pretend your drink is too hot to sip.",
  "Act like you just drank the strongest alcohol ever.",
  "Pretend to be a mixologist explaining your drink.",
  "Tap your glass three times before drinking.",
  "Pretend to be in a movie scene with your drink.",
  "Hide your drink and make someone guess what it is.",
  "Pretend you’re trying it for the first time.",
  "Take a sip after making a funny face.",
  "Pretend your drink is magical.",
  "Pretend your drink is poisonous.",
  "Take a drink like you’re a spy.",
  "Pretend to get drunk instantly.",
  "Pretend you’re hosting a party commercial.",
  "Take a drink with your eyes closed.",
  "Pretend your drink is the best thing you’ve ever tasted.",
  "Say “cheers” in three languages before drinking."
];

export const sexualTruths = [
  "Have you ever kissed someone here?",
  "Who here would you flirt with the most?",
  "What’s your go-to flirting move?",
  "Have you ever had a crush on a friend?",
  "What’s your most romantic date idea?",
  "Who here would you most want to slow dance with?",
  "Ever had a dream about someone here?",
  "Who here is the best looking?",
  "What’s the most romantic thing you’ve done?",
  "Have you ever had a crush on a stranger?",
  "What’s your biggest turn-on?",
  "Who here has the best smile?",
  "Have you ever sent a flirty text?",
  "Who here would be the best kisser?",
  "Do you believe in love at first sight?",
  "Have you ever had a romantic moment ruined?",
  "Who here would you share a dessert with?",
  "What’s the sweetest thing someone has done for you?",
  "Have you ever held hands just for comfort?",
  "Who here would you want to cuddle with?",
  "Have you ever written a love note?",
  "Who here is most likely to make you blush?",
  "What’s your idea of a perfect kiss?",
  "Have you ever liked someone older?",
  "Who here would you most want to be stranded with?",
  "What’s the most flirty thing you’ve done?",
  "Who here is most charming?",
  "What song makes you think of romance?",
  "Have you ever fallen for a friend of a friend?",
  "Who here would you take to a fancy dinner?",
  "What’s your favorite compliment to receive?",
  "Who here would you go on a road trip with?",
  "What’s the most romantic movie scene to you?",
  "Who here do you think is the best hugger?",
  "Have you ever danced in the rain?",
  "Who here would you most want to cook for you?",
  "Have you ever given a surprise kiss?",
  "Who here looks best dressed up?",
  "Have you ever held hands with someone secretly?",
  "Who here do you think has the most confidence?",
  "Have you ever blushed because of someone here?",
  "Who here would you most want to watch a sunset with?",
  "What’s the most romantic gift you’ve given?",
  "Who here would you most want to take on a weekend trip?",
  "What’s the sweetest compliment you’ve given?",
  "Who here has the most attractive voice?",
  "What’s your ideal romantic getaway?",
  "Who here would you share an umbrella with?",
  "What’s the most unexpected romantic gesture you’ve received?",
  "Who here do you think would be the most fun date?"
];

export const sexualDares = [
  "Whisper something flirty to the person on your left.",
  "Hold hands with someone for 30 seconds.",
  "Compliment someone’s appearance.",
  "Give someone a wink.",
  "Slow dance with someone for 15 seconds.",
  "Say something romantic to the person across from you.",
  "Give a playful shoulder massage.",
  "Maintain eye contact with someone for 10 seconds.",
  "Pretend to serenade someone.",
  "Give someone a genuine compliment.",
  "Blow a kiss to someone.",
  "Playfully mimic someone’s walk.",
  "Share a romantic movie scene you like.",
  "Pretend to propose to someone.",
  "Let someone fix your hair.",
  "Pretend to write someone a love note.",
  "Draw a heart on someone’s hand.",
  "Give someone a high five and hold it for 5 seconds.",
  "Pretend to save someone from danger dramatically.",
  "Compliment someone’s smile.",
  "Playfully feed someone an imaginary dessert.",
  "Pretend to give someone a romantic gift.",
  "Say “I like you” in the most dramatic way possible.",
  "Pretend to be lovestruck when someone talks.",
  "Offer someone your seat in a flirty way.",
  "Pretend to ask someone out on a date.",
  "Play a short romantic scene from a movie with someone.",
  "Compliment someone’s style.",
  "Pretend to cheer someone up romantically.",
  "Gently touch someone’s shoulder while talking.",
  "Pretend to dance in a ballroom with someone.",
  "Playfully “protect” someone from an imaginary danger.",
  "Compliment someone’s voice.",
  "Pretend to gift someone flowers.",
  "Compliment someone’s eyes.",
  "Pretend to get lost in someone’s gaze.",
  "Pretend you’re on a romantic picnic with someone.",
  "Pretend to teach someone a dance move.",
  "Playfully “argue” over who’s cuter.",
  "Pretend to write someone’s name with your finger in the air.",
  "Playfully offer someone a “lucky charm” for love.",
  "Pretend to rehearse a wedding vow.",
  "Compliment someone’s laugh.",
  "Pretend to be in a cheesy romance ad with someone.",
  "Compliment someone’s hair.",
  "Pretend to serenade someone with a random object as a mic.",
  "Pretend to share an ice cream with someone.",
  "Compliment someone’s outfit.",
  "Pretend to be on a romantic walk with someone.",
  "Playfully “fight” over who’s more charming."
];

export const casualTruthsJP = [
  // Japanese casual truths
  "飲みすぎた時にやらかした一番面白いことは？",
  "パーティーでの定番の飲み物は？",
  "実は嫌いなのに好きだと言った飲み物はある？",
  "変わった二日酔い対策は？",
  "一晩で飲んだショットの最高記録は？",
  "誰かに飲み物をこぼして、自分じゃないふりをしたことは？",
  "今までで一番高価な飲み物は？",
  "こっそり飲み物を水に入れ替えたことは？",
  "酔っ払って送った一番おかしなメッセージは？",
  "誰かの飲み物を盗んだことは？",
  "一番 embarrassing なバーでの出来事は？",
  "仕事や学校で酔っ払ったことはある？",
  "悪い夜を思い出させる飲み物は？",
  "ここにいる誰に自分の飲み物を作ってもらいたい？",
  "定番のカクテルは？",
  "あまりにもまずい飲み物を作って捨てたことはある？",
  "ここにいる誰が一番お酒に弱いと思う？",
  "変わった飲みゲームの経験は？",
  "真夜中前に気を失ったことはある？",
  "究極の酔っ払いフードは？",
  "ここにいる誰がテキーラを扱えないと思う？",
  "今までで一番まずい飲み物は？",
  "酔っ払っていたことを隠したことはある？",
  "ビール pong ゲームでの一番おかしな思い出は？",
  "ランダムな飲み物を手にして目覚めたことは？",
  "お金に糸目をつけずに飲むとしたら、理想の飲み物は？",
  "パジャマのままでバーに行ったことはある？",
  "ここにいる誰が一番酔っ払った後に大声になると思う？",
  "お気に入りの飲みゲームは？",
  "誰にドリンクを作るのを信頼できない？",
  "みんなのためにラウンドを買ったことはある？",
  "お気に入りのバーのスナックは？",
  "飲みゲームをしていてズルをしたことはある？",
  "ここにいる誰が一番おかしな酔っ払いの話を持っている？",
  "二日酔い防止のベストなコツは？",
  "バーに飲み物を置き忘れたことはある？",
  "飲んだ後に歌い始めるのは誰だと思う？",
  "今までで一番後悔している飲み物は？",
  "お世辞で無料の飲み物をもらったことはある？",
  "お気に入りのビールは？",
  "ここにいる誰がショット・フォー・ショットの挑戦に生き残ると思う？",
  "テーブルの上で踊ったことはある？",
  "ここにいる誰がフルーティーなカクテルを注文すると思う？",
  "今まで試した中で一番変わった飲み物の組み合わせは？",
  "一番おしゃれな飲み物のセンスを持っているのは誰？",
  "明らかに酔っ払っているのに素面のふりをしたことはある？",
  "お祝いの時に飲む理想の飲み物は？",
  "ここにいる誰が一番飲むのが遅いと思う？",
  "理想的なハッピーアワーのディールは？",
  "ここにいる誰がチャンピオンチョッガーになれるのは誰？"
];

export const casualDaresJP = [
  "2口飲む。",
  "飲み干す。",
  "右隣の人とショットを1杯。",
  "誰かと1ラウンド分の飲み物を交換する。",
  "飲む前に乾杯の歌を歌う。",
  "5秒間で飲み干す。",
  "手を使わずに飲む。",
  "次の飲み物は他の人に作ってもらう。",
  "飲み物を持ったままおかしなダンスをする。",
  "飲んでからみんなにウィンクする。",
  "バーテンダーになりきって、架空のドリンクオーダーを作る。",
  "5回回転してから飲む。",
  "次のラウンドは利き手じゃない方の手で飲む。",
  "飲み物を持ったまま偽のTEDトークをする。",
  "ワインのCMに出ているふりをする。",
  "次の自分の番が来るまで、誰かが「乾杯」と言うたびに飲む。",
  "5秒間、頭の上に飲み物をバランスよく乗せる。",
  "お気に入りの飲み物を嫌いだと言ってみる。",
  "飲む前にみんなとグラスを合わせる。",
  "飲みながら誰かと席を交換する。",
  "次のターンまでずっとイギリス英語のアクセントで話す。",
  "飲み物を持って自撮りをし、みんなに見せる。",
  "複雑なオーダーをしているバーテンダーのふりをする。",
  "飲み物を大切な宝物のように持つ。",
  "一気に飲むふりをして、実際には少しだけ飲む。",
  "スローモーションで「乾杯」をするふりをする。",
  "飲み物をこぼすふりをする（でもこぼさない）。",
  "グループのために乾杯のスピーチを作る。",
  "飲む前に悪いジョークを言う。",
  "一口飲んだ後に気絶するふりをする。",
  "手を使わずに飲む。",
  "自分の飲み物をレビューするインフルエンサーのふりをする。",
  "飲む前に「ボトムズアップ！」と叫ぶ。",
  "誰かと目を合わせながら飲む。",
  "飲み物が熱すぎるふりをする。",
  "今までで最強のアルコールを飲んだかのように振る舞う。",
  "自分の飲み物を説明するミクソロジストのふりをする。",
  "飲む前にグラスを3回タップする。",
  "自分の飲み物と映画のシーンにいるふりをする。",
  "飲み物を隠して、誰かに当てさせる。",
  "初めて飲むふりをする。",
  "おかしな顔をした後に一口飲む。",
  "自分の飲み物が魔法の飲み物だと思い込む。",
  "自分の飲み物が毒だと思い込む。",
  "スパイのように飲む。",
  "瞬時に酔っ払ったふりをする。",
  "パーティーのCMをホストしているふりをする。",
  "目を閉じて飲む。",
  "自分の飲み物が今までで最高の味だと思い込む。",
  "飲む前に3か国語で「乾杯」と言う。"
];

// Sexual Truths (JP)
export const sexualTruthsJP = [
  "今までで一番大胆だったデートは？",
  "誰かに一番ドキドキした瞬間は？",
  "初めてキスしたのは何歳？",
  "キスで好きなタイプは？",
  "酔って誰かにアプローチしたことはある？",
  "人前で手をつないだことはある？",
  "あなたが一番魅力的だと思うパーツは？",
  "ドキッとした仕草は？",
  "酔って大胆になったことはある？",
  "秘密の片思いはある？",
  "甘いセリフを言われたことある？",
  "誰かにドリンクを奢られて惹かれたことある？",
  "デートでの理想のシチュエーションは？",
  "一番ロマンチックだった瞬間は？",
  "キスしたいと思ったことがある人はこの中にいる？",
  "初めて手を握られた時の感想は？",
  "好きな香りは？",
  "好きなタイプを3つ挙げて。",
  "恋人にされて嬉しかったことは？",
  "理想の夜デートは？",
  "誰かの声でドキドキしたことはある？",
  "今までで一番心が乱れた瞬間は？",
  "恋愛映画で泣いたことある？",
  "酔って誰かに甘えたことある？",
  "キスは長め派？短め派？",
  "恋人に一番されたいことは？",
  "サプライズで嬉しかったことは？",
  "恋愛に関して一番大胆だった行動は？",
  "隣の人と手をつないだらどう感じる？",
  "愛情表現は言葉派？行動派？",
  "恋人に歌ってもらったことある？",
  "初デートでのNGは？",
  "ロマンチックな場所で一番好きなのは？",
  "恋愛で一番照れた瞬間は？",
  "酔って誰かにキスしたことは？",
  "理想の朝は？",
  "好きなスキンシップは？",
  "この中で一番魅力的だと思う人は？",
  "今までで一番印象的なデートは？",
  "恋人の好きな服装は？",
  "手をつないだまま歩くのは好き？",
  "恋人と過ごす冬と夏、どっちが好き？",
  "恋愛で一番緊張した出来事は？",
  "恋人と行きたい国は？",
  "好きな色気のある仕草は？",
  "恋人とする理想の旅行は？",
  "過去に恋愛でやらかしたことは？",
  "今までで一番忘れられないキスは？",
  "恋人から呼ばれたい呼び方は？"
];

// Sexual Dares (JP)
export const sexualDaresJP = [
  "隣の人に手を3秒間握らせる。",
  "甘い声で『乾杯』と言う。",
  "誰かにウィンクする。",
  "ドリンクを持ちながら誘惑的に歩く。",
  "隣の人とアイコンタクト5秒間。",
  "誰かに『あなた素敵ね』と言う。",
  "魅力的なポーズを1つする。",
  "誰かの耳元で乾杯の言葉を囁く。",
  "笑顔でドリンクを差し出す。",
  "誰かと腕を組んで乾杯する。",
  "バーテンダー風に色っぽくドリンクを渡す。",
  "誰かの目を見つめながら一口飲む。",
  "唇をすぼめてエアキスを送る。",
  "ドリンクを飲みながら片目ウィンク。",
  "誰かに『今夜も楽しいね』と言う。",
  "モデル歩きでテーブルを一周する。",
  "魅惑的な笑顔で乾杯する。",
  "隣の人の名前を甘く呼ぶ。",
  "ドリンクを渡す時に指先を少し触れる。",
  "誰かに『今日のあなた最高』と言う。",
  "魅力的な表情で一口飲む。",
  "乾杯の時に少し長く手を握る。",
  "セクシーに座り直す。",
  "誰かのドリンクを持って飲ませるふりをする。",
  "甘い声で『もっと飲もう』と言う。",
  "隣の人にドリンクを作って渡す。",
  "ゆっくりグラスを傾けて飲む。",
  "魅力的に髪を直す。",
  "少し近づいて乾杯する。",
  "誰かの名前を囁く。",
  "魅惑的な目線を送る。",
  "軽く肩に触れて『乾杯』と言う。",
  "誰かの耳元でジョークを言う。",
  "笑顔でグラスを差し出す。",
  "ゆっくり口をつけて飲む。",
  "テーブル越しに手を差し出す。",
  "軽く指を絡ませて握手する。",
  "甘い笑顔を見せる。",
  "隣の人に『一緒に飲もう』と言う。",
  "一歩近づいて話す。",
  "片眉を上げて微笑む。",
  "グラス越しに目を合わせる。",
  "魅力的に『どう？』と言う。",
  "頬杖をついて見つめる。",
  "飲んだ後に小さくため息をつく。",
  "少し長く見つめてから笑う。",
  "誰かと手を合わせる乾杯をする。",
  "ゆっくりグラスを置く。",
  "誰かに『乾杯は君とだけ』と言う。"
];

// Add (restore) geometry helpers (were removed)
const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = (Math.PI / 180) * angleDeg;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};
const describeSector = (cx, cy, r, startAngle, endAngle) => {
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ');
};

export default function TruthDare() {
      const { t, i18n } = useTranslation();
    const [gameState, setGameState] = useState('setup'); // 'setup', 'playing', 'result'
    const [playerCount, setPlayerCount] = useState(2);
    const [gameMode, setGameMode] = useState('casual');
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [mode, setMode] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [wheelAngle, setWheelAngle] = useState(0); // degrees

    const angleRef = useRef(0);
    const velocityRef = useRef(0); // deg per frame
    const rafRef = useRef(null);

      const colorScheme = useColorScheme();
            const isDarkMode = colorScheme === 'dark';
        const backgroundColor = isDarkMode ? '#121212' : '#ffffff'; // Set background color
           const navigation = useNavigation();
           useLayoutEffect(() => {
  navigation.setOptions({
    headerBackgroundColor: { backgroundColor },
    headerLeft: () => (
      <Ionicons name="arrow-back" size={24} color={isDarkMode ? "white" : "black"} onPress={() => navigation.goBack()} />
    ),
    title: t('truth_and_dare.truth_and_dare'), // updated title
  });
}, [navigation, backgroundColor, isDarkMode]);

    
    const pulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (selectedPlayer) {
        pulse.setValue(1);
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulse, { toValue: 1.12, duration: 550, useNativeDriver: true }),
            Animated.timing(pulse, { toValue: 1.0, duration: 550, useNativeDriver: true }),
          ])
        ).start();
      } else {
        pulse.stopAnimation();
        pulse.setValue(1);
      }
    }, [selectedPlayer]);

    // UPDATED handleChoice to use language + mode
    const handleChoice = (choice) => {
      setMode(choice);
      const lang = i18n.language || 'en';
      const isJA = lang.startsWith('ja');
      let truths, dares;
      if (gameMode === 'casual') {
        truths = isJA ? casualTruthsJP : casualTruths;
        dares = isJA ? casualDaresJP : casualDares;
      } else {
        truths = isJA ? sexualTruthsJP : sexualTruths;
        dares = isJA ? sexualDaresJP : sexualDares;
      }
      const pool = choice === 'truth' ? truths : dares;
      setPrompt(pool[Math.floor(Math.random() * pool.length)] || '');
      setGameState('result');
    };

    const finalizeSelection = () => {
        const anglePerPlayer = 360 / playerCount;
        const normalized = ((angleRef.current % 360) + 360) % 360;
        // Pointer at right (0°). Sector index inverse because wheel rotation advances sectors past pointer.
        let index = Math.floor(((360 - normalized) % 360) / anglePerPlayer);
        if (index < 0) index = 0;
        setSelectedPlayer(index + 1);
        setIsSpinning(false);
        velocityRef.current = 0;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };

    const step = () => {
        angleRef.current += velocityRef.current;
        // friction
        velocityRef.current *= 0.97;
        setWheelAngle(angleRef.current);
        if (velocityRef.current < 0.3) {
            finalizeSelection();
            return;
        }
        rafRef.current = requestAnimationFrame(step);
    };

    const spinWheel = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setSelectedPlayer(null);
        // random initial angular velocity (deg per frame @ ~60fps)
        velocityRef.current = (Math.random() * 12 + 18); // ~18–30
        rafRef.current = requestAnimationFrame(step);
    };

    const stopSpin = () => {
        if (!isSpinning) return;
        // Soften velocity so it decelerates quickly but still feels natural
        if (velocityRef.current > 2) velocityRef.current = 2;
    };

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const resetGame = () => {
        setGameState('playing');
        setSelectedPlayer(null);
        setMode(null);
        setPrompt('');
        setWheelAngle(0);
    };

    const newGame = () => {
        setGameState('setup');
        setSelectedPlayer(null);
        setMode(null);
        setPrompt('');
        setWheelAngle(0);
    };

    const renderWheel = () => {
        const radius = 125;
        const anglePerPlayer = 360 / playerCount;
        const players = Array.from({ length: playerCount }, (_, i) => i + 1);

        // Multi-color alternating palette (Spotify-inspired + accents)
        const baseColors = ['#FF2D55', '#1E90FF', '#FFD60A', '#7C4DFF', '#1DB954', '#FF8C00'];

        // Precompute color sequence guaranteeing adjacent difference (cycle)
        const sliceColors = players.map((_, i) => baseColors[i % baseColors.length]);

        const getColor = (i) => sliceColors[i];

        return (
            <View style={styles.wheelOuterShadow}>
                <View style={styles.wheelGlow} />
                <Animated.View
                    // rotation now driven by wheelAngle state (no Animated.timing)
                    style={[
                        styles.wheel,
                        { transform: [{ rotate: `${wheelAngle}deg` }] }
                    ]}
                >
                    <Svg width={radius * 2} height={radius * 2}>
                        <G originX={radius} originY={radius}>
                            {players.map((p, i) => {
                                const start = i * anglePerPlayer;
                                const end = start + anglePerPlayer;
                                const path = describeSector(radius, radius, radius, start, end);
                                const mid = start + anglePerPlayer / 2;
                                const labelPos = polarToCartesian(radius, radius, radius * 0.6, mid);
                                const fillColor = getColor(i);
                                return (
                                    <G key={p}>
                                        <Path d={path} fill={fillColor} stroke="#111" strokeWidth="0.8" />
                                        <SvgText
                                            x={labelPos.x}
                                            y={labelPos.y + 5}
                                            fontSize="16"
                                            fontWeight="700"
                                            fill={'#000000'}
                                            textAnchor="middle"
                                        >
                                            {p}
                                        </SvgText>
                                    </G>
                                );
                            })}
                        </G>
                    </Svg>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.08)', 'transparent', 'rgba(0,0,0,0.35)']}
                        style={styles.wheelSheen}
                    />
                </Animated.View>
                <View style={styles.arrow}>
                    <View style={styles.arrowBase} />
                    {/* arrowTip removed */}
                </View>
            </View>
        );
    };

    if (gameState === 'setup') {
        return (
            <LinearGradient colors={['#1DB954', '#191414']} style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.setupContainer}>
                        <Text style={styles.title}>{t('truth_and_dare.truth_and_dare')}</Text>
                        <Text style={styles.subtitle}>{t('truth_and_dare.TD_placeholder')}</Text>

                        {/* Player Count Selection */}
                        
                        <View style={styles.settingSection}>
                            <Text style={styles.settingTitle}>{t('truth_and_dare.Number_of_Players')}</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.playerScrollContainer}
                            >
                                {Array.from({ length: 14 }, (_, i) => i + 2).map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        style={[
                                            styles.playerOption,
                                            playerCount === num && styles.selectedPlayerOption,
                                        ]}
                                        onPress={() => setPlayerCount(num)}
                                    >
                                        <Text
                                            style={[
                                                styles.playerOptionText,
                                                playerCount === num && styles.selectedPlayerOptionText,
                                            ]}
                                        >
                                            {num}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Game Mode Selection */}
                        <View style={styles.settingSection}>
                            <Text style={styles.settingTitle}>{t('truth_and_dare.Game_Settings')}</Text>
                            <View style={styles.modeContainer}>
                                <TouchableOpacity
                                    style={[
                                        styles.modeOption,
                                        gameMode === 'casual' && styles.selectedModeOption,
                                    ]}
                                    onPress={() => setGameMode('casual')}
                                >
                                    <Text
                                        style={[
                                            styles.modeOptionText,
                                            gameMode === 'casual' && styles.selectedModeOptionText,
                                        ]}
                                    >
                                        {t('truth_and_dare.Casual')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.modeOption,
                                        gameMode === 'sexual' && styles.selectedModeOption,
                                    ]}
                                    onPress={() => setGameMode('sexual')}
                                >
                                    <Text
                                        style={[
                                            styles.modeOptionText,
                                            gameMode === 'sexual' && styles.selectedModeOptionText,
                                        ]}
                                    >
                                        {t('truth_and_dare.Sexual')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.startButton}
                            onPress={() => setGameState('playing')}
                        >
                            <Text style={styles.startButtonText}>{t('truth_and_dare.Start_Game')}</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    if (gameState === 'playing') {
        return (
            <LinearGradient colors={['#0d0d0d', '#121212', '#191414']} style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.playingContainer}>
                        <Text style={styles.gameTitle}>{t('truth_and_dare.Roulette')}</Text>
                        <View style={styles.panel}>
                          {renderWheel()}
                          <Animated.Text
                            style={[
                              styles.selectedPlayerText,
                              { transform: [{ scale: pulse }] },
                            ]}
                          >
                            {selectedPlayer ? `${t('truth_and_dare.Player_')}${selectedPlayer} ${t("truth_and_dare.Player_1")}` : t('truth_and_dare.Spin')}
                          </Animated.Text>
                          <View style={styles.controlArea}>
                            {!selectedPlayer ? (
                              <TouchableOpacity
                                style={[styles.actionButton, isSpinning && styles.actionButtonStop]}
                                onPress={isSpinning ? stopSpin : spinWheel}
                                activeOpacity={0.85}
                              >
                                <Text style={styles.actionButtonText}>
                                  {isSpinning ? `${t('truth_and_dare.Stop')}` : `${t('truth_and_dare.Spin')}`}
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <View style={styles.choiceContainer}>
                                <TouchableOpacity
                                  style={[styles.choiceButton, styles.truthButton]}
                                  onPress={() => handleChoice('truth')}
                                  activeOpacity={0.85}
                                >
                                  <Text style={styles.choiceButtonText}>{t('truth_and_dare.Truth')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={[styles.choiceButton, styles.dareButton]}
                                  onPress={() => handleChoice('dare')}
                                  activeOpacity={0.85}
                                >
                                  <Text style={styles.choiceButtonText}>{t('truth_and_dare.Dare')}</Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        );
    }

    // Result screen
    return (
        <LinearGradient colors={['#0d0d0d', '#121212', '#191414']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.resultContainer}>
                    <View style={styles.resultPanel}>
                        <Text style={styles.resultTitle}>{t("truth_and_dare.Player_")} {selectedPlayer}</Text>
                        <View style={styles.promptContainer}>
                            <Text style={styles.resultModeLabel}>{mode === 'truth' ? t("truth_and_dare.Truth") : t("truth_and_dare.Dare")}</Text>
                            <Text style={styles.prompt}>{prompt}</Text>
                        </View>
                        <TouchableOpacity style={styles.nextButton} onPress={resetGame} activeOpacity={0.85}>
                            <Text style={styles.nextButtonText}>{t("truth_and_dare.Next_Round")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.newGameButton} onPress={newGame} activeOpacity={0.85}>
                            <Text style={styles.newGameButtonText}>{t("truth_and_dare.New_game")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
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
    setupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#B3B3B3',
        marginBottom: 50,
        textAlign: 'center',
    },
    settingSection: {
        width: '100%',
        marginBottom: 40,
    },
    settingTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    playerScrollContainer: {
        paddingHorizontal: 20,
    },
    playerOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedPlayerOption: {
        backgroundColor: '#1DB954',
        borderColor: '#FFFFFF',
    },
    playerOptionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#B3B3B3',
    },
    selectedPlayerOptionText: {
        color: '#FFFFFF',
    },
    modeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modeOption: {
        paddingVertical: 15,
        paddingHorizontal: 40,
        backgroundColor: '#333333',
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedModeOption: {
        backgroundColor: '#1DB954',
        borderColor: '#FFFFFF',
    },
    modeOptionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#B3B3B3',
    },
    selectedModeOptionText: {
        color: '#FFFFFF',
    },
    startButton: {
        backgroundColor: '#1DB954',
        paddingVertical: 18,
        paddingHorizontal: 60,
        borderRadius: 30,
        marginTop: 30,
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    playingContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#FFFFFF',
    marginBottom: 18,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(32,32,32,0.7)',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    alignItems: 'center',
    backdropFilter: Platform.OS === 'web' ? 'blur(22px)' : undefined,
  },
  wheelOuterShadow: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheel: {
    width: 260,
    height: 260,
    borderRadius: 130,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#1DB954',
    backgroundColor: '#000',
    shadowColor: '#1DB954',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  wheelSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wheelGlow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(5, 21, 11, 0.08)',
    top: -20,
  },
  arrow: {
    right: -5.5,
    top: '50%',
    transform: [{ translateY: -12 }],
    alignItems: 'center',
    position: 'absolute',
    zIndex: 20,
  },
  arrowBase: {
    width: 10,
    height: 38,
    borderRadius: 4,
    backgroundColor: '#1DB954',
    shadowColor: '#1DB954',
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  selectedPlayerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1ed760',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  controlArea: {
    marginTop: 4,
    width: '100%',
    minHeight: 120,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 18,
    paddingHorizontal: 70,
    borderRadius: 40,
    shadowColor: '#1DB954',
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonStop: {
    backgroundColor: '#FF2D55',
    shadowColor: '#FF2D55',
  },
  actionButtonText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  truthButton: {
    backgroundColor: '#FF2D55',
  },
  dareButton: {
    backgroundColor: '#1E90FF',
  },
  choiceButtonText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  resultPanel: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: 'rgba(32,32,32,0.72)',
    borderRadius: 30,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
  },
  resultTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1DB954',
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 22,
  },
  resultModeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1DB954',
    marginBottom: 14,
    letterSpacing: 3,
  },
  promptContainer: {
    backgroundColor: 'rgba(55,55,55,0.55)',
    padding: 26,
    borderRadius: 20,
    marginBottom: 34,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  prompt: {
    fontSize: 20,
    color: '#FFFFFF',
    lineHeight: 30,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 18,
    borderRadius: 26,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#1DB954',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  newGameButton: {
    backgroundColor: '#262626',
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  newGameButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#CCCCCC',
    letterSpacing: 1,
  },
});