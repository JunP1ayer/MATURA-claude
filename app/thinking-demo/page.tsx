'use client'

import React from 'react'
import StructuredThinkingLayout from '@/components/thinking/StructuredThinkingLayout'

export default function ThinkingDemoPage() {
  return (
    <StructuredThinkingLayout 
      figmaFileId="iBSG2tTkhYM9Ucvi04u5sx"
      initialData={{
        why: '',
        who: '',
        what: [],
        how: '',
        impact: ''
      }}
    />
  )
}