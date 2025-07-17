import { SimpleGenerator } from '@/components/SimpleGenerator';

export const metadata = {
  title: 'MATURA - AIが伴走する創造の旅',
  description: 'アイデアを入力するだけで、完全に動作するアプリを生成します',
};

export default function HomePage() {
  return <SimpleGenerator showRecentApps={false} />;
}