#!/bin/bash

# Figma API テストスクリプト
# 使用方法: ./scripts/test-figma-api.sh

echo "🎨 Figma API 連携テストを開始します..."

# 環境変数を読み込み
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# カラー定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# APIキーの確認
if [ -z "$FIGMA_API_KEY" ]; then
    echo -e "${RED}❌ エラー: FIGMA_API_KEY が設定されていません${NC}"
    echo "  .env.local に FIGMA_API_KEY を設定してください"
    exit 1
fi

echo "✅ APIキーを検出しました: ${FIGMA_API_KEY:0:10}..."

# テスト用ファイルID
if [ -z "$1" ]; then
    FILE_ID="${DEFAULT_FIGMA_FILE_ID:-CzV0bcT5w8PVHxr3BRGVmL}"
    echo "📁 デフォルトファイルIDを使用: $FILE_ID"
else
    FILE_ID="$1"
    echo "📁 指定されたファイルIDを使用: $FILE_ID"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  ファイルアクセステスト (/v1/files/{file_id})"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ファイル情報取得
RESPONSE=$(curl -s -w "\n%{http_code}" -H "X-Figma-Token: $FIGMA_API_KEY" \
    "https://api.figma.com/v1/files/$FILE_ID")

HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
    FILE_NAME=$(echo "$BODY" | grep -o '"name":"[^"]*' | sed 's/"name":"//g' | head -1)
    LAST_MODIFIED=$(echo "$BODY" | grep -o '"lastModified":"[^"]*' | sed 's/"lastModified":"//g')
    
    echo -e "${GREEN}✅ 成功: ファイルにアクセスできました！${NC}"
    echo "   📄 ファイル名: $FILE_NAME"
    echo "   📅 最終更新: $LAST_MODIFIED"
else
    echo -e "${RED}❌ 失敗: HTTPステータス $HTTP_CODE${NC}"
    echo "   エラー内容: $BODY"
    
    if [ "$HTTP_CODE" -eq 403 ]; then
        echo ""
        echo -e "${YELLOW}💡 ヒント:${NC}"
        echo "   1. APIキーが正しいか確認してください"
        echo "   2. ファイルが共有設定になっているか確認してください"
        echo "   3. Figmaでファイルを開き、Share > Anyone with the link > Can view に設定"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  画像エクスポートテスト (/v1/images/{file_id})"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 画像URLを取得（最初のフレームのみ）
IMAGES_RESPONSE=$(curl -s -w "\n%{http_code}" -H "X-Figma-Token: $FIGMA_API_KEY" \
    "https://api.figma.com/v1/images/$FILE_ID?ids=0:1&format=png&scale=1")

IMAGES_HTTP_CODE=$(echo "$IMAGES_RESPONSE" | tail -n 1)
IMAGES_BODY=$(echo "$IMAGES_RESPONSE" | sed '$d')

if [ "$IMAGES_HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ 成功: 画像エクスポートAPIにアクセスできました！${NC}"
    echo "   レスポンス: $(echo "$IMAGES_BODY" | head -c 100)..."
else
    echo -e "${RED}❌ 失敗: HTTPステータス $IMAGES_HTTP_CODE${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  パブリックファイルテスト (Figma Community)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# パブリックファイルでテスト
PUBLIC_FILE="CzV0bcT5w8PVHxr3BRGVmL"
echo "📁 Material Design System (Public) をテスト中..."

PUBLIC_RESPONSE=$(curl -s -w "\n%{http_code}" -H "X-Figma-Token: $FIGMA_API_KEY" \
    "https://api.figma.com/v1/files/$PUBLIC_FILE" | tail -n 1)

if [ "$PUBLIC_RESPONSE" -eq 200 ]; then
    echo -e "${GREEN}✅ パブリックファイルへのアクセス成功！${NC}"
    echo "   → APIキーは正常に動作しています"
else
    echo -e "${RED}❌ パブリックファイルへのアクセス失敗${NC}"
    echo "   → APIキー自体に問題がある可能性があります"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 テスト結果サマリー"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$HTTP_CODE" -eq 200 ]; then
    echo -e "${GREEN}✅ Figma API連携は正常に動作しています！${NC}"
    echo ""
    echo "次のステップ:"
    echo "1. MATURAでアプリ生成をテスト: npm run dev"
    echo "2. ブラウザで http://localhost:3000/generator にアクセス"
    echo "3. アプリを生成してFigma連携を確認"
else
    echo -e "${YELLOW}⚠️  Figma API連携に問題があります${NC}"
    echo ""
    echo "推奨アクション:"
    echo "1. パブリックファイルID 'CzV0bcT5w8PVHxr3BRGVmL' を使用"
    echo "2. または、Figmaファイルを共有設定に変更"
    echo "3. 新しいAPIキーを生成（File content権限付き）"
fi