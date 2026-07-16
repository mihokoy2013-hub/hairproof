import { useState, useRef } from "react";

// ===== テーマカラー定義 =====
const THEMES = {
  woman: {
    deep: "#c9637a", mid: "#e8839a", light: "#f5b8c8",
    pale: "#fde8ef", palest: "#fff5f8", rose: "#f9dde5",
    text: "#5a2d3a", subtext: "#9a6070",
    bg: "linear-gradient(160deg, #fff5f8 0%, #f9dde5 50%, #ffe0ea 100%)",
    icon: "👩", label: "女性（大人）", sublabel: "20代以上",
  },
  man: {
    deep: "#3a5a8a", mid: "#5a7aaa", light: "#a0b8d8",
    pale: "#e8f0f8", palest: "#f2f6fc", rose: "#dce8f4",
    text: "#1a2a4a", subtext: "#4a6080",
    bg: "linear-gradient(160deg, #f2f6fc 0%, #dce8f4 50%, #c8daf0 100%)",
    icon: "👨", label: "男性（大人）", sublabel: "20代以上",
  },
  girl: {
    deep: "#8a5aaa", mid: "#aa7acc", light: "#d0a8e8",
    pale: "#f4e8fc", palest: "#faf2ff", rose: "#eeddf8",
    text: "#3a1a5a", subtext: "#7a5090",
    bg: "linear-gradient(160deg, #faf2ff 0%, #eeddf8 50%, #e0c8f8 100%)",
    icon: "👧", label: "女の子", sublabel: "小学生〜高校生",
  },
  boy: {
    deep: "#2a7a5a", mid: "#4a9a7a", light: "#8ac8a8",
    pale: "#e0f4ec", palest: "#f0faf4", rose: "#c8ecda",
    text: "#0a3a2a", subtext: "#3a7060",
    bg: "linear-gradient(160deg, #f0faf4 0%, #c8ecda 50%, #a8e0c0 100%)",
    icon: "👦", label: "男の子", sublabel: "小学生〜高校生",
  },
};

// ===== 年代選択肢 =====
const AGE_OPTIONS = {
  woman: ["20代", "30代", "40代", "50代", "60代〜"],
  man:   ["20代", "30代", "40代", "50代", "60代〜"],
  girl:  ["小学生（低学年）", "小学生（高学年）", "中学生", "高校生"],
  boy:   ["小学生（低学年）", "小学生（高学年）", "中学生", "高校生"],
};

const faceTypes = ["丸顔", "卵型", "面長", "四角顔", "ベース型"];
const hairVolumes = ["少なめ", "普通", "多め"];
const hairTextures = ["直毛", "柔らかい髪", "硬い毛", "くせ毛"];
const hairLengths = ["ショート", "ボブ", "ミディアム", "ロング"];
const hairLengthsBoy = ["ショート", "ミディアム"];
const lifestyles = ["結べる長さ必須（仕事・部活）", "下ろしたまま多い", "どちらも使う"];
const pcColors = ["診断未受診", "スプリング", "サマー", "オータム", "ウィンター"];
const jobTypes = ["医療職", "介護職", "保育士・幼稚園教諭", "事務・オフィスワーク", "接客・販売", "飲食・厨房", "工場・製造業", "建設・土木", "その他"];
const concernOptions = {
  woman: ["老け見え回避", "小顔効果", "フェイスラインカバー", "トップのボリューム不足", "まとめやすさ重視", "扱いやすさ重視", "職場NG色を避けたい"],
  man:   ["清潔感を出したい", "若く見せたい", "ビジネス向け", "爽やかな印象に", "扱いやすさ重視", "職場NG色を避けたい"],
  girl:  ["可愛らしくしたい", "おしゃれに見せたい", "まとめやすさ重視", "学校規則に合わせたい", "スポーツ・運動に対応"],
  boy:   ["清潔感を出したい", "かっこよくしたい", "爽やかな印象に", "学校規則に合わせたい", "スポーツ・運動に対応"],
};

const initialForm = { age: "", faceType: "", hairLength: "", hairVolume: "", hairTexture: "", lifestyle: "", pcColor: "", jobType: "", concerns: [], memo: "" };

