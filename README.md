# IPA入力 国際音声字母エディタ (International Phonetic Alphabet Editor)

現代的で合理的なスイス・スタイル（Swiss Typographic Style）による、**国際音声字母 (International Phonetic Alphabet)** 入力エディタです。  
言語学・音声学の講義や研究、辞書編纂、音声分析、語学学習などに最適化されています。

---

## 🌟 主な特徴と仕様

- **全339字母・補助記号・声調記号を完全網羅**: 肺臓気流子音、非肺臓気流（吸着音・入破音・放出音）、二重調音（Double Articulation）、母音台形（全28種）、補助記号（Diacritics）、超分節要素・声調バー（Suprasegmentals & Tones）を網羅。
- **一貫したスイス・グリッドデザイン**: 余計な装飾を削ぎ落とし、1pxボーダーと整然としたグリッド・小見出しで構造化。
- **五段階声調バー（Chao Tone Letters）の合字（Ligature）対応**: `˥`（超高）〜 `˩`（超低）の組み合わせが、高精細SVGトーンバーとして連続した折れ線グラフ（合字）として自然に連結表示・入力可能。
- **公式フォント「Noto Sans」＋「Noto Sans JP」によるタイポグラフィ**: 結合文字（ダイアクリティカルマーク）のズレや声調記号の文字化けを排除し、学術用途に耐えうる正確な表示を確保。
- **母音台形 (Vowel Trapezoid) の正確なプロポーション**: アスペクト比を最適化したSVG幾何学フレーム上に全28基本母音を正確にプロット。
- **固定入力パネル（Sticky Dock）**: スクロールしても入力欄とツールバーが画面上部に固定され、快適な連続入力・コピー・消去・元に戻す（Undo）操作が可能。
- **ホバーティッカー解説**: 字母にカーソルを合わせると、ステータスバーに正式名称・英語名・調音分類がリアルタイム表示。
- **キーボードショートカット**: `?` または `Shift` + `/` で操作ガイドを即座に表示。

---

## 🚀 GitHub Pages を使ってインターネットに無料公開する方法

このアプリケーションは **完全な静的Webサイト（HTML / CSS / JavaScript / 画像）** のため、GitHub Pages を使えば **完全無料・サーバー契約不要** で全世界にWebサイトとして公開できます。

### 手順（ブラウザから行う一番簡単な方法）

#### ステップ 1: GitHubで新しいリポジトリを作成
1. [GitHub](https://github.com/) にログインします。
2. 画面右上の「**+**」アイコンをクリックし、「**New repository**」を選択します。
3. リポジトリ名を入力します（例: `ipa-editor` または `ipa-keyboard`）。
4. 公開範囲を「**Public**」（無料プランでGitHub Pagesを使う場合は必須）に設定します。
5. 「**Create repository**」ボタンを押します。

#### ステップ 2: ファイルをアップロード
1. 作成直後のリポジトリ画面で、「**uploading an existing file**」というリンクをクリックします。
2. この `ipa-keyboard` フォルダ内の以下のファイルをまとめてブラウザの枠内にドラッグ＆ドロップします：
   - `index.html`
   - `style.css`
   - `app.js`
   - `data.js`
   - `favicon.svg`
   - `favicon.png`
   - `apple-touch-icon.png`
   - `og-image.png`
   - `README.md`
   - `LICENSE`
   - `.gitignore`
3. 画面下の「**Commit changes**」ボタンを押します。

#### ステップ 3: GitHub Pages を有効化
1. リポジトリ上部のメニューから「**Settings**」タブをクリックします。
2. 左サイドバーの「**Pages**」をクリックします。
3. **Build and deployment** の **Source** が `Deploy from a branch` になっていることを確認します。
4. **Branch** の項目で、ドロップダウンから `main` を選び、右隣のフォルダを `/ (root)` のまま「**Save**」ボタンを押します。

#### ステップ 4: 公開URLの確認
- 1〜2分待ってページを再読み込み（F5）すると、画面上部に：
  > **Your site is live at `https://<あなたのユーザー名>.github.io/<リポジトリ名>/`**
  というURLが表示されます。
- このURLにアクセスすれば、PC・スマートフォン・タブレットから誰でも利用可能です！SNS（X / Facebook等）にシェアすると、自動生成されたOGPカード画像が綺麗にプレビューされます。

---

## 💻 ローカル（自分のPC）で試す方法

`index.html` をダブルクリックして普段お使いのブラウザ（Chrome, Edge, Firefox, Safariなど）で開くだけで、インターネット接続がなくてもご利用いただけます。

---

## 📜 ライセンス
MIT License
