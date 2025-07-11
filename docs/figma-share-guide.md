# Figmaファイル共有設定ガイド

## 📋 Figmaファイルを共有する手順

### 1. Figmaでファイルを開く
![Figma File](https://via.placeholder.com/600x400)

### 2. 右上の「Share」ボタンをクリック
- 青い「Share」ボタンを探す
- クリックして共有メニューを開く

### 3. 共有設定を変更
```
Share → Anyone with the link → Can view
```

### 4. リンクをコピー
- 「Copy link」ボタンをクリック
- リンクがコピーされます

### 5. File IDを抽出
コピーしたリンクから File ID を取得：

```
https://www.figma.com/file/ABC123XYZ456/My-Design-File?node-id=0%3A1
                          ^^^^^^^^^^^^^ 
                          これがFile ID
```

### 6. .env.localに設定
```bash
DEFAULT_FIGMA_FILE_ID=ABC123XYZ456
```

## ⚠️ 重要な注意点

- **プライベートファイル**は共有設定にしないとAPIでアクセスできません
- **「Can view」権限**が最低限必要です
- **組織のファイル**の場合、組織の設定によってはアクセスできない場合があります

## 🎯 テスト方法

設定後、以下のコマンドでテスト：

```bash
curl -H "X-Figma-Token: YOUR_API_KEY" \
  "https://api.figma.com/v1/files/YOUR_FILE_ID" \
  | grep "name"
```

成功すれば、ファイル名が表示されます。