// ===== スタイルデータ =====
const STYLES_WOMAN = [
  { title: "ふんわりレイヤーミディ", lengths: ["ミディアム"], points: ["顔まわりのレイヤーで小顔効果◎", "ひし形シルエットで若見え", "まとめ髪にも対応"], desc: "顔まわりのレイヤーで若見え効果大。", good: true, tags: ["まとめ可","小顔","若見え"] },
  { title: "くびれミディアム", lengths: ["ミディアム"], points: ["くびれで小顔効果抜群", "上品で女性らしい印象", "仕事でもまとめやすい"], desc: "くびれシルエットで小顔効果◎。", good: true, tags: ["まとめ可","小顔","上品"] },
  { title: "2WAY前髪×ひし形レイヤー", lengths: ["ミディアム"], points: ["下ろすと若々しく柔らかい", "分ければ仕事中も快適", "最も汎用性が高い"], desc: "下ろせば若々しく、分ければ仕事中も快適。", good: true, tags: ["まとめ可","若見え","小顔"] },
  { title: "センター分けロング", lengths: ["ロング"], points: ["大人っぽく落ち着いた印象", "ツヤ感が際立つ", "上品なオーラ"], desc: "大人っぽく落ち着いた印象のロングスタイル。", good: true, tags: ["おろし向け","上品","ロング"] },
  { title: "ゆるふわアップスタイル", lengths: ["ミディアム","ロング"], points: ["まとめ髪でも柔らかさを演出", "後れ毛で若々しく", "仕事でも華やか"], desc: "まとめ髪でも柔らかさを演出。", good: true, tags: ["まとめ","上品","若見え"] },
  { title: "ショートボブ", lengths: ["ボブ"], points: ["すっきり上品な印象", "首元がきれいに見える", "扱いやすさ◎"], desc: "すっきり見えて上品なスタイル。", good: true, tags: ["すっきり","上品","ボブ"] },
  { title: "ナチュラルストレートロング", lengths: ["ロング"], points: ["清潔感があり落ち着いた印象", "オフィスにもおすすめ", "ツヤが映える"], desc: "清潔感があり落ち着いた印象。", good: true, tags: ["おろし向け","清潔感","ロング"] },
  { title: "外ハネミディアム", lengths: ["ミディアム"], points: ["軽やかでカジュアル", "動きが出て活発な印象", "若々しいスタイル"], desc: "軽やかでカジュアルな印象。", good: true, tags: ["カジュアル"] },
  { title: "前髪ありショート", lengths: ["ショート"], points: ["若々しく可愛らしい", "前髪で印象チェンジ", "顔まわりを明るく"], desc: "若々しく可愛らしい印象。", good: true, tags: ["若見え","ショート"] },
  { title: "ベリーショート", lengths: ["ショート"], points: ["クールで洗練された印象", "個性が際立つ", "すっきり小顔効果"], desc: "クールで洗練された印象。", good: true, tags: ["クール","ショート"] },
  { title: "丸みショートボブ", lengths: ["ショート","ボブ"], points: ["小顔に見える丸みシルエット", "柔らかく女性らしい", "扱いやすくラク"], desc: "丸みのあるシルエットで女性らしい印象に。", good: true, tags: ["小顔","若見え","ショート","ボブ"] },
  { title: "くびれボブ", lengths: ["ボブ"], points: ["小顔効果が高い", "トレンド感がある", "首元をきれいに見せる"], desc: "くびれラインで小顔効果抜群のトレンドボブ。", good: true, tags: ["小顔","ボブ","上品"] },
  { title: "ウェーブロング", lengths: ["ロング"], points: ["華やかで女性らしい", "特別な日にもおすすめ", "ロマンティックな印象"], desc: "華やかで女性らしいウェーブスタイル。", good: true, tags: ["華やか","ロング"] },
  { title: "タイトまとめ髪", lengths: ["ミディアム","ロング"], points: ["きちんと感が出る", "仕事向けの清潔感", "どんな服装にも合う"], desc: "きちんと感が出る仕事向けスタイル。", good: true, tags: ["きちんと"] },
];

const STYLES_MAN = [
  { title: "ビジネスショート", lengths: ["ショート"], points: ["清潔感があり信頼感◎", "オフィスに最適", "扱いやすい"], desc: "清潔感があり好印象なビジネス向けショート。", good: true, tags: ["清潔感","ショート","ビジネス"] },
  { title: "ナチュラルパーマショート", lengths: ["ショート"], points: ["こなれ感があっておしゃれ", "動きが出て男らしい", "トレンド感あり"], desc: "自然なパーマでこなれ感を演出。", good: true, tags: ["おしゃれ","ショート"] },
  { title: "センターパートミディアム", lengths: ["ミディアム"], points: ["爽やかで好印象", "大人っぽい雰囲気", "顔まわりすっきり"], desc: "センター分けで爽やかな大人の印象に。", good: true, tags: ["爽やか","ミディアム"] },
  { title: "ツーブロックショート", lengths: ["ショート"], points: ["スタイリッシュな印象", "サイドすっきり", "スポーティーにもなれる"], desc: "スタイリッシュなツーブロックスタイル。", good: true, tags: ["スタイリッシュ","ショート"] },
  { title: "マッシュショート", lengths: ["ショート"], points: ["柔らかく若々しい印象", "トレンド感満点", "丸顔カバーに◎"], desc: "マッシュラインで柔らかく若々しい印象に。", good: true, tags: ["若見え","ショート"] },
  { title: "ソフトモヒカン", lengths: ["ショート"], points: ["個性的でかっこいい", "立体感が出る", "スポーツにも対応"], desc: "ソフトモヒカンで個性的な印象に。", good: true, tags: ["個性的","ショート"] },
  { title: "ナチュラルミディアム", lengths: ["ミディアム"], points: ["自然体でおしゃれ", "カジュアルに最適", "扱いやすい"], desc: "ナチュラルなミディアムスタイル。", good: true, tags: ["カジュアル","ミディアム"] },
  { title: "オールバック", lengths: ["ショート","ミディアム"], points: ["知的でクールな印象", "フォーマルにも対応", "大人の色気"], desc: "オールバックで知的クールな印象に。", good: true, tags: ["クール","ビジネス"] },
];

const STYLES_GIRL = [
  { title: "ふわふわツインテール", lengths: ["ミディアム","ロング"], points: ["可愛らしく華やか", "学校でも人気", "アレンジしやすい"], desc: "ふわふわツインテールで可愛らしく。", good: true, tags: ["可愛い","まとめ"] },
  { title: "ナチュラルロング", lengths: ["ロング"], points: ["清潔感があって好印象", "学校規則に合わせやすい", "女の子らしい"], desc: "ナチュラルなロングで清潔感を演出。", good: true, tags: ["清潔感","ロング"] },
  { title: "ポニーテール", lengths: ["ミディアム","ロング"], points: ["スポーツに最適", "明るく活発な印象", "アレンジ簡単"], desc: "ポニーテールで明るく活発な印象に。", good: true, tags: ["まとめ","スポーツ"] },
  { title: "ショートボブ", lengths: ["ショート","ボブ"], points: ["扱いやすく元気な印象", "顔まわりすっきり", "ヘアケアが楽"], desc: "ショートボブで元気な印象に。", good: true, tags: ["ショート","ボブ"] },
  { title: "ウェーブミディアム", lengths: ["ミディアム"], points: ["おしゃれで女の子らしい", "表情が明るく見える", "トレンド感あり"], desc: "ウェーブで女の子らしいおしゃれ感に。", good: true, tags: ["おしゃれ","ミディアム"] },
  { title: "ハーフアップ", lengths: ["ミディアム","ロング"], points: ["可愛くて学校でもOK", "顔まわりすっきり", "アレンジしやすい"], desc: "ハーフアップで可愛らしい印象に。", good: true, tags: ["可愛い","まとめ"] },
  { title: "三つ編みアレンジ", lengths: ["ミディアム","ロング"], points: ["個性的でおしゃれ", "運動会・イベントに◎", "崩れにくい"], desc: "三つ編みで個性的なおしゃれスタイルに。", good: true, tags: ["おしゃれ","まとめ"] },
  { title: "前髪パッツン", lengths: ["ショート","ボブ","ミディアム"], points: ["可愛くて個性的", "トレンド感がある", "顔まわりを明るく"], desc: "パッツン前髪で可愛く個性的な印象に。", good: true, tags: ["可愛い","個性的"] },
];

