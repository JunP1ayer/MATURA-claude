# MATURA - トラブルシューティングガイド

## 「OpenAIに接続できませんでした」エラーの対処法

### 問題の症状
- FreeTalkで日本語を入力して送信すると「OpenAIに接続できませんでした。もう一度お試しください。」が表示される
- APIは正常に動作している（curl テストでは200 OK）
- ブラウザのコンソールにAbortError関連のログが出力される

### 根本原因
1. **二重クリック・重複リクエスト**: ユーザーが送信ボタンを複数回クリック
2. **競合状態**: React の re-render によるコンポーネントの状態競合
3. **AbortController の不適切な使用**: リクエストキャンセルロジックが過度に敏感

### 解決策

#### 1. リクエストキューイングの実装
```typescript
// hooks/useChatOptimized.ts
// 同時リクエストを防ぐ
if (isLoading) {
  console.log('[useChatOptimized] Request already in progress, ignoring new request')
  return null
}
```

#### 2. 送信ボタンの二重クリック防止
```typescript
// components/phases/FreeTalk.tsx  
const handleSend = async () => {
  if (!input.trim() || chatOptimized.isLoading) {
    console.log('[FreeTalk] Ignoring send - input empty or loading')
    return
  }
  // ...
}
```

#### 3. タイムアウト設定の最適化
- 90秒 → 60秒に短縮（ユーザビリティ向上）
- より明確なタイムアウトエラーメッセージ

#### 4. 詳細なエラーロギング
```typescript
if (err.name === 'AbortError') {
  console.error('[useChatOptimized] Request was aborted. Details:', {
    name: err.name,
    message: err.message,
    stack: err.stack
  })
  
  const errorMessage = err.message.includes('timeout')
    ? 'リクエストがタイムアウトしました。ネットワーク接続を確認してもう一度お試しください。'
    : 'リクエストがキャンセルされました。もう一度お試しください。'
}
```

### デバッグ手順

#### 1. ブラウザの開発者ツールを開く
1. Chrome/Edge: F12 または右クリック → 検証
2. Consoleタブを選択

#### 2. エラー発生時の確認項目
- `[useChatOptimized]` で始まるログを確認
- `[FreeTalk]` で始まるログを確認  
- `[/api/chat]` で始まるサーバーログを確認

#### 3. 正常なログの例
```
[FreeTalk] Ignoring send - input empty or loading: false
[useChatOptimized] Starting fetch to /api/chat, phase: FreeTalk  
[useChatOptimized] Fetch completed, status: 200
[useChatOptimized] Response data received: {hasMessage: true, messageLength: 95}
[FreeTalk] Received AI response, length: 95
```

#### 4. 異常なログの例
```
[useChatOptimized] Request already in progress, ignoring new request
[useChatOptimized] Request was aborted. Details: {name: "AbortError", message: "..."}
```

### 緊急対処法

#### 1. ページリロード
- F5 または Ctrl+R でページを再読み込み
- これにより AbortController の状態がリセットされる

#### 2. ブラウザキャッシュクリア
- Chrome: Ctrl+Shift+Delete → 「キャッシュされた画像とファイル」をクリア
- 開発者モード: Network タブ → 「Disable cache」をチェック

#### 3. サーバー再起動
```bash
# ターミナルで実行
npm run dev
```

### 予防策

1. **送信後の即座な再送信を避ける**
   - 応答が返るまで待つ
   - ローディング表示を確認する

2. **ネットワーク環境の確認**
   - 安定したインターネット接続を使用
   - VPN使用時は接続品質を確認

3. **ブラウザの更新**
   - 最新版のChrome/Edge/Firefoxを使用
   - 古いブラウザではfetch APIの動作が不安定な場合がある

### それでも解決しない場合

1. **ログの全文をコピー**してサポートに連絡
2. **再現手順**を詳細に記録
3. **ブラウザとOSの情報**を提供

---
最終更新: 2025-06-19  
バージョン: fix/request-cancel-v2