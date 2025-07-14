-- 生成されたアプリを管理するテーブル
CREATE TABLE IF NOT EXISTS generated_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  user_idea TEXT NOT NULL,
  schema JSONB NOT NULL,
  generated_code TEXT NOT NULL,
  preview_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_generated_apps_updated_at 
    BEFORE UPDATE ON generated_apps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- インデックス作成（検索高速化）
CREATE INDEX IF NOT EXISTS idx_generated_apps_created_at ON generated_apps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_apps_status ON generated_apps(status);

-- RLS (Row Level Security) 設定
ALTER TABLE generated_apps ENABLE ROW LEVEL SECURITY;

-- 全ユーザーがアクセス可能（将来的に認証追加時に変更）
CREATE POLICY "Public access for generated_apps" 
ON generated_apps FOR ALL 
TO PUBLIC 
USING (true) 
WITH CHECK (true);