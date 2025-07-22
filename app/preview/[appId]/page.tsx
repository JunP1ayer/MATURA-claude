import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PreviewPageClient } from '@/components/PreviewPageClient';
import { getGeneratedApp } from '@/lib/supabase-apps';

interface PageProps {
  params: {
    appId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const app = await getGeneratedApp(params.appId);
  
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
  const app = await getGeneratedApp(params.appId);

  if (!app) {
    notFound();
  }

  return <PreviewPageClient app={app} />;
}