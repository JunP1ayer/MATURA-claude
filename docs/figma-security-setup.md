# MATURAセキュアFigma連携システム 設定ガイド

## 🔐 セキュリティ機能一覧

### 1. 監視機能 (FigmaApiMonitor)
- **API使用状況の追跡**
  - リクエスト数、レスポンス時間、エラー率
  - エンドポイント別の利用統計
  - 時間別・日別レポート

### 2. セキュリティ監視 (FigmaSecurityMonitor)
- **異常検知**
  - 高頻度アクセス検知
  - 未許可IPからのアクセス
  - 営業時間外アクセス
  - 疑わしいUser-Agent

### 3. セキュアクライアント (SecureFigmaClient)
- **統合セキュリティ**
  - 自動リトライ機能
  - Rate limiting
  - 指数バックオフ
  - 一時的IPブロック

## 🛠️ 環境変数設定

### 必須設定
```bash
# 基本設定
FIGMA_API_KEY=figd_your_api_key_here
FIGMA_TEAM_ID=your-team-id
DEFAULT_FIGMA_FILE_ID=your-default-file-id

# セキュリティ設定
FIGMA_USE_SECURE_CLIENT=true
FIGMA_ENABLE_IP_RESTRICTION=false
FIGMA_ALLOWED_IPS=127.0.0.1,::1,localhost
FIGMA_MAX_REQUESTS_PER_MINUTE=30
```

### オプション設定
```bash
# 監視・アラート
MONITORING_WEBHOOK=https://your-monitoring-webhook.com
SECURITY_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url

# 環境設定
NODE_ENV=development
```

## 🚀 使用方法

### 1. 基本的な使用
```typescript
import { SecureFigmaClient } from '@/lib/secure-figma-client'

const client = new SecureFigmaClient({
  apiKey: process.env.FIGMA_API_KEY!,
  teamId: 'your-team-id',
  enableMonitoring: true,
  enableSecurity: true
})

const context = {
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  sessionId: 'session-123'
}

const fileData = await client.getFileSecurely(fileId, context)
```

### 2. APIテストエンドポイント
```bash
# 基本テスト
GET /api/figma-test?fileId=YOUR_FILE_ID

# セキュアクライアントテスト
GET /api/figma-test?fileId=YOUR_FILE_ID&secure=true

# 詳細テスト
POST /api/figma-test
{
  "fileId": "YOUR_FILE_ID",
  "tests": ["basic", "security", "performance"]
}
```

## 📊 監視とレポート

### 使用状況レポート
```typescript
const report = client.getUsageReport('today')
console.log(report)
// {
//   totalRequests: 150,
//   errorRate: 0.02,
//   averageResponseTime: 1250,
//   topEndpoints: [...]
// }
```

### エラー履歴
```typescript
const errors = client.getRecentErrors(10)
console.log(errors)
```

## 🔔 アラート設定

### Slack通知の設定
```bash
# Slack Webhook URL を設定
SECURITY_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

### カスタムアラート
```typescript
securityMonitor.onAlert((anomaly) => {
  console.log(`Alert: ${anomaly.message}`)
  // カスタム処理
})
```

## 🛡️ セキュリティ設定

### IPアクセス制限
```bash
# IP制限を有効化
FIGMA_ENABLE_IP_RESTRICTION=true

# 許可するIP（CIDR記法対応）
FIGMA_ALLOWED_IPS=192.168.1.0/24,10.0.0.0/8,127.0.0.1
```

### Rate Limiting
```bash
# 1分間あたりのリクエスト制限
FIGMA_MAX_REQUESTS_PER_MINUTE=30

# 1時間あたりのリクエスト制限
FIGMA_MAX_REQUESTS_PER_HOUR=1000
```

## 🔧 本番環境での設定

### 1. 環境変数の設定
```bash
# 本番環境
NODE_ENV=production
FIGMA_USE_SECURE_CLIENT=true
FIGMA_ENABLE_IP_RESTRICTION=true

# 監視設定
MONITORING_WEBHOOK=https://your-datadog-webhook.com
SECURITY_WEBHOOK_URL=https://your-slack-webhook.com
```

### 2. ログ設定
```bash
# 詳細ログを無効化（本番環境）
FIGMA_ENABLE_DEBUG_LOGS=false
```

## 🚨 トラブルシューティング

### 403エラーの対処
1. **APIキーの確認**
   ```bash
   curl -H "X-Figma-Token: YOUR_API_KEY" https://api.figma.com/v1/me
   ```

2. **ファイル権限の確認**
   - ファイルが公開されているか
   - 共有設定が「Anyone with link can view」になっているか

3. **IP制限の確認**
   ```bash
   # IP制限を一時的に無効化
   FIGMA_ENABLE_IP_RESTRICTION=false
   ```

### セキュリティアラートの調整
```typescript
// セキュリティ設定の更新
client.updateSecurityConfig({
  maxRequestsPerMinute: 50,
  enableOffHoursAlert: false
})
```

## 📈 パフォーマンス最適化

### 1. キャッシュの実装
```typescript
// Redis等でのキャッシュ実装例
const cachedData = await redis.get(`figma:${fileId}`)
if (cachedData) {
  return JSON.parse(cachedData)
}
```

### 2. バッチ処理
```typescript
// 複数ファイルの並列処理
const promises = fileIds.map(id => 
  client.getOptimizedFileData(id, context)
)
const results = await Promise.all(promises)
```

## 🔄 APIキーローテーション

### 1. 新しいAPIキーの生成
1. Figma設定でPersonal Access Tokenを作成
2. 必要なスコープを設定
3. 環境変数を更新

### 2. 段階的な移行
```bash
# 1. 新しいキーを追加
FIGMA_API_KEY_NEW=new_api_key

# 2. 古いキーと併用
FIGMA_API_KEY_OLD=old_api_key

# 3. 完全移行後、古いキーを削除
```

## 📋 チェックリスト

### 初期設定
- [ ] APIキーの設定
- [ ] チームIDの設定
- [ ] デフォルトファイルIDの設定
- [ ] セキュリティ設定の確認

### 本番環境
- [ ] IP制限の設定
- [ ] 監視Webhookの設定
- [ ] アラート設定の確認
- [ ] ログ設定の最適化

### 定期メンテナンス
- [ ] APIキーのローテーション（月1回）
- [ ] 使用状況レポートの確認（週1回）
- [ ] セキュリティログの確認（日1回）
- [ ] 異常検知設定の調整（必要に応じて）

## 🆘 サポート

問題が発生した場合は、以下の情報とともにお問い合わせください：

1. 使用状況レポート
2. 最近のエラーログ
3. 環境変数設定（APIキーを除く）
4. 発生時刻と状況