import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import { PreviewPageClient } from '@/components/PreviewPageClient';

interface PageProps {
  params: {
    appId: string;
  };
}

async function getAppFromFileSystem(appId: string) {
  try {
    const appDir = path.join(process.cwd(), 'app', appId);
    const metadataPath = path.join(appDir, 'metadata.json');
    const pagePath = path.join(appDir, 'page.tsx');
    
    // ファイルの存在確認
    await fs.access(metadataPath);
    await fs.access(pagePath);
    
    const metadataContent = await fs.readFile(metadataPath, 'utf-8');
    const metadata = JSON.parse(metadataContent);
    
    const pageCode = await fs.readFile(pagePath, 'utf-8');
    
    return {
      id: appId,
      name: metadata.appType,
      description: metadata.description,
      user_idea: metadata.user_idea,
      schema: metadata.schema,
      generated_code: pageCode,
      status: metadata.status || 'active',
      created_at: metadata.timestamp
    };
  } catch (error) {
    console.error(`Failed to load app ${appId}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const app = await getAppFromFileSystem(params.appId);
  
  if (!app) {
    return {
      title: 'アプリが見つかりません',
    };
  }

  return {
    title: `${app.name} - プレビュー | MATURA`,
    description: app.description || app.user_idea,
  };
}

export default async function PreviewPage({ params }: PageProps) {
  const app = await getAppFromFileSystem(params.appId);

  if (!app) {
    notFound();
  }

  return <PreviewPageClient app={app} />;
}