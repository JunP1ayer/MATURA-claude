import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            アプリが見つかりません
          </h1>
          
          <p className="text-gray-600 mb-6">
            指定されたIDのアプリは存在しないか、削除された可能性があります。
          </p>
          
          <Link href="/">
            <Button className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              ホームに戻る
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}