'use client';

import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PreviewActionsProps {
  app: {
    id: string;
    name: string;
    status: string;
    created_at: string;
  };
  variant?: 'header' | 'mobile';
}

export function PreviewActions({ app, variant = 'header' }: PreviewActionsProps) {
  if (variant === 'header') {
    return (
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="text-xs">
          {app.status}
        </Badge>
        <Badge variant="secondary" className="text-xs">
          <Calendar className="h-3 w-3 mr-1" />
          {new Date(app.created_at).toLocaleDateString('ja-JP')}
        </Badge>
        <div className="hidden sm:flex items-center gap-2">
          <button 
            onClick={() => window.open(`/apps/${app.id}`, '_blank')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            詳細
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('プレビューURLをコピーしました');
            }}
            className="text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors"
          >
            共有
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:hidden mb-4 flex gap-2">
      <button 
        onClick={() => window.open(`/apps/${app.id}`, '_blank')}
        className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium"
      >
        詳細
      </button>
      <button 
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert('URLをコピーしました');
        }}
        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg font-medium"
      >
        共有
      </button>
    </div>
  );
}