const STYLES_BOY = [
  { title: "ナチュラルショート", lengths: ["ショート"], points: ["清潔感があって好印象", "学校規則に合わせやすい", "扱いやすい"], desc: "ナチュラルなショートで清潔感を演出。", good: true, tags: ["清潔感","ショート"] },
  { title: "マッシュショート", lengths: ["ショート"], points: ["可愛くかっこいい", "トレンド感あり", "丸顔に似合う"], desc: "マッシュで可愛くかっこいい印象に。", good: true, tags: ["かっこいい","ショート"] },
  { title: "ツーブロックショート", lengths: ["ショート"], points: ["スタイリッシュでかっこいい", "スポーティーな印象", "サイドすっきり"], desc: "ツーブロックでスタイリッシュな印象に。", good: true, tags: ["かっこいい","ショート","スポーツ"] },
  { title: "センターパート", lengths: ["ショート","ミディアム"], points: ["おしゃれで爽やか", "大人っぽい印象", "顔まわりすっきり"], desc: "センターパートで爽やかでおしゃれな印象に。", good: true, tags: ["おしゃれ","爽やか"] },
  { title: "ソフトモヒカン", lengths: ["ショート"], points: ["個性的でかっこいい", "活発な印象", "スポーツに最適"], desc: "ソフトモヒカンで個性的でかっこいい印象に。", good: true, tags: ["かっこいい","個性的","スポーツ"] },
  { title: "くせ毛活かしナチュラル", lengths: ["ショート","ミディアム"], points: ["個性を活かしたスタイル", "こなれ感がある", "扱いやすい"], desc: "くせ毛を活かした自然なスタイル。", good: true, tags: ["個性的","ナチュラル"] },
  { title: "スポーツショート", lengths: ["ショート"], points: ["動きやすく快適", "清潔感があって好印象", "学校でも違和感なし"], desc: "スポーツショートで動きやすく清潔感のある印象に。", good: true, tags: ["スポーツ","清潔感","ショート"] },
  { title: "ミディアムナチュラル", lengths: ["ミディアム"], points: ["やわらかい印象", "おしゃれに見える", "アレンジしやすい"], desc: "ミディアムで柔らかくおしゃれな印象に。", good: true, tags: ["おしゃれ","ミディアム"] },
];

