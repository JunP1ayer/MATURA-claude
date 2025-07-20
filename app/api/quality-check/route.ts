import { NextRequest, NextResponse } from 'next/server';
import { qualityEvaluationSystem } from '@/lib/quality-evaluation-system';

export async function POST(request: NextRequest) {
  try {
    const { generatedCode, projectPath = process.cwd() } = await request.json();

    if (!generatedCode) {
      return NextResponse.json(
        { error: '生成されたコードが必要です' },
        { status: 400 }
      );
    }

    console.log('🔍 Starting quality evaluation...');
    
    const qualityReport = await qualityEvaluationSystem.evaluateQuality(
      generatedCode, 
      projectPath
    );

    console.log('📊 Quality evaluation completed');
    console.log(`Overall Score: ${qualityReport.metrics.overallScore}/100`);
    console.log(`Production Readiness: ${qualityReport.metrics.productionReadiness}%`);

    return NextResponse.json({
      success: true,
      data: qualityReport,
      summary: {
        overallScore: qualityReport.metrics.overallScore,
        productionReadiness: qualityReport.metrics.productionReadiness,
        codeQualityScore: qualityReport.metrics.codeQuality.score,
        uiQualityScore: qualityReport.metrics.uiQuality.score,
        functionalityScore: qualityReport.metrics.functionality.score,
        recommendationCount: qualityReport.recommendations.length,
        issueCount: qualityReport.issues.length
      }
    });

  } catch (error) {
    console.error('💥 Quality evaluation error:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: '品質評価中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'quality-check',
    version: '1.0',
    description: '30分プレミアム品質評価システム',
    features: [
      'comprehensive-code-analysis',
      'ui-quality-evaluation',
      'functionality-assessment',
      'production-readiness-check',
      'automated-recommendations',
      'issue-detection'
    ],
    metrics: {
      codeQuality: ['typescript', 'errors', 'coverage', 'complexity'],
      uiQuality: ['lighthouse', 'accessibility', 'responsiveness', 'consistency'],
      functionality: ['completeness', 'error-handling', 'performance', 'usability']
    },
    timestamp: new Date().toISOString()
  });
}