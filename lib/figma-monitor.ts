// FigmaApiMonitor - API使用状況監視クラス
export interface ApiUsageLog {
  requestId: string;
  endpoint: string;
  method: string;
  status: number;
  duration: number;
  timestamp: string;
  teamId: string;
  ip?: string;
}

export interface UsageReport {
  totalRequests: number;
  errorRate: number;
  averageResponseTime: number;
  topEndpoints: { endpoint: string; count: number }[];
}

export class FigmaApiMonitor {
  private apiKey: string;
  private teamId: string;
  private usageLog: ApiUsageLog[] = [];
  private maxLogSize = 10000; // メモリ制限

  constructor(apiKey: string, teamId: string) {
    this.apiKey = apiKey;
    this.teamId = teamId;
  }

  async makeRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();
    
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          'X-Figma-Token': this.apiKey,
          'X-Request-ID': requestId,
          'User-Agent': 'MATURA-App/1.0',
          ...options.headers
        }
      });
      
      // 使用状況をログに記録
      this.logUsage({
        requestId,
        endpoint,
        method: options.method || 'GET',
        status: response.status,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        teamId: this.teamId
      });
      
      return response;
    } catch (error) {
      this.logError({ 
        requestId, 
        endpoint, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  private logUsage(data: ApiUsageLog): void {
    this.usageLog.push(data);
    
    // ログサイズ制限
    if (this.usageLog.length > this.maxLogSize) {
      this.usageLog = this.usageLog.slice(-this.maxLogSize / 2);
    }
    
    // 外部監視サービスに送信（本番環境のみ）
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(data);
    }
  }

  private logError(data: { requestId: string; endpoint: string; error: string }): void {
    console.error(`[FigmaApiMonitor] Error: ${data.error}`, data);
  }

  private sendToMonitoringService(data: ApiUsageLog): void {
    // 実装例：外部監視サービスへの送信
    // 実際の実装では、DataDog、New Relic、CloudWatch などを使用
    try {
      if (process.env.MONITORING_WEBHOOK) {
        fetch(process.env.MONITORING_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service: 'matura-figma',
            data,
            timestamp: new Date().toISOString()
          })
        }).catch(console.error);
      }
    } catch (error) {
      console.error('Failed to send monitoring data:', error);
    }
  }

  generateUsageReport(timeRange: 'today' | 'week' | 'month' = 'today'): UsageReport {
    const now = new Date();
    let startTime: Date;
    
    switch (timeRange) {
      case 'today':
        startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startTime = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const filteredLogs = this.usageLog.filter(log => 
      new Date(log.timestamp) >= startTime
    );
    
    const errorCount = filteredLogs.filter(log => log.status >= 400).length;
    const totalDuration = filteredLogs.reduce((sum, log) => sum + log.duration, 0);
    
    // エンドポイント別の集計
    const endpointCounts = filteredLogs.reduce((acc, log) => {
      acc[log.endpoint] = (acc[log.endpoint] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topEndpoints = Object.entries(endpointCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([endpoint, count]) => ({ endpoint, count }));

    return {
      totalRequests: filteredLogs.length,
      errorRate: filteredLogs.length > 0 ? errorCount / filteredLogs.length : 0,
      averageResponseTime: filteredLogs.length > 0 ? totalDuration / filteredLogs.length : 0,
      topEndpoints
    };
  }

  getRecentErrors(limit: number = 10): ApiUsageLog[] {
    return this.usageLog
      .filter(log => log.status >= 400)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  clearLogs(): void {
    this.usageLog = [];
  }
}