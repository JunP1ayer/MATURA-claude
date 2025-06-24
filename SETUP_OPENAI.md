# OpenAI API キーの設定方法

このアプリケーションを動作させるには、有効なOpenAI APIキーが必要です。

## 手順

1. OpenAIのアカウントを作成
   - https://platform.openai.com/signup にアクセス

2. APIキーを取得
   - https://platform.openai.com/api-keys にアクセス
   - 「Create new secret key」をクリック
   - 生成されたキーをコピー（sk-で始まる文字列）

3. .env.localファイルを編集
   ```
   OPENAI_API_KEY=sk-あなたの実際のAPIキー
   ```
   
   注意: "YOUR_KEY_HERE" を実際のAPIキーに置き換えてください

4. アプリケーションを再起動
   ```bash
   npm run dev
   ```

## トラブルシューティング

- 「API認証エラーが発生しました」と表示される場合
  - .env.localファイルのOPENAI_API_KEYが正しく設定されているか確認
  - APIキーが有効期限内か確認
  - APIキーに必要な権限があるか確認

- 「リクエストがタイムアウトしました」と表示される場合
  - インターネット接続を確認
  - OpenAIのサービス状況を確認: https://status.openai.com/