// ===== 診断ロジック =====
function diagnose(form, mode) {
  const { faceType, hairVolume, hairTexture, hairLength, lifestyle, pcColor, concerns, age } = form;
  const multiFace = faceType === "丸顔" || faceType === "ベース型";
  const longFace = faceType === "面長";
  const heavyHair = hairVolume === "多め";
  const softHair = hairTexture === "柔らかい髪";
  const hardHair = hairTexture === "硬い毛";
  const wavyHair = hairTexture === "くせ毛";
  const wantsSlim = concerns.includes("小顔効果") || concerns.includes("フェイスラインカバー");
  const wantsYoung = concerns.includes("老け見え回避") || concerns.includes("若く見せたい");
  const wantsCool = concerns.includes("かっこよくしたい") || concerns.includes("清潔感を出したい");
  const wantsCute = concerns.includes("可愛らしくしたい");
  const wantsSports = concerns.includes("スポーツ・運動に対応");
  const wantsSchool = concerns.includes("学校規則に合わせたい");
  const needsTie = lifestyle === "結べる長さ必須（仕事・部活）";

  const styleMap = { woman: STYLES_WOMAN, man: STYLES_MAN, girl: STYLES_GIRL, boy: STYLES_BOY };
  const allStyles = styleMap[mode] || STYLES_WOMAN;

  const scored = allStyles.map(s => {
    let score = 2;
    if (hairLength && s.lengths.includes(hairLength)) score += 5;
    if (hairLength && !s.lengths.includes(hairLength)) score -= 4;
    if (multiFace && s.tags.includes("小顔")) score += 2;
    if (wantsYoung && s.tags.includes("若見え")) score += 2;
    if (wantsSlim && s.tags.includes("小顔")) score += 2;
    if (wantsCool && s.tags.includes("かっこいい")) score += 2;
    if (wantsCool && s.tags.includes("清潔感")) score += 2;
    if (wantsCute && s.tags.includes("可愛い")) score += 2;
    if (wantsSports && s.tags.includes("スポーツ")) score += 2;
    if (wantsSchool && s.tags.includes("清潔感")) score += 1;
    if (needsTie && s.tags.includes("まとめ")) score += 2;
    if (needsTie && s.tags.includes("まとめ可")) score += 1;
    if (heavyHair && s.tags.includes("ロング") && !s.tags.includes("まとめ可")) score -= 2;
    if (hardHair && s.title.includes("外ハネ")) score -= 2;
    if (wavyHair && s.title.includes("ストレート")) score -= 1;
    return { ...s, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top3 = scored.slice(0, 3);

  const colorMap = {
    "スプリング": { name: "アプリコットブラウン", reason: "黄みベースで肌のツヤを引き出す明るいブラウン" },
    "サマー": { name: "アッシュブラウン（7〜8トーン）", reason: "赤みを抑えたくすみブラウンがブルベ夏の肌を美しく見せる" },
    "オータム": { name: "チョコレートブラウン", reason: "深みのあるウォームブラウンがイエベ秋の肌に溶け込む" },
    "ウィンター": { name: "ブルーブラック〜グレージュ", reason: "透明感のあるクールカラーがブルベ冬の肌を引き立てる" },
    "診断未受診": { name: mode === "man" || mode === "boy" ? "ナチュラルブラウン" : "アッシュブラウン（7トーン）", reason: "どの肌色にも馴染みやすい万能カラー" },
  };
  const color = colorMap[pcColor] || colorMap["診断未受診"];

  const avoidList = [];
  if (heavyHair) avoidList.push("重めワンレングスロング（広がりやすい）");
  if (hardHair) avoidList.push("細かいパーマ・外ハネ（寝癖感が出やすい）");
  if (multiFace) avoidList.push("ぺたんこワンレングス（顔の丸みが強調される）");
  if (longFace) avoidList.push("センター分けぺたんこストレート（顔が長く見える）");
  while (avoidList.length < 3) avoidList.push("極端に重いスタイル（扱いにくくなりやすい）");

  const modeLabel = { woman: "女性", man: "男性", girl: "女の子", boy: "男の子" };
  const summary = `${faceType}の顔型の${modeLabel[mode]}に${multiFace ? "ひし形シルエットが効果的です。" : "バランス良くさまざまなスタイルが似合います。"}${hairLength ? `${hairLength}ヘアでの` : ""}おすすめスタイルをご提案します。`;

  const orderParts = [];
  if (needsTie) orderParts.push("まとめられる長さを残してほしい");
  if (mode === "woman" || mode === "girl") orderParts.push("顔まわりにレイヤーを入れてフェイスラインをカバーしたい");
  if (wantsYoung) orderParts.push("若々しく柔らかい雰囲気にしたい");
  if (heavyHair) orderParts.push("髪が多めなので、すくか重さを取ってほしい");
  if (wantsSports) orderParts.push("スポーツ中も邪魔にならないスタイルにしたい");
  if (wantsSchool) orderParts.push("学校規則の範囲内でおしゃれにしたい");
  orderParts.push("トップにボリュームが出るよう切ってほしい");

  return { summary, top3, avoid: avoidList.slice(0, 3), color, orderText: orderParts.join("。\n") + "。" };
}

// ===== ChatGPTプロンプト生成 =====
function buildPrompt(form, mode, top3, color) {
  const modeLabel = { woman: "日本人女性", man: "日本人男性", girl: "日本人の女の子", boy: "日本人の男の子" };
  const ageLabel = form.age || (mode === "girl" || mode === "boy" ? "小学生〜中学生" : "30〜40代");
  const textureDesc = { "直毛": "直毛", "柔らかい髪": "柔らかい細め", "硬い毛": "硬くしっかりした", "くせ毛": "くせ毛" };
  return `以下の条件でヘアスタイル画像を3パターン作成してください。

【モデル設定】
・${ageLabel}の${modeLabel[mode]}
・顔型：${form.faceType || "卵型"}
・髪質：${textureDesc[form.hairTexture] || "普通の"}髪
・髪量：${form.hairVolume || "普通"}

【スタイル1】${top3[0]?.title || ""}
【スタイル2】${top3[1]?.title || ""}
【スタイル3】${top3[2]?.title || ""}

【撮影条件】
・各スタイルを正面・サイド・バックの3アングルで
・同一人物・同一背景（白）で統一
・自然な表情、清潔感のある印象
・ヘアカラーは${color?.name || "ナチュラルブラウン"}

【画像構成】
・3スタイルを横並びで1枚にまとめてください
・各スタイルのタイトルを画像内に表示してください`;
}

// ===== UI Components =====
function Btn({ children, onClick, disabled, outline, T }) {
  const t = T || THEMES.woman;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", padding: "13px 0",
      background: outline ? "transparent" : disabled ? t.pale : `linear-gradient(135deg, ${t.deep}, ${t.mid})`,
      border: outline ? `1.5px solid ${t.mid}` : "none",
      borderRadius: 30, color: outline ? t.deep : disabled ? t.light : "#fff",
      fontSize: 14, fontFamily: "sans-serif", cursor: disabled ? "default" : "pointer",
      boxShadow: outline || disabled ? "none" : `0 4px 14px ${t.deep}44`,
      transition: "all 0.2s",
    }}>{children}</button>
  );
}

function SelectGrid({ options, value, onChange, T }) {
  const t = T || THEMES.woman;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          padding: "8px 14px", borderRadius: 20,
          border: value === opt ? `1.5px solid ${t.deep}` : `1.5px solid ${t.light}`,
          background: value === opt ? t.deep : t.palest,
          color: value === opt ? "#fff" : t.subtext,
          fontSize: 13, fontFamily: "sans-serif", cursor: "pointer", transition: "all 0.15s",
        }}>{opt}</button>
      ))}
    </div>
  );
}

function CheckGrid({ options, values, onChange, T }) {
  const t = T || THEMES.woman;
  const toggle = opt => onChange(values.includes(opt) ? values.filter(v => v !== opt) : [...values, opt]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map(opt => (
        <button key={opt} onClick={() => toggle(opt)} style={{
          padding: "7px 12px", borderRadius: 20,
          border: values.includes(opt) ? `1.5px solid ${t.deep}` : `1.5px solid ${t.light}`,
          background: values.includes(opt) ? t.pale : t.palest,
          color: values.includes(opt) ? t.deep : t.subtext,
          fontSize: 12, fontFamily: "sans-serif", cursor: "pointer",
        }}>{opt}</button>
      ))}
    </div>
  );
}

function TLabel({ children, T }) {
  const t = T || THEMES.woman;
  return (
    <div style={{ fontSize: 12, color: t.deep, marginBottom: 8, fontFamily: "sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 10 }}>♦</span>{children}
    </div>
  );
}

function HeartLine({ T }) {
  const t = T || THEMES.woman;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "8px 0" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${t.light})` }} />
      <span style={{ color: t.light, fontSize: 10 }}>✦</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${t.light})` }} />
    </div>
  );
}

