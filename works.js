/* =============================================================
   作品データ（ここを編集します）
   -------------------------------------------------------------
   title … タイトル。いまは絵を見て付けた仮の名前です
   tech  … 技法（例: 油彩）。空なら出ません
   size  … サイズ（例: F30）。空なら出ません
   steps … 描き進めた途中の画像。古い順に並べます

   画像を増やすときは tools/make-site-images.py の LIST に足して、
   そのスクリプトを実行してください。
   ============================================================= */

window.SITE = {
  form: "https://docs.google.com/forms/d/e/1FAIpQLScLKrOlOwVtysWmeEJaTwexQGllFhhjqt93CY9obmPW05zYfw/viewform",  // Google フォームの回答用 URL
  instagram: "",  // Instagram のユーザー名（@ は付けない）
};

window.CHAPTERS = [
  {
    year: "2026",
    wall: "sky",
    works: [
      { id: "giraffe", title: "くぼみに落ちるきりん", tech: "", size: "", steps: ["giraffe-1", "giraffe-2", "giraffe"] },
      { id: "tropical", title: "朱い実と青い鳥", tech: "", size: "", steps: ["tropical-1", "tropical-2", "tropical"] },
      { id: "fern", title: "しだと泡", tech: "", size: "" },
      { id: "lobster", title: "いせえび四様", tech: "", size: "" },
      { id: "river", title: "川", tech: "", size: "" },
      { id: "tray", title: "お昼のトレー", tech: "", size: "" },
    ],
  },
  {
    year: "2025",
    wall: "mustard",
    works: [
      { id: "apple", title: "かじったりんご", tech: "", size: "" },
      { id: "horse", title: "赤い馬", tech: "", size: "" },
      { id: "lamp", title: "紙のランプ", tech: "", size: "" },
      { id: "ski", title: "すべる人", tech: "", size: "" },
    ],
  },
  {
    year: "2024",
    wall: "vermilion",
    works: [
      { id: "koi", title: "鯉", tech: "", size: "" },
      { id: "penguin", title: "ペンギンの家族", tech: "", size: "", steps: ["penguin-1", "penguin-2", "penguin-3", "penguin"] },
      { id: "field", title: "手のある風景", tech: "", size: "" },
      { id: "two", title: "ふたり", tech: "", size: "" },
      { id: "basket", title: "かごとほおずき", tech: "", size: "" },
      { id: "bottles", title: "びんの列", tech: "", size: "" },
      { id: "brush", title: "筆を持つ人", tech: "", size: "" },
      { id: "curtain", title: "水玉のカーテン", tech: "", size: "" },
      { id: "shelf", title: "棚のガラス", tech: "", size: "" },
      { id: "cube", title: "白い立方体", tech: "", size: "" },
      { id: "sketch", title: "ふたりの素描", tech: "", size: "" },
      { id: "branch", title: "枯れ枝と柿", tech: "", size: "" },
    ],
  },
  {
    year: "2023",
    wall: "night",
    works: [
      { id: "lotus", title: "蓮", tech: "", size: "" },
      { id: "flowers", title: "咲く", tech: "", size: "" },
      { id: "bench", title: "赤いベンチ", tech: "", size: "" },
      { id: "butterfly", title: "蝶の群れ", tech: "", size: "" },
      { id: "rabbit", title: "うさぎ", tech: "", size: "" },
      { id: "star", title: "紙の星", tech: "", size: "" },
      { id: "chair", title: "折りたたみ椅子", tech: "", size: "" },
      { id: "tongs", title: "トング", tech: "", size: "" },
      { id: "bust", title: "胸像", tech: "", size: "" },
      { id: "paper", title: "紙と花", tech: "", size: "" },
      { id: "bird", title: "小鳥", tech: "", size: "" },
      { id: "animals", title: "動物たちと", tech: "", size: "" },
    ],
  },
];
