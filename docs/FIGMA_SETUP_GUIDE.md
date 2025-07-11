# Figma API連携セットアップガイド

## 🔐 APIキーの取得と権限設定

### 1. APIキーの生成
1. [Figma Settings](https://www.figma.com/settings) にアクセス
2. 「Personal access tokens」セクションへ
3. 「Create a new personal access token」をクリック
4. トークン名を入力（例：`MATURA Development`）
5. **重要**: 以下のスコープを選択
   - ✅ File content (読み取り)
   - ⚠️ User information は不要（/v1/me は使用しない）

### 2. ファイルアクセス権限の設定

#### プライベートファイルを共有可能にする方法

**オプション1: View権限で共有（推奨）**
1. Figmaでファイルを開く
2. 右上の「Share」ボタンをクリック
3. 「Anyone with the link」を選択
4. 「Can view」を選択
5. 「Copy link」でリンクをコピー
6. URLから File ID を抽出：
   ```
   https://www.figma.com/file/ABC123XYZ/File-Name
                              ^^^^^^^^^ これがFile ID
   ```

**オプション2: チームスペースに移動**
1. ファイルをチームのプロジェクトに移動
2. チームメンバー全員がアクセス可能に
3. APIキーを持つユーザーがチームメンバーであることを確認

## 🧪 APIテスト方法

### 基本的なテストコマンド

```bash
# ファイルアクセステスト（推奨）
curl -H "X-Figma-Token: YOUR_API_KEY" \
  "https://api.figma.com/v1/files/FILE_ID" \
  | jq '.name'

# 画像取得テスト
curl -H "X-Figma-Token: YOUR_API_KEY" \
  "https://api.figma.com/v1/files/FILE_ID/images" \
  | jq '.meta.images'
```

### エラー対応表

| エラーコード | 原因 | 解決方法 |
|------------|------|---------|
| 403 | APIキーが無効 | 新しいキーを生成 |
| 403 | ファイルアクセス権限なし | ファイルを共有設定に変更 |
| 404 | ファイルが存在しない | File IDを確認 |
| 429 | レート制限 | 1分待機してリトライ |

## 🎯 推奨構成

### 開発環境
- パブリックなコミュニティファイルを使用
- またはView権限で共有された開発用ファイル

### 本番環境
- 専用のデザインシステムファイル
- チーム共有設定で管理
- 環境変数で File ID を管理

## 📋 チェックリスト

- [ ] APIキーを生成（File content権限付き）
- [ ] `.env.local` に `FIGMA_API_KEY` を設定
- [ ] テスト用ファイルIDを準備
- [ ] curlコマンドでAPIテスト実行
- [ ] 403エラーが出ないことを確認