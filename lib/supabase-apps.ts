import { createClient } from '@supabase/supabase-js';

// Supabase設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// サーバーサイド用クライアント（全権限）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// 生成されたアプリのデータ型
export interface GeneratedApp {
  id: string;
  name: string;
  description?: string;
  user_idea: string;
  schema: object;
  generated_code: string;
  preview_url?: string;
  status: 'active' | 'archived' | 'draft';
  user_id?: string;
  created_at: string;
  updated_at: string;
}

// 新しいアプリ作成用の型
export interface CreateAppRequest {
  name: string;
  description?: string;
  user_idea: string;
  schema: object;
  generated_code: string;
}

/**
 * 新しいアプリをデータベースに保存
 */
export async function createGeneratedApp(appData: CreateAppRequest, userId?: string): Promise<GeneratedApp> {
  const { data, error } = await supabaseAdmin
    .from('generated_apps')
    .insert({
      name: appData.name,
      description: appData.description,
      user_idea: appData.user_idea,
      schema: appData.schema,
      generated_code: appData.generated_code,
      preview_url: null, // 後で設定
      status: 'active',
      user_id: userId || null
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create app:', error);
    throw new Error(`Failed to save app: ${error.message}`);
  }

  return data;
}

/**
 * IDでアプリを取得
 */
export async function getGeneratedApp(id: string): Promise<GeneratedApp | null> {
  const { data, error } = await supabaseAdmin
    .from('generated_apps')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('Failed to get app:', error);
    throw new Error(`Failed to get app: ${error.message}`);
  }

  return data;
}

/**
 * 全アプリの一覧を取得（最新順）
 */
export async function getAllGeneratedApps(limit: number = 50, userId?: string): Promise<GeneratedApp[]> {
  let query = supabaseAdmin
    .from('generated_apps')
    .select('*')
    .eq('status', 'active');

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to get apps:', error);
    throw new Error(`Failed to get apps: ${error.message}`);
  }

  return data;
}

/**
 * アプリ名を生成（user_ideaから）
 */
export function generateAppName(userIdea: string): string {
  // 最初の文から簡潔な名前を生成
  const firstSentence = userIdea.split(/[。.!?]/)[0];
  const cleanName = firstSentence
    .replace(/[^a-zA-Z0-9あ-んア-ンー一-龯\s]/g, '')
    .trim()
    .substring(0, 30);
  
  return cleanName || 'Generated App';
}

/**
 * プレビューURLを更新
 */
export async function updatePreviewUrl(id: string, previewUrl: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('generated_apps')
    .update({ preview_url: previewUrl })
    .eq('id', id);

  if (error) {
    console.error('Failed to update preview URL:', error);
    throw new Error(`Failed to update preview URL: ${error.message}`);
  }
}