function StyleCard({ rank, style, T }) {
  const t = T || THEMES.woman;
  const rankColors = [t.deep, t.mid, t.light];
  const medals = ["🥇","🥈","🥉"];
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${t.light}`, overflow: "hidden", boxShadow: `0 4px 16px ${t.deep}18`, display: "flex", flexDirection: "column" }}>
      <div style={{ background: `linear-gradient(135deg, ${t.pale}, ${t.rose})`, padding: "10px 10px", display: "flex", alignItems: "center", gap: 6, borderBottom: `1px solid ${t.light}` }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: rankColors[rank], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{rank + 1}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: t.text, fontFamily: "sans-serif", lineHeight: 1.3, wordBreak: "break-all" }}>{style.title}</div>
          <div style={{ fontSize: 9, color: t.subtext }}>{medals[rank]} とても似合う</div>
        </div>
      </div>
      <div style={{ padding: "8px 10px" }}>
        {style.points.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: 4, marginBottom: 3 }}>
            <span style={{ color: t.mid, fontSize: 9, marginTop: 2, flexShrink: 0 }}>♦</span>
            <span style={{ fontSize: 10, color: t.subtext, lineHeight: 1.4 }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ChatGPTで生成した「3スタイル横並び1枚」の画像を貼り付けるカード
function ComboImageCard({ image, onUpload, onRemove, T }) {
  const t = T || THEMES.woman;
  const inputRef = useRef(null);
  const handleFile = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onUpload(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: `1.5px solid ${t.light}`, overflow: "hidden", boxShadow: `0 4px 16px ${t.deep}18`, marginBottom: 16 }}>
      <div style={{ background: `linear-gradient(135deg, ${t.pale}, ${t.rose})`, padding: "10px 12px", borderBottom: `1px solid ${t.light}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.text, fontFamily: "sans-serif" }}>📸 ChatGPTで生成した画像を貼り付け</div>
        <div style={{ fontSize: 9, color: t.subtext, marginTop: 2 }}>3スタイルがまとまった画像を1枚だけアップロードしてください</div>
      </div>
      <div onClick={() => !image && inputRef.current.click()} style={{ width: "100%", minHeight: 160, background: image ? "transparent" : `linear-gradient(160deg, ${t.palest}, ${t.rose})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: image ? "default" : "pointer", position: "relative", overflow: "hidden" }}>
        {image ? (
          <>
            <img src={image} alt="3スタイルまとめ画像" style={{ width: "100%", height: "auto", display: "block" }} />
            <button onClick={e => { e.stopPropagation(); onRemove(); }} style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: `${t.deep}dd`, color: "#fff", border: "none", fontSize: 12, cursor: "pointer" }}>✕</button>
            <button onClick={e => { e.stopPropagation(); inputRef.current.click(); }} style={{ position: "absolute", bottom: 6, right: 6, background: `${t.deep}dd`, color: "#fff", border: "none", borderRadius: 8, fontSize: 10, padding: "3px 8px", cursor: "pointer" }}>変更</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 28, marginBottom: 6, opacity: 0.4 }}>📷</div>
            <div style={{ fontSize: 11, color: t.mid, textAlign: "center", lineHeight: 1.6 }}>タップして<br />画像を追加</div>
            <div style={{ position: "absolute", inset: 8, border: `1px dashed ${t.light}`, borderRadius: 8, pointerEvents: "none" }} />
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
    </div>
  );
}

function PromptBox({ form, mode, top3, color, T }) {
  const t = T || THEMES.woman;
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const prompt = buildPrompt(form, mode, top3, color);
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };
  return (
    <div style={{ background: `linear-gradient(135deg, ${t.palest}, ${t.pale})`, borderRadius: 14, padding: "14px", marginBottom: 18, border: `1.5px solid ${t.mid}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: t.deep, fontFamily: "sans-serif" }}>🤖 ChatGPT用プロンプト</div>
        <button onClick={() => setOpen(o => !o)} style={{ fontSize: 10, color: t.mid, background: "transparent", border: `1px solid ${t.light}`, borderRadius: 10, padding: "2px 8px", cursor: "pointer" }}>{open ? "閉じる" : "確認する"}</button>
      </div>
      <div style={{ fontSize: 11, color: t.subtext, lineHeight: 1.8, marginBottom: 10 }}>
        ① コピーボタンでプロンプトをコピー<br />
        ② ChatGPTに貼り付けて画像生成<br />
        ③ できた画像を各カードに追加！
      </div>
      {open && (
        <div style={{ background: "#fff", borderRadius: 8, padding: "10px", marginBottom: 10, border: `1px solid ${t.light}`, fontSize: 10, color: t.text, lineHeight: 1.9, whiteSpace: "pre-wrap", maxHeight: 180, overflowY: "auto" }}>
          {prompt}
        </div>
      )}
      <button onClick={handleCopy} style={{ width: "100%", padding: "11px 0", background: copied ? "#e8f5e8" : `linear-gradient(135deg, ${t.deep}, ${t.mid})`, border: "none", borderRadius: 22, color: copied ? "#4a8a4a" : "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.3s" }}>
        {copied ? "✅ コピーしました！" : "📋 プロンプトをコピー"}
      </button>
    </div>
  );
}

