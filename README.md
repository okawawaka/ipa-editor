# IPA入力 国際音声字母エディタ / International Phonetic Alphabet Editor

[English](#english) | [日本語](#日本語)

---

<a name="english"></a>
## English

### Overview

- 🌐 **Web App**: [https://okawawaka.github.io/ipa-editor/](https://okawawaka.github.io/ipa-editor/)
- 📦 **GitHub Repository**: [https://github.com/okawawaka/ipa-editor](https://github.com/okawawaka/ipa-editor)

**IPA Keyboard & Editor** is a browser-based, Swiss-style application designed for inputting and learning the full International Phonetic Alphabet (IPA) on both desktop and mobile devices.

All linguistic and phonetic symbols can be viewed in a clear grid format, with seamless support for combining diacritics, suprasegmentals, and tone letters/ligatures that are difficult to type with standard keyboards. It is crafted to be intuitive for students, researchers, and field linguists alike.

---

### Acknowledgements

This application was heavily inspired by the IPA input tool created by **"Ekimeihyo Atsume."**:  
https://ekimeihyo.net/o/ipa.html

The overall structural layout and concept were deeply informed by their excellent tool. We would like to express our sincerest gratitude for their inspiring work.

---

### Key Features

#### 1. Full IPA Coverage (339 Symbols)
Includes pulmonic consonants, non-pulmonic consonants (clicks, implosives, ejectives), double articulation, complete 28-vowel trapezoid, diacritics, suprasegmentals, and Chao tone letters (55–11). Single tone letters combine automatically into continuous vector ligature contour bars (e.g., `˥˦`, `˩˥`).

#### 2. Articulatory Learning Support
Symbols are systematically organized by manner and place of articulation rather than simple listing. Hovering over or touching any symbol instantly displays its phonetic name, English description, and articulatory classification via real-time ticker and smart tooltip.

#### 3. Thoughtful Productivity Tools
- **Bilingual Interface (JA | EN)**: Instant language toggle in the header. Automatically detects user locale and defaults to English for non-Japanese environments.
- **One-Click COPY**: Fast copy to clipboard with toast notification, ready for LaTeX, Word, Praat, or text editors.
- **Full UNDO**: History stack supporting `UNDO` button and `Ctrl+Z` (`Cmd+Z`).
- **Sticky Header**: Input area and primary controls stay pinned to the top while scrolling through extensive tables.
- **Mobile Responsive**: Segmented tabs and smooth horizontal swiping on mobile devices (375px+).
- **Keyboard Shortcuts**: Open instructions modal with `?` or `Shift+/`, close with `Esc`.

---

### 📖 How to Use

1. **Insert Symbols**: Click any symbol button on the board to insert it at the text cursor position.
2. **Combine Diacritics**: Click a base letter first, then click diacritics to combine automatically.
3. **Copy & Paste**: Click `COPY` to copy to clipboard and paste directly into Word, LaTeX, Praat, or paper drafts.
4. **Inspect Names**: Hover or tap any symbol to see its articulatory place, manner, and phonetic name in the status bar.

---

### 🛠️ Developer Guide

Built with **Pure HTML / CSS / JavaScript (Vanilla JS)** with zero build steps or external dependencies.

#### Directory Structure

```text
ipa-editor/
├── index.html            # Main HTML (DOM structure, meta tags, OGP settings)
├── style.css             # Swiss-style CSS (grid system, responsive layout, sticky dock)
├── app.js                # Application logic (input handling, history, event delegation)
├── data.js               # Metadata dictionary for 339 IPA symbols (names, descriptions, categories)
├── i18n.js               # Multilingual translations (JA/EN UI text, table headers, category maps)
├── favicon.svg           # Vector favicon
├── favicon.png           # 32x32 PNG favicon
├── apple-touch-icon.png  # 180x180 Web clip icon
├── og-image.png          # 1200x630 Social preview image
├── README.md             # Project documentation (Bilingual)
├── CHECKLIST.md          # Verification checklist & feature specifications
├── LICENSE               # MIT License
└── .gitignore            # Git ignore rules
```

#### Running Locally

No build tools are required.
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```
Open `http://localhost:8000` in your browser.

#### Deploying
Optimized for GitHub Pages. Deploy directly from the `main` branch root (`/`).

---

<a name="日本語"></a>
## 日本語

### Webアプリの概要

- 🌐 **Webアプリ**: [https://okawawaka.github.io/ipa-editor/](https://okawawaka.github.io/ipa-editor/)
- 📦 **GitHubリポジトリ**: [https://github.com/okawawaka/ipa-editor](https://github.com/okawawaka/ipa-editor)

ブラウザ上で完結し、**国際音声字母（IPA: International Phonetic Alphabet）** の入力をPC・スマホ両方で行える「**IPA入力 国際音声字母エディタ**」を制作・公開しました。

言語学・音声学で使う記号を一覧でき、一般的なキーボード入力では難しい補助記号や声調の表記も行えるようにしています。
また、IPAを勉強中の学生でも使いやすいような機能を揃えています。

---

### 謝辞

このアプリを作る際、一番の参考になったのが **「駅名標あつめ。」** さんのIPA入力補助サイト（国際音声字母入力補助ツール）でした。  
https://ekimeihyo.net/o/ipa.html

サイトの構成・レイアウトを大いに参考にさせてもらい、自分の欲しかった機能をとことん詰め込んで作りました。  
「駅名標あつめ。」さんのおかげでこのWebアプリを作れたと言っても過言ではありません。心より感謝申し上げます。

---

### 主な機能と特徴

#### 1. IPAを網羅
肺臓気流子音・非肺臓気流子音（吸着音・入破音・放出音）・二重調音・母音台形（全28種）・補助記号・超分節要素・声調に至るまで、国際音声学会（IPA）規格の記号を網羅・分類してグリッド配置しています。
単体の声調記号（`˥`や`˩`）だけでなく声調合字（`˥˦` や `˩˥` など）の入力も可能であり、自然に合成・表示を行います。

#### 2. 勉強中でも使いやすい
勉強中の学生でも使いやすいように、ただ羅列するのではなく、調音法・調音位置も記載しています。また、マウスホバーによって、名称・調音分類を瞬時に確認できるよう、ティッカー表示機能を備えています。

#### 3. ちょっぴり便利な工夫
入力に便利な細かな機能・工夫を取り入れています。
- **日英バイリンガル対応（JA ｜ EN）**: ヘッダーの切り替えボタンから日本語と英語を瞬時に切り替え可能。ブラウザ言語が日本語以外なら自動的に英語で表示されます。
- ワンクリックでクリップボードに保存できる `COPY` 機能
- `CTRL + Z` でやり直せる `UNDO` 機能
- 画面をスクロールしても常に手元に残る固定ヘッダーで入力した文字が見える
- スマホ・タブレットでも使いやすいレスポンシブ設計
- `?` または `SHIFT + /` で呼び出せる操作ヘルプ

---

### 📖 使い方（エンドユーザー向け）

1. **文字の入力**:
   - 表内の字母ボタンをクリックすると、上部のテキストエリアに文字が挿入されます。
2. **補助記号の結合**:
   - 先に基底となる字母（母音や子音）を入力し、その直後に補助記号ボタンをクリックすると、自動的に結合文字として合成されます。
3. **コピー & 活用**:
   - `COPY` ボタンを押すだけでクリップボードにコピーされます。そのまま Word、LaTeX、Praat、論文エディタ等にペーストして利用できます。
4. **検索・詳細確認**:
   - 記号の意味や名称がわからないときは、マウスカーソルを合わせると画面下部のステータスバーに日本語名・英語名・調音位置が表示されます。

---

### 🛠️ 開発者向けガイド (Developer Guide)

本プロジェクトは **Pure HTML / CSS / JavaScript (Vanilla JS)** で実装されており、ビルドツール（Webpack, Vite等）や外部ライブラリへの依存はありません。

#### ディレクトリ構成

```text
ipa-editor/
├── index.html            # メインHTML（UI構造、メタタグ、OGP設定）
├── style.css             # スイス・スタイルCSS（グリッド、レスポンシブ、固定ヘッダー）
├── app.js                # アプリケーションロジック（入力処理、合字レンダリング、イベント制御）
├── data.js               # IPA全339記号のメタデータ辞書（名称・英語名・分類）
├── i18n.js               # 多言語翻訳辞書（日英UIテキスト、表ヘッダー、カテゴリ対応）
├── favicon.svg           # ベクターファビコン
├── favicon.png           # 32x32 ファビコン
├── apple-touch-icon.png  # 180x180 アプリアイコン
├── og-image.png          # 1200x630 OGPプレビュー画像
├── README.md             # 本ドキュメント（日英バイリンガル）
├── CHECKLIST.md          # 全機能の検証チェックリスト & 仕様書
├── LICENSE               # MITライセンス
└── .gitignore            # Git除外設定
```

#### ローカルでの実行

ビルドステップは不要です。以下のいずれかの方法で即座に動作確認できます：

```bash
# Python を使用する場合
python -m http.server 8000

# Node.js (npx) を使用する場合
npx serve .
```
ブラウザで `http://localhost:8000` を開きます。

---

### 🌐 デプロイ (GitHub Pages)

このリポジトリは GitHub Pages に最適化されています。
`main` ブランチの root (`/`) を公開元として設定するだけで、自動的にデプロイされます。

---

## 📜 ライセンス / License

[MIT License](LICENSE)