// ChatGPTの使い方案内
function ChatGPTGuide({ T }) {
  const t = T || THEMES.woman;
  const [section, setSection] = useState("howto");

  const sections = [
    { key: "howto", label: "使い方" },
    { key: "tips", label: "活用のコツ" },
    { key: "trouble", label: "困ったとき" },
  ];

  return (
    <div>
      {/* ダウンロード案内 */}
      <div style={{ background: `linear-gradient(135deg, ${t.deep}, ${t.mid})`, borderRadius: 14, padding: "16px", marginBottom: 14, color: "#fff" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>📱 ChatGPTと連携して使うアプリです</div>
        <div style={{ fontSize: 11, opacity: 0.92, lineHeight: 1.8, marginBottom: 12 }}>
          <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 4, padding: "1px 7px", fontWeight: 700 }}>無料版でOK！</span>　ChatGPTをダウンロードするだけで使えます。
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{icon:"📲",label:"App Store",sub:"iOS"},{icon:"📲",label:"Google Play",sub:"Android"},{icon:"💻",label:"Web版",sub:"chatgpt.com"}].map((item,i) => (
            <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.18)", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 16 }}>{item.icon}</div>
              <div style={{ fontSize: 9, fontWeight: 700, marginTop: 2 }}>{item.label}</div>
              <div style={{ fontSize: 8, opacity: 0.8 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* セクションタブ */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {sections.map(s => (
          <button key={s.key} onClick={() => setSection(s.key)} style={{ flex: 1, padding: "8px 0", borderRadius: 20, border: section === s.key ? `1.5px solid ${t.deep}` : `1px solid ${t.light}`, background: section === s.key ? t.deep : t.palest, color: section === s.key ? "#fff" : t.subtext, fontSize: 11, fontWeight: section === s.key ? 700 : 400, cursor: "pointer" }}>{s.label}</button>
        ))}
      </div>

      {/* 使い方 */}
      {section === "howto" && (
        <div style={{ background: t.palest, borderRadius: 12, padding: "14px", border: `1px solid ${t.rose}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.deep, marginBottom: 10 }}>🚀 基本の使い方</div>
          {[
            { step: "①", title: "このアプリで診断", desc: "顔型・髪質などを選んで診断ボタンを押すだけ！" },
            { step: "②", title: "プロンプトをコピー", desc: "診断結果画面の「プロンプトをコピー」ボタンをタップ。" },
            { step: "③", title: "ChatGPTを開く", desc: "ChatGPTアプリを開いてチャット画面にペーストして送信。" },
            { step: "④", title: "画像が生成される", desc: "しばらく待つと正面・サイド・バックの3スタイル画像が完成！" },
            { step: "⑤", title: "カードに追加", desc: "診断結果の各カードをタップして画像を追加。" },
            { step: "⑥", title: "美容院へ持参！", desc: "スクリーンショットを美容師さんに見せてオーダー完了！" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: t.deep, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{item.step}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: t.subtext, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 活用のコツ */}
      {section === "tips" && (
        <div style={{ background: t.palest, borderRadius: 12, padding: "14px", border: `1px solid ${t.rose}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.deep, marginBottom: 10 }}>💡 上手に使うコツ</div>
          {[
            { icon: "📸", title: "写真の選び方が大事", desc: "正面を向いた顔がはっきり写っている写真が一番きれいに仕上がります。横顔・斜め顔の写真は顔の向きがずれる場合があります。" },
            { icon: "🎂", title: "年代設定を少し上にする", desc: "子どもの少し前の写真を使う場合は、年代設定を1〜2段階上にすると実際の年齢に近い仕上がりになります。" },
            { icon: "💬", title: "メモ欄を活用する", desc: "「サッカーをしているから動きやすく」「学校で帽子をかぶることが多い」など具体的な条件を書くと、プロンプトの精度が上がります。" },
            { icon: "🔄", title: "何度でも試せる", desc: "ChatGPTは同じプロンプトでも毎回違う画像が生成されます。気に入らない場合はもう一度送信してみてください。" },
            { icon: "✂️", title: "美容師さんへの伝え方", desc: "画像を見せながら「この雰囲気で」と伝えると認識のズレが少なくなります。オーダー文もそのまま読み上げてOKです！" },
            { icon: "🔮", title: "将来の自分を先取り確認", desc: "年代設定を実年齢より上にすると「10年後・20年後の自分に似合うスタイル」を事前に確認できます。白髪が増えた頃のイメージを見たい場合は、プロンプトのメモ欄に「白髪混じり」と追記するとより現実的なシミュレーションができます。" },
            { icon: "✨", title: "年代別・もしもシミュレーション", desc: "20代設定にすると「若い頃にこのスタイルにしていたら？」、60代設定にすると「将来の自分に似合うスタイルは？」が確認できます。AIが年代に合わせて顔立ちを理想的に補正するため、完全な自分の顔の再現ではなく「なりたいイメージ」の参考として楽しむのがおすすめです！" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "12px", marginBottom: 8, border: `1px solid ${t.light}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.text, marginBottom: 4 }}>{item.icon} {item.title}</div>
              <div style={{ fontSize: 11, color: t.subtext, lineHeight: 1.7 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* 困ったとき */}
      {section === "trouble" && (
        <div style={{ background: t.palest, borderRadius: 12, padding: "14px", border: `1px solid ${t.rose}` }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.deep, marginBottom: 10 }}>🆘 こんなときは？</div>
          {[
            { q: "画像が生成されない", a: "ChatGPTの無料版は1日の利用制限があります。翌日また試してみてください。Web版（chatgpt.com）でも利用できます。" },
            { q: "顔が別人になった", a: "ChatGPTはあくまでAIによる近似画像です。顔の特徴を完全再現はできません。ヘアスタイルの参考として活用してください。" },
            { q: "子どもより大人っぽくなった", a: "年代設定を下げてみてください。または「幼い顔立ち」「小学生らしい顔」とメモ欄に追記すると効果的です。" },
            { q: "スタイルが思っていたものと違う", a: "ChatGPTに追加で「もっとショートに」「前髪をもう少し長く」などと指示を出すと調整できます。" },
            { q: "画像の保存方法がわからない", a: "生成された画像を長押し（スマホ）またはマウス右クリック（PC）で「画像を保存」を選ぶと保存できます。" },
          ].map((item, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, padding: "12px", marginBottom: 8, border: `1px solid ${t.light}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.deep, marginBottom: 4 }}>Q. {item.q}</div>
              <div style={{ fontSize: 11, color: t.subtext, lineHeight: 1.7 }}>A. {item.a}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Result({ form, mode, onReset }) {
  const T = THEMES[mode];
  const r = diagnose(form, mode);
  const [comboImage, setComboImage] = useState("");
  const [tab, setTab] = useState("main");

  return (
    <div>
      <div style={{ display: "flex", borderBottom: `2px solid ${T.pale}`, marginBottom: 20 }}>
        {[["main","✨ 診断結果"],["detail","📋 詳細"],["guide","📱 使い方"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ flex: 1, padding: "10px 0", border: "none", borderBottom: tab === key ? `2px solid ${T.deep}` : "2px solid transparent", background: "transparent", color: tab === key ? T.deep : T.light, fontSize: 11, fontWeight: tab === key ? 700 : 400, cursor: "pointer", marginBottom: -2 }}>{label}</button>
        ))}
      </div>

      {tab === "main" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: T.mid, marginBottom: 4 }}>HAIRPROOF</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.text, fontFamily: "serif", marginBottom: 6 }}>あなたに似合うヘアスタイル</div>
            <HeartLine T={T} />
            <div style={{ fontSize: 12, color: T.subtext, lineHeight: 1.8, marginTop: 8, background: T.palest, borderRadius: 10, padding: "10px 14px", border: `1px solid ${T.rose}` }}>{r.summary}</div>
          </div>
          <ComboImageCard image={comboImage} onUpload={setComboImage} onRemove={() => setComboImage("")} T={T} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
            {r.top3.map((style, i) => (
              <StyleCard key={i} rank={i} style={style} T={T} />
            ))}
          </div>
          <PromptBox form={form} mode={mode} top3={r.top3} color={r.color} T={T} />
          <div style={{ background: T.palest, borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: `1px solid ${T.rose}` }}>
            <TLabel T={T}>おすすめヘアカラー</TLabel>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.deep }}>{r.color.name}</div>
            <div style={{ fontSize: 11, color: T.subtext, marginTop: 2 }}>{r.color.reason}</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", marginBottom: 16, border: `1.5px solid ${T.mid}` }}>
            <TLabel T={T}>美容院オーダー文</TLabel>
            <div style={{ fontSize: 11, color: T.text, lineHeight: 1.9, background: T.palest, borderRadius: 8, padding: "10px 12px", whiteSpace: "pre-wrap" }}>{r.orderText}</div>
          </div>
        </div>
      )}

      {tab === "detail" && (
        <div>
          <div style={{ background: "#fff5f5", borderRadius: 12, padding: "12px 14px", marginBottom: 14, border: "1px solid #f0c0c8" }}>
            <TLabel T={T}>避けたほうがいいスタイル</TLabel>
            {r.avoid.map((a, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 5 }}><span style={{ color: "#c06070" }}>✕</span><span style={{ fontSize: 12, color: "#7a4050" }}>{a}</span></div>)}
          </div>
          <div style={{ marginBottom: 14 }}>
            <TLabel T={T}>診断トップ3</TLabel>
            {r.top3.map((s, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${T.light}`, borderRadius: 10, padding: "12px 14px", marginBottom: 8, display: "flex", gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: T.deep, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{s.title}</div>
                  <div style={{ fontSize: 11, color: T.subtext, marginTop: 2 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "guide" && <ChatGPTGuide T={T} />}

      <HeartLine T={T} />
      <div style={{ marginTop: 12 }}><Btn outline onClick={onReset} T={T}>もう一度診断する</Btn></div>
    </div>
  );
}

// ===== モード選択画面 =====
function ModeSelect({ onSelect }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fff5f8, #f9dde5, #ffe0ea)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px" }}>
      <style>{`* { box-sizing: border-box; } button { transition: all 0.2s; } button:hover { opacity: 0.88; transform: translateY(-2px); }`}</style>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", color: "#9a8a8a", marginBottom: 10 }}>✦ AI HAIR DIAGNOSIS ✦</div>
        <div style={{ fontSize: 30, fontWeight: 600, color: "#1a1a1a", fontFamily: "'Cormorant Garamond', serif" }}>
          Hair<span style={{ fontStyle: "italic" }}>Proof</span>
        </div>
        <div style={{ width: 40, height: 3, background: "linear-gradient(90deg, #c9637a, #3a5a8a)", borderRadius: 2, margin: "10px auto 0" }} />
        <div style={{ fontSize: 13, color: "#9a6070", marginTop: 14 }}>診断する対象を選んでください</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: "100%", maxWidth: 400 }}>
        {Object.entries(THEMES).map(([key, t]) => (
          <button key={key} onClick={() => onSelect(key)} style={{ background: `linear-gradient(135deg, ${t.pale}, ${t.rose})`, border: `2px solid ${t.light}`, borderRadius: 18, padding: "24px 16px", cursor: "pointer", textAlign: "center", boxShadow: `0 4px 16px ${t.deep}22` }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{t.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: 11, color: t.subtext, background: t.palest, borderRadius: 10, padding: "3px 8px", display: "inline-block" }}>{t.sublabel}</div>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 28, background: "rgba(255,255,255,0.8)", borderRadius: 14, padding: "14px 20px", maxWidth: 400, width: "100%", border: "1px solid #f5b8c8" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#c9637a", marginBottom: 6 }}>📱 ChatGPT無料版と連携して使います</div>
        <div style={{ fontSize: 11, color: "#9a6070", lineHeight: 1.8 }}>
          このアプリの診断結果をもとに、ChatGPTでヘアスタイル画像を生成できます。ChatGPTは<span style={{ color: "#c9637a", fontWeight: 700 }}>無料版でOK</span>です！
        </div>
      </div>
    </div>
  );
}

// ===== メインアプリ =====
export default function App() {
  const [mode, setMode] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [done, setDone] = useState(false);
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (!mode) return <ModeSelect onSelect={m => { setMode(m); setForm(initialForm); }} />;

  const T = THEMES[mode];
  const ageOpts = AGE_OPTIONS[mode];
  const lengthOpts = (mode === "boy") ? hairLengthsBoy : hairLengths;
  const concernOpts = concernOptions[mode] || concernOptions.woman;
  const showJob = mode === "woman" || mode === "man";
  const showPC = mode === "woman" || mode === "man";
  const ok0 = form.faceType && form.age;
  const ok1 = form.hairVolume && form.hairTexture && form.lifestyle && (showPC ? form.pcColor : true);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", justifyContent: "center", padding: "36px 16px", position: "relative", overflow: "hidden" }}>
      <style>{`* { box-sizing: border-box; } button { transition: all 0.2s; } button:hover:not(:disabled) { opacity: 0.88; } @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } } .fi { animation: fadeIn 0.4s ease forwards; }`}</style>
      <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }} className="fi">

        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <button onClick={() => { setMode(null); setDone(false); setStep(0); }} style={{ fontSize: 11, color: T.subtext, background: "transparent", border: `1px solid ${T.light}`, borderRadius: 12, padding: "4px 12px", cursor: "pointer", marginBottom: 12 }}>← モード選択に戻る</button>
          <div style={{ fontSize: 10, letterSpacing: "0.25em", color: T.mid, marginBottom: 4 }}>{T.icon} {T.label.toUpperCase()} MODE</div>
          <div style={{ fontSize: 22, fontWeight: 600, color: T.text, fontFamily: "'Cormorant Garamond', serif" }}>Hair<span style={{ fontStyle: "italic" }}>Proof</span></div>
          <div style={{ fontSize: 12, color: T.subtext, marginTop: 3 }}>あなたに似合うヘアスタイル診断</div>
          <HeartLine T={T} />
        </div>

        <div style={{ background: "rgba(255,255,255,0.88)", borderRadius: 20, padding: "24px 20px", boxShadow: `0 8px 40px ${T.deep}18`, border: `1px solid ${T.rose}`, backdropFilter: "blur(10px)" }}>
          {!done ? (
            <>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 22 }}>
                {["基本情報", "髪質・条件"].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", flex: i === 0 ? 1 : "none" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: i <= step ? T.deep : T.rose, color: i <= step ? "#fff" : T.light, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ marginLeft: 6, fontSize: 11, color: i <= step ? T.deep : T.light }}>{s}</span>
                    {i === 0 && <div style={{ flex: 1, height: 1, margin: "0 8px", background: step > 0 ? T.mid : T.rose }} />}
                  </div>
                ))}
              </div>

              {step === 0 && (
                <div className="fi">
                  <div style={{ marginBottom: 18 }}><TLabel T={T}>年代</TLabel><SelectGrid options={ageOpts} value={form.age} onChange={v => update("age", v)} T={T} /></div>
                  <div style={{ marginBottom: 18 }}><TLabel T={T}>顔型</TLabel><SelectGrid options={faceTypes} value={form.faceType} onChange={v => update("faceType", v)} T={T} /></div>
                  <div style={{ marginBottom: 18 }}><TLabel T={T}>希望の髪の長さ</TLabel><SelectGrid options={lengthOpts} value={form.hairLength} onChange={v => update("hairLength", v)} T={T} /></div>
                  {showJob && <div style={{ marginBottom: 18 }}><TLabel T={T}>職種（任意）</TLabel><SelectGrid options={jobTypes} value={form.jobType} onChange={v => update("jobType", v)} T={T} /></div>}
                  <div style={{ marginBottom: 8 }}>
                    <TLabel T={T}>メモ（任意）</TLabel>
                    <textarea value={form.memo} onChange={e => update("memo", e.target.value)} placeholder="なりたいイメージなど..." rows={2} style={{ width: "100%", padding: "10px 12px", border: `1.5px solid ${T.light}`, borderRadius: 10, fontSize: 13, resize: "none", outline: "none", background: T.palest, color: T.text, fontFamily: "sans-serif" }} />
                  </div>
                  <div style={{ marginTop: 14 }}><Btn onClick={() => setStep(1)} disabled={!ok0} T={T}>次へ →</Btn></div>
                </div>
              )}

              {step === 1 && (
                <div className="fi">
                  <div style={{ marginBottom: 18 }}><TLabel T={T}>髪量</TLabel><SelectGrid options={hairVolumes} value={form.hairVolume} onChange={v => update("hairVolume", v)} T={T} /></div>
                  <div style={{ marginBottom: 18 }}><TLabel T={T}>髪質</TLabel><SelectGrid options={hairTextures} value={form.hairTexture} onChange={v => update("hairTexture", v)} T={T} /></div>
                  <div style={{ marginBottom: 18 }}><TLabel T={T}>ライフスタイル</TLabel><SelectGrid options={lifestyles} value={form.lifestyle} onChange={v => update("lifestyle", v)} T={T} /></div>
                  {showPC && <div style={{ marginBottom: 18 }}><TLabel T={T}>パーソナルカラー</TLabel><SelectGrid options={pcColors} value={form.pcColor} onChange={v => update("pcColor", v)} T={T} /></div>}
                  <div style={{ marginBottom: 8 }}><TLabel T={T}>お悩み・希望（複数可）</TLabel><CheckGrid options={concernOpts} values={form.concerns} onChange={v => update("concerns", v)} T={T} /></div>
                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button onClick={() => setStep(0)} style={{ flex: 1, padding: "12px 0", background: "transparent", border: `1.5px solid ${T.light}`, borderRadius: 30, color: T.mid, fontSize: 13, cursor: "pointer" }}>← 戻る</button>
                    <button onClick={() => setDone(true)} disabled={!ok1} style={{ flex: 2, padding: "13px 0", background: ok1 ? `linear-gradient(135deg, ${T.deep}, ${T.mid})` : T.rose, border: "none", borderRadius: 30, color: ok1 ? "#fff" : T.light, fontSize: 14, cursor: ok1 ? "pointer" : "default", boxShadow: ok1 ? `0 4px 14px ${T.deep}44` : "none" }}>診断する ✨</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="fi">
              <Result form={form} mode={mode} onReset={() => { setDone(false); setStep(0); setForm(initialForm); }} />
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 14, fontSize: 10, color: T.mid }}>
          ✦ 本診断はAIロジックによる提案です。実際の施術は美容師にご相談ください ✦
        </div>
      </div>
    </div>
  